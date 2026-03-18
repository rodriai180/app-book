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
        id: Math.random().toString(36).slice(2, 11),
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
          // Improved HTML to Text conversion while preserving structure
          let structuredText = htmlContent
            .replace(/<head>[\s\S]*?<\/head>/gi, '') // Remove head
            .replace(/<h1[^>]*>([\s\S]*?)<\/h1>/gi, '\n# $1\n')
            .replace(/<h2[^>]*>([\s\S]*?)<\/h2>/gi, '\n## $1\n')
            .replace(/<h3[^>]*>([\s\S]*?)<\/h3>/gi, '\n### $1\n')
            .replace(/<li[^>]*>([\s\S]*?)<\/li>/gi, '\n• $1\n')
            .replace(/<p[^>]*>([\s\S]*?)<\/p>/gi, '\n$1\n')
            .replace(/<br\s*\/?>/gi, '\n')
            .replace(/<[^>]+>/g, '') // Remove remaining tags
            .replace(/&nbsp;/g, ' ')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&[a-z]+;/g, ''); // Remaining entities

          const paragraphs = structuredText
            .split(/\n+/)
            .map(p => p.trim())
            .filter(p => p.length > 0);

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

  private static normalizeForMatch(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // remove accents
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static async extractFromPdf(uri: string): Promise<string[]> {
    try {
      const pdf = await pdfjsLib.getDocument(uri).promise;
      const allSegments: string[] = [];

      // ── Obtener outline (bookmarks) del PDF ────────────────────────────────
      type OutlineEntry = { title: string; normalized: string; level: number };
      const outlineEntries: OutlineEntry[] = [];

      try {
        const outline = await (pdf as any).getOutline();
        if (outline && outline.length > 0) {
          const flatten = (items: any[], level: number) => {
            for (const item of items) {
              const title = (item.title || '').replace(/\s+/g, ' ').trim();
              if (title.length > 0) {
                outlineEntries.push({
                  title,
                  normalized: DocumentService.normalizeForMatch(title),
                  level,
                });
              }
              if (item.items && item.items.length > 0) {
                flatten(item.items, level + 1);
              }
            }
          };
          flatten(outline, 0);
        }
      } catch (_) {
        // outline not available — fall back to heuristics only
      }

      const hasOutline = outlineEntries.length > 0;

      for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
        const page = await pdf.getPage(pageNum);
        const { items } = await page.getTextContent() as { items: any[] };
        if (items.length === 0) continue;

        // Ancho real de la pagina (para centrado exacto)
        const pageWidth = page.getViewport({ scale: 1 }).width;

        // ── Paso 1: agrupar items en lineas visuales (mismo Y ± 2px) ──────────
        type RawLine = { y: number; text: string; fontSize: number; x: number; fontName: string };
        const lines: RawLine[] = [];

        for (const item of items) {
          if (!item.str?.trim()) continue;
          const y: number = item.transform[5];
          const x: number = item.transform[4];
          const fontSize: number = Math.abs(item.transform[0]);
          // Normalizar nombre de fuente: quitar prefijo subset "ABCDEF+"
          const fontName: string = (item.fontName || '').replace(/^[A-Z]{6}\+/, '');

          const existing = lines.find(l => Math.abs(l.y - y) < 2);
          if (existing) {
            existing.text += item.str;
            existing.fontSize = Math.max(existing.fontSize, fontSize);
          } else {
            lines.push({ y, text: item.str, fontSize, x, fontName });
          }
        }

        lines.sort((a, b) => b.y - a.y);

        // ── Paso 2: interlineado base (percentil 40, max 25pt) ─────────────────
        const gaps: number[] = [];
        for (let i = 1; i < lines.length; i++) {
          const g = lines[i - 1].y - lines[i].y;
          if (g > 1 && g < 100) gaps.push(g);
        }
        gaps.sort((a, b) => a - b);
        const baselineGap = Math.min(gaps[Math.floor(gaps.length * 0.4)] || 14, 25);

        // ── Paso 3: agrupar lineas en bloques segun gap ────────────────────────
        type Block = { text: string; fontSize: number; x: number; maxX: number; lineCount: number; gapBefore: number; fontName: string };
        const blocks: Block[] = [];
        let cur: Block | null = null;
        let prevY = 0;

        for (const line of lines) {
          const gap = cur ? (prevY - line.y) : 0;
          const isNewBlock = !cur || gap > baselineGap * 1.45;

          if (isNewBlock) {
            if (cur) blocks.push(cur);
            cur = { text: line.text, fontSize: line.fontSize, x: line.x, maxX: line.x, lineCount: 1, gapBefore: gap, fontName: line.fontName };
          } else {
            cur.text += ' ' + line.text;
            cur.lineCount++;
            cur.maxX = Math.max(cur.maxX, line.x);
          }
          prevY = line.y;
        }
        if (cur) blocks.push(cur);

        // Margen izquierdo de la pagina
        let leftMargin = 9999;
        for (const b of blocks) { if (b.x < leftMargin) leftMargin = b.x; }
        if (leftMargin === 9999) leftMargin = 72;

        // Tamaño de fuente mediano de la pagina
        const pageSizes = lines.map(l => l.fontSize).sort((a, b) => a - b);
        const medianFontSize = pageSizes[Math.floor(pageSizes.length * 0.5)] || 12;

        // ── Paso 4: detectar pagina de indice/TOC y saltarla ──────────────────
        const tocKeywords = ['tabla de contenido', 'table of contents', 'índice', 'contenido', 'indice'];
        const isTocPage = blocks.some(b => {
          const t = b.text.replace(/\s+/g, ' ').trim().toLowerCase();
          return tocKeywords.some(kw => t === kw || t.startsWith(kw + ' ') || t.endsWith(' ' + kw));
        });

        if (pageNum > 1) allSegments.push('---');

        if (isTocPage) {
          allSegments.push('>## Tabla de contenido');
          continue;
        }

        // ── Paso 5: clasificar bloques ─────────────────────────────────────────
        for (let bi = 0; bi < blocks.length; bi++) {
          const b = blocks[bi];
          const text = b.text.replace(/\s+/g, ' ').trim();
          if (text.length < 2) continue;

          // Centrado real: el bloque empieza al menos 15% del ancho de pagina
          // despues del margen izquierdo (evita falsos positivos por indentacion leve)
          const isCentered = b.x > leftMargin + pageWidth * 0.15;

          // ── Intento 1: buscar en el outline del PDF ──────────────────────────
          if (hasOutline) {
            const normBlock = DocumentService.normalizeForMatch(text);
            let matchedEntry: OutlineEntry | null = null;

            for (const entry of outlineEntries) {
              const shorter = normBlock.length < entry.normalized.length ? normBlock : entry.normalized;
              const longer  = normBlock.length < entry.normalized.length ? entry.normalized : normBlock;
              if (shorter.length === 0) continue;

              // El texto del bloque contiene el titulo del outline (o viceversa)
              if (longer.includes(shorter)) {
                const ratio = shorter.length / longer.length;
                if (ratio >= 0.75) {
                  matchedEntry = entry;
                  break;
                }
              }
            }

            if (matchedEntry !== null) {
              const prefix = matchedEntry.level === 0 ? '# ' : '## ';
              allSegments.push(isCentered ? `>${prefix}${text}` : `${prefix}${text}`);
              continue;
            }
          }

          // ── Intento 2: heuristica de respaldo ────────────────────────────────
          let nextText = '';
          let nextLineCount = 0;
          for (let ni = bi + 1; ni < blocks.length; ni++) {
            const ct = blocks[ni].text.replace(/\s+/g, ' ').trim();
            if (ct.length >= 2) { nextText = ct; nextLineCount = blocks[ni].lineCount; break; }
          }

          const isAllCaps        = text.replace(/[^a-zA-ZÁÉÍÓÚÜÑáéíóúüñ]/g, '').length > 3
                                    && text === text.toUpperCase();
          const isLargerFont     = b.fontSize > medianFontSize * 1.08;
          // Solo fuente con "bold/black/heavy" en el nombre — evita falsos positivos con italica
          const isBoldFont       = /bold|black|heavy/i.test(b.fontName);
          const endsWithTerminal = /[.!?,;]\s*$/.test(text);
          const isStructuralHeading = b.lineCount <= 4 && text.length <= 200 && !endsWithTerminal;
          const isFollowedByLong = nextText.length > 0
                                    && text.length < nextText.length * 0.5
                                    && (nextLineCount >= 2 || nextText.length > 80);

          const isHeading = isStructuralHeading && (isAllCaps || isLargerFont || isBoldFont || isCentered || isFollowedByLong);

          if (isHeading) {
            allSegments.push(isCentered ? `>## ${text}` : `## ${text}`);
          } else if (text.startsWith('•') || /^[0-9]+[.)]\s+/.test(text)) {
            allSegments.push(`• ${text.replace(/^[•]\s*|^[0-9]+[.)]\s*/, '')}`);
          } else {
            allSegments.push(text);
          }
        }
      }

      // ── Post-proceso: fusionar headings consecutivos partidos ─────────────
      // Un título centrado en 2 líneas se extrae como 2 bloques heading seguidos.
      // Si dos headings del mismo tipo van uno detrás del otro, se unen.
      const merged: string[] = [];
      for (let i = 0; i < allSegments.length; i++) {
        const seg = allSegments[i];
        const next = allSegments[i + 1];
        const isHeadingSeg = (s: string) => /^>?#+ /.test(s);
        const prefixOf = (s: string) => s.match(/^(>?#+ )/)?.[1] ?? '';

        if (
          isHeadingSeg(seg) && next && isHeadingSeg(next) &&
          prefixOf(seg) === prefixOf(next) &&
          next !== '---'
        ) {
          const prefix = prefixOf(seg);
          const textA = seg.slice(prefix.length);
          const textB = next.slice(prefix.length);
          merged.push(`${prefix}${textA} ${textB}`);
          i++; // saltear el siguiente
        } else {
          merged.push(seg);
        }
      }

      return merged.length > 0 ? merged : ['No se pudo extraer texto del documento.'];
    } catch (error) {
      console.error('Error extracting PDF:', error);
      return ['Error al leer el archivo PDF.'];
    }
  }
}
