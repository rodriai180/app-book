import { Timestamp } from 'firebase/firestore';

// ─── Interfaces existentes (en uso, no eliminar) ──────────────────────────────

export interface Book {
    id?: string;
    title: string;
    author: string;
    cover?: string;
    paragraphs: string[];
    currentParagraph: number;
    favorites?: number[];
    notes?: Record<string, string>;
    hasPdf?: boolean;
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
    hasPdf?: boolean;
    createdAt?: Timestamp;
}

export interface Summary {
    id: string;
    title: string;
    author?: string;
    coverUrl?: string;
    summaryText: string;
    buyLink?: string;
}

// ─── Nuevo modelo Book → Chapter → Microlearning ─────────────────────────────

export interface BookData {
    id?: string;
    title: string;
    author: string;
    coverImageUrl: string;
    category: string;
    tags: string[];
    purchaseLink: string;
    preface: string;
    shortSummary: string;
    longSummary: string;
    createdAt?: Timestamp;
}

export interface Exercise {
    title: string;
    description: string;
    type: 'reflection' | 'action' | 'journaling';
}

export interface ChapterData {
    id?: string;
    bookId: string;
    chapterNumber: number;
    title: string;
    summary: string;
    insights: string[];
    exercises: Exercise[];
    order: number;
    chapterImageUrl?: string;
}

export interface MicrolearningData {
    id?: string;
    title: string;
    content: string;
    reflectionQuestion: string;
    quickExercise: string;
    tags: string[];
    order: number;
    microlearningImageUrl?: string;
    // Datos desnormalizados para el feed
    bookId: string;
    bookTitle: string;
    bookAuthor: string;
    chapterId: string;
    chapterTitle: string;
    chapterNumber: number;
    category: string;
}
