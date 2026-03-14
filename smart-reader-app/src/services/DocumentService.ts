import * as DocumentPicker from 'expo-document-picker';
import * as pdfjsLib from 'pdfjs-dist';
import JSZip from 'jszip';

// Configurar el worker de PDF.js
if (typeof window !== 'undefined') {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

export interface DocumentMetadata {
  id: string;
  title: string;
  author: string;
  cover?: string;
  uri: string;
  mimeType?: string;
  pages?: string[];
}

export class DocumentService {
  static async pickDocument(): Promise<DocumentMetadata | null> {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ['application/pdf', 'text/plain', 'application/epub+zip'],
        copyToCacheDirectory: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return null;
      }

      const asset = result.assets[0];
      const isPdf = asset.mimeType === 'application/pdf' || asset.name.toLowerCase().endsWith('.pdf');
      
      // Generar metadatos básicos
      const doc: DocumentMetadata = {
        id: Math.random().toString(36).substr(2, 9),
        title: asset.name.replace(/\.(pdf|txt|epub)$/i, ''),
        author: 'Unknown Author',
        uri: asset.uri,
        mimeType: asset.mimeType,
      };

      // Intentar generar una portada si es PDF y estamos en web
      if (typeof window !== 'undefined' && asset.uri && isPdf) {
        try {
          const cover = await this.generateThumbnail(asset.uri);
          if (cover) doc.cover = cover;
        } catch (e) {
          console.warn('Could not generate thumbnail:', e);
        }
      }

      return doc;
    } catch (error) {
      console.error('Error picking document:', error);
      return null;
    }
  }

  static async generateThumbnail(uri: string): Promise<string | null> {
    try {
      const loadingTask = pdfjsLib.getDocument(uri);
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      
      const viewport = page.getViewport({ scale: 0.5 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      
      if (!context) return null;
      
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      return canvas.toDataURL();
    } catch (error) {
      console.error('Thumbnail generation error:', error);
      return null;
    }
  }

  static async extractText(uri: string): Promise<string[]> {
    const lowerUri = uri.toLowerCase();
    if (lowerUri.endsWith('.txt')) {
      return this.extractFromTxt(uri);
    }
    if (lowerUri.endsWith('.epub')) {
      return this.extractFromEpub(uri);
    }
    // Default to PDF
    return this.extractFromPdf(uri);
  }

  private static async extractFromEpub(uri: string): Promise<string[]> {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      const zip = await JSZip.loadAsync(blob);

      // 1. Find the OPF file to get the content manifest
      const containerFile = await zip.file('META-INF/container.xml')?.async('text');
      if (!containerFile) throw new Error('Invalid EPUB: Missing container.xml');

      const opfPathMatch = containerFile.match(/full-path="([^"]+)"/);
      if (!opfPathMatch) throw new Error('Invalid EPUB: Could not find OPF path');
      
      const opfPath = opfPathMatch[1];
      const opfDir = opfPath.substring(0, opfPath.lastIndexOf('/') + 1);
      const opfContent = await zip.file(opfPath)?.async('text');
      if (!opfContent) throw new Error('Invalid EPUB: Could not read OPF file');

      // 2. Parse manifest to find all XHTML/HTML files in reading order (from spine)
      // Extract manifest items
      const items: Record<string, string> = {};
      const itemMatches = opfContent.matchAll(/<item [^>]*id="([^"]+)" [^>]*href="([^"]+)" [^>]*media-type="application\/xhtml\+xml"/g);
      for (const match of itemMatches) {
        items[match[1]] = match[2];
      }

      // Extract spine order
      const spineItems: string[] = [];
      const spineMatch = opfContent.match(/<spine[^>]*>([\s\S]*?)<\/spine>/);
      if (spineMatch) {
        const itemrefMatches = spineMatch[1].matchAll(/<itemref [^>]*idref="([^"]+)"/g);
        for (const match of itemrefMatches) {
          if (items[match[1]]) {
            spineItems.push(items[match[1]]);
          }
        }
      }

      // 3. Extract text from each spine item
      const allParagraphs: string[] = [];
      for (const href of spineItems) {
        const filePath = opfDir + href;
        const htmlContent = await zip.file(filePath)?.async('text');
        if (htmlContent) {
          // Very basic HTML tag removal and paragraph extraction
          // Improved: split by <p> tags or similar block elements
          const cleanText = htmlContent
            .replace(/<head>[\s\S]*?<\/head>/gi, '') // Remove head
            .replace(/<[^>]+>/g, '\n') // Replace tags with newlines
            .replace(/&nbsp;/g, ' ')
            .replace(/&[a-z]+;/g, ''); // Basic entity removal

          const paragraphs = cleanText
            .split(/\n+/)
            .map(p => p.trim())
            .filter(p => p.length > 20); // Filter out very short lines/artifacts
          
          allParagraphs.push(...paragraphs);
        }
      }

      return allParagraphs.length > 0 ? allParagraphs : ['No se pudo extraer texto del EPUB.'];
    } catch (error) {
      console.error('Error reading EPUB:', error);
      return ['Error al leer el archivo EPUB. Puede que el formato sea incompatible.'];
    }
  }

  private static async extractFromTxt(uri: string): Promise<string[]> {
    try {
      const response = await fetch(uri);
      const text = await response.text();
      
      // Dividir por saltos de línea dobles para crear párrafos coherentes
      const paragraphs = text
        .split(/\n\s*\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0);
        
      return paragraphs.length > 0 ? paragraphs : ['El archivo TXT está vacío.'];
    } catch (error) {
      console.error('Error reading TXT:', error);
      return ['Error al leer el archivo de texto.'];
    }
  }

  private static async extractFromPdf(uri: string): Promise<string[]> {
    try {
      const loadingTask = pdfjsLib.getDocument(uri);
      const pdf = await loadingTask.promise;
      const allExtractedBlocks: string[] = [];
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const items = textContent.items as any[];
        
        if (items.length === 0) continue;

        // 1. Heuristic for median font size
        const fontSizes = items.filter(it => it.str.trim()).map(it => Math.abs(it.transform[0]));
        fontSizes.sort((a, b) => a - b);
        const medianSize = fontSizes[Math.floor(fontSizes.length / 2)] || 12;

        // 2. Group items into structural blocks
        items.sort((a, b) => b.transform[5] - a.transform[5] || a.transform[4] - b.transform[4]);

        const blocks: { text: string; size: number; y: number; x: number; isBold: boolean; fontName: string }[] = [];
        let currentBlock: any = null;

        for (const item of items) {
          if (!item.str.trim()) continue;

          const y = item.transform[5];
          const x = item.transform[4];
          const fontSize = Math.round(Math.abs(item.transform[0]) * 100) / 100;
          const fontName = item.fontName || '';
          const isBold = fontName.toLowerCase().includes('bold') || 
                         fontName.toLowerCase().includes('black') || 
                         fontName.toLowerCase().includes('-b') || 
                         fontName.toLowerCase().includes('heavy') ||
                         fontName.toLowerCase().includes('semibold') ||
                         fontName.toLowerCase().includes('demi');
          
          if (!currentBlock) {
            currentBlock = { text: item.str, size: fontSize, y, x, isBold, fontName };
          } else {
            const verticalGap = Math.abs(y - currentBlock.y);
            const sizeChanged = Math.abs(fontSize - currentBlock.size) > 0.1;
            const fontChanged = fontName !== currentBlock.fontName;
            const boldChanged = isBold !== currentBlock.isBold;

            // Decision: break if style changed or vertical gap > 1.2x font size
            if (sizeChanged || boldChanged || fontChanged || verticalGap > fontSize * 1.2) {
              blocks.push({ ...currentBlock });
              currentBlock = { text: item.str, size: fontSize, y, x, isBold, fontName };
            } else {
              const isNewLine = verticalGap > 3;
              currentBlock.text += (isNewLine ? " " : (item.str.startsWith(' ') ? "" : " ")) + item.str;
              currentBlock.y = y;
              currentBlock.x = x;
            }
          }
        }
        if (currentBlock) blocks.push(currentBlock);

        // 3. Transform blocks into readable segments with Markdown markers
        const pageBlocks = blocks.map(b => {
          const text = b.text.replace(/\s+/g, ' ').trim();
          if (text.length < 2) return '';

          const isH1 = b.size > medianSize * 1.35;
          const isH2 = (b.size > medianSize * 1.08) || (b.isBold && text.length < 150);
          const isCentered = b.x > 140 && b.x < 300 && text.length < 60;

          if (isH1 || isH2 || isCentered) {
            const marker = (isH1 || (isCentered && b.size > medianSize)) ? '# ' : '## ';
            return `${marker}${text}`;
          }
          return text;
        }).filter(t => t !== '');

        if (i > 1) allExtractedBlocks.push(`--- PÁGINA ${i} ---`);
        allExtractedBlocks.push(...pageBlocks);
      }
      
      return allExtractedBlocks.length > 0 ? allExtractedBlocks : ['No se pudo extraer texto del documento.'];
    } catch (error) {
      console.error('Error extracting PDF:', error);
      return ['Error al leer el archivo PDF.'];
    }
  }
}
