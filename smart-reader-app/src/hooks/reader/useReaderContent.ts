import { useState, useEffect, useRef } from 'react';
import { BookService } from '../../services/bookService';
import { PdfLocalStorage } from '../../services/PdfLocalStorage';

export const useReaderContent = (user: any, bookId: string | undefined) => {
    const [pages, setPages] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
    const [favorites, setFavorites] = useState<number[]>([]);
    const [notes, setNotes] = useState<Record<string, string>>({});
    const [pageNotes, setPageNotes] = useState<Record<string, string>>({});
    const [localPdfUri, setLocalPdfUri] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const savedBookId = useRef<string>(bookId || '');

    useEffect(() => {
        const loadContent = async () => {
            if (bookId && user) {
                setLoading(true);
                try {
                    const book = await BookService.getBook(user.uid, bookId);
                    if (book) {
                        setPages(book.paragraphs);
                        // localStorage tiene prioridad: es síncrono y más reciente que Firebase
                        let savedPage = book.currentParagraph || 0;
                        try {
                            const local = localStorage.getItem(`rp_${bookId}`);
                            if (local !== null) savedPage = parseInt(local) || savedPage;
                        } catch (_) {}
                        setCurrentPage(savedPage);
                        setFavorites(book.favorites || []);
                        setNotes(book.notes || {});
                        setPageNotes((book as any).pageNotes || {});

                        // Cargar URI del PDF local si existe (bloquea loading para evitar flash de texto)
                        if (book.hasPdf) {
                            try {
                                const uri = await PdfLocalStorage.getUri(bookId);
                                setLocalPdfUri(uri);
                            } catch (err) {
                                console.warn('Could not load local PDF:', err);
                            }
                        }
                    } else {
                        setPages(['No se encontró el libro.']);
                    }
                } catch (error) {
                    console.error('Error loading book:', error);
                    setPages(['Error al cargar el libro.']);
                } finally {
                    setLoading(false);
                }
            } else {
                setPages([
                    `Este es un ejemplo del contenido de un libro o documento procesado.`,
                    `Esta frase en particular está resaltada...`,
                    `El diseño busca ser minimalista...`
                ]);
                setLoading(false);
            }
        };

        loadContent();
    }, [bookId, user]);

    useEffect(() => {
        if (pages.length > 0 && savedBookId.current) {
            // Guardar en localStorage sincrónicamente (siempre funciona, incluso si Firebase falla)
            try { localStorage.setItem(`rp_${savedBookId.current}`, String(currentPage)); } catch (_) {}
        }
        if (user && savedBookId.current && pages.length > 0 && currentPage > 0) {
            BookService.updateReadingProgress(user.uid, savedBookId.current, currentPage)
                .catch(() => {});
        }
    }, [currentPage, user, pages.length]);

    return {
        pages,
        setPages,
        currentPage,
        setCurrentPage,
        favorites,
        setFavorites,
        notes,
        setNotes,
        pageNotes,
        setPageNotes,
        localPdfUri,
        loading,
        setLoading
    };
};
