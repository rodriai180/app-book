import { useState, useEffect, useRef } from 'react';
import { BookService } from '../../services/bookService';

export const useReaderContent = (user: any, bookId: string | undefined) => {
    const [pages, setPages] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(0);
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
                        setCurrentPage(book.currentParagraph || 0);
                        return book; // Return to allow hooks to sync their state
                    } else {
                        setPages(['No se encontró el libro.']);
                    }
                } catch (error) {
                    console.error('Error loading book:', error);
                    setPages(['Error al cargar el libro.']);
                }
                setLoading(false);
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
        if (user && savedBookId.current && pages.length > 0 && currentPage > 0) {
            BookService.updateReadingProgress(user.uid, savedBookId.current, currentPage)
                .catch((err) => console.warn('Could not save progress:', err));
        }
    }, [currentPage, user, pages.length]);

    return {
        pages,
        setPages,
        currentPage,
        setCurrentPage,
        loading,
        setLoading
    };
};
