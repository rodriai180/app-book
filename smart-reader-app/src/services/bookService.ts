import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../constants/firebaseConfig';

export interface Book {
    id?: string;
    title: string;
    author: string;
    cover?: string;
    paragraphs: string[];
    currentParagraph: number;
    favorites?: number[];
    notes?: Record<string, string>;
    // Canvas mode fields
    pdfUrl?: string;
    pageNotes?: Record<string, string>;
    createdAt?: Timestamp;
    updatedAt?: Timestamp;
}

export interface BookMetadata {
    id: string;
    title: string;
    author: string;
    cover?: string;
    currentParagraph: number;
    totalParagraphs: number;
    pdfUrl?: string;
    createdAt?: Timestamp;
}

const getUserBooksCollection = (userId: string) =>
    collection(db, 'users', userId, 'books');

export class BookService {
    /**
     * Save a new book to Firestore for the given user.
     */
    static async saveBook(userId: string, book: Omit<Book, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
        const booksRef = getUserBooksCollection(userId);
        const docRef = await addDoc(booksRef, {
            ...book,
            currentParagraph: 0,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });
        return docRef.id;
    }

    /**
     * Upload a PDF file (from a URI) to Firebase Storage and update the book's pdfUrl.
     */
    static async uploadPdf(userId: string, bookId: string, fileUri: string): Promise<string> {
        const response = await fetch(fileUri);
        const blob = await response.blob();
        const storageRef = ref(storage, `users/${userId}/books/${bookId}.pdf`);
        await uploadBytes(storageRef, blob);
        const downloadUrl = await getDownloadURL(storageRef);
        const bookRef = doc(db, 'users', userId, 'books', bookId);
        await updateDoc(bookRef, { pdfUrl: downloadUrl, updatedAt: serverTimestamp() });
        return downloadUrl;
    }

    /**
     * Get all books for a user (metadata only — no paragraphs to save bandwidth).
     */
    static async getUserBooks(userId: string): Promise<BookMetadata[]> {
        const booksRef = getUserBooksCollection(userId);
        const q = query(booksRef, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        return snapshot.docs.map((doc) => {
            const data = doc.data();
            return {
                id: doc.id,
                title: data.title,
                author: data.author,
                cover: data.cover,
                currentParagraph: data.currentParagraph || 0,
                totalParagraphs: data.paragraphs?.length || 0,
                pdfUrl: data.pdfUrl,
                createdAt: data.createdAt,
            };
        });
    }

    /**
     * Get a single book with full content (including paragraphs).
     */
    static async getBook(userId: string, bookId: string): Promise<Book | null> {
        const bookRef = doc(db, 'users', userId, 'books', bookId);
        const snapshot = await getDoc(bookRef);

        if (!snapshot.exists()) return null;

        return {
            id: snapshot.id,
            ...snapshot.data(),
        } as Book;
    }

    /**
     * Update the current reading paragraph for a book.
     */
    static async updateReadingProgress(userId: string, bookId: string, paragraph: number): Promise<void> {
        const bookRef = doc(db, 'users', userId, 'books', bookId);
        await updateDoc(bookRef, {
            currentParagraph: paragraph,
            updatedAt: serverTimestamp(),
        });
    }

    /**
     * Delete a book from the user's collection.
     */
    static async deleteBook(userId: string, bookId: string): Promise<void> {
        const bookRef = doc(db, 'users', userId, 'books', bookId);
        await deleteDoc(bookRef);
    }

    /**
     * Update favorites for a book.
     */
    static async toggleFavorite(userId: string, bookId: string, paragraphIndex: number, isFavorite: boolean): Promise<void> {
        const bookRef = doc(db, 'users', userId, 'books', bookId);
        const bookSnap = await getDoc(bookRef);
        if (!bookSnap.exists()) return;

        const data = bookSnap.data();
        let favorites = data.favorites || [];

        if (isFavorite) {
            if (!favorites.includes(paragraphIndex)) {
                favorites.push(paragraphIndex);
            }
        } else {
            favorites = favorites.filter((idx: number) => idx !== paragraphIndex);
        }

        await updateDoc(bookRef, {
            favorites,
            updatedAt: serverTimestamp(),
        });
    }

    /**
     * Save a note for a paragraph (text mode).
     */
    static async saveNote(userId: string, bookId: string, paragraphIndex: number, note: string): Promise<void> {
        const bookRef = doc(db, 'users', userId, 'books', bookId);
        const bookSnap = await getDoc(bookRef);
        if (!bookSnap.exists()) return;

        const data = bookSnap.data();
        let notes = data.notes || {};

        if (note.trim()) {
            notes[paragraphIndex.toString()] = note;
        } else {
            delete notes[paragraphIndex.toString()];
        }

        await updateDoc(bookRef, {
            notes,
            updatedAt: serverTimestamp(),
        });
    }

    /**
     * Save a note for a PDF page (canvas mode).
     */
    static async savePageNote(userId: string, bookId: string, pdfPage: number, note: string): Promise<void> {
        const bookRef = doc(db, 'users', userId, 'books', bookId);
        const bookSnap = await getDoc(bookRef);
        if (!bookSnap.exists()) return;

        const data = bookSnap.data();
        let pageNotes = data.pageNotes || {};

        if (note.trim()) {
            pageNotes[pdfPage.toString()] = note;
        } else {
            delete pageNotes[pdfPage.toString()];
        }

        await updateDoc(bookRef, {
            pageNotes,
            updatedAt: serverTimestamp(),
        });
    }
}
