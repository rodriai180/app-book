import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  query,
  orderBy,
  where,
  limit as firestoreLimit,
  startAfter,
  writeBatch,
  serverTimestamp,
  QueryDocumentSnapshot,
  DocumentReference,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "../../constants/firebaseConfig";
import { BookData, ChapterData, MicrolearningData } from "../models/BookModels";

// ─── uploadCoverImage ─────────────────────────────────────────────────────────

/**
 * Sube una imagen de portada a Firebase Storage y devuelve la URL de descarga.
 * @param uri  URI local del archivo (blob URL en web, file URI en nativo)
 * @param bookId  ID del libro (o ID temporal si el libro aún no existe)
 */
export async function uploadCoverImage(
  uri: string,
  bookId: string,
): Promise<string> {
  const response = await fetch(uri);
  const blob = await response.blob();
  const ext = blob.type.split("/")[1] ?? "jpg";
  const storageRef = ref(storage, `covers/${bookId}.${ext}`);
  await uploadBytes(storageRef, blob, { contentType: blob.type });
  return getDownloadURL(storageRef);
}

// ─── Tipos internos para parsear el JSON de entrada ──────────────────────────

interface MicrolearningInput {
  title: string;
  content: string;
  reflectionQuestion: string;
  quickExercise: string;
  tags?: string[];
  order?: number;
  microlearningImageUrl?: string;
}

interface ChapterInput {
  chapterNumber: number;
  title: string;
  summary: string;
  insights?: string[];
  exercises?: {
    title: string;
    description: string;
    type: "reflection" | "action" | "journaling";
  }[];
  order?: number;
  microlearnings?: MicrolearningInput[];
  chapterImageUrl?: string;
}

interface BookJSON {
  title: string;
  author: string;
  category: string;
  tags?: string[];
  purchaseLink?: string;
  preface?: string;
  shortSummary?: string;
  longSummary?: string;
  chapters?: ChapterInput[];
}

interface BatchSetOp {
  ref: DocumentReference;
  data: unknown;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function retryAsync<T>(
  fn: () => Promise<T>,
  retries = 3,
  delayMs = 500,
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < retries) {
        await sleep(delayMs * attempt);
      }
    }
  }
  throw lastError;
}

async function commitInBatches(
  ops: BatchSetOp[],
  batchSize = 200,
): Promise<void> {
  for (let i = 0; i < ops.length; i += batchSize) {
    const batch = writeBatch(db);
    const slice = ops.slice(i, i + batchSize);
    for (const op of slice) {
      batch.set(op.ref, op.data);
    }
    await retryAsync(() => batch.commit(), 4, 300);
    await sleep(100);
  }
}

async function uploadBookChapters(
  bookRef: DocumentReference,
  data: BookJSON,
  coverImageUrl: string,
): Promise<void> {
  const chapters = data.chapters ?? [];
  const ops: BatchSetOp[] = [];

  for (let ci = 0; ci < chapters.length; ci++) {
    const ch = chapters[ci];
    const chapterRef = doc(collection(db, "books_v2", bookRef.id, "chapters"));

    await retryAsync(() =>
      setDoc(chapterRef, {
        bookId: bookRef.id,
        chapterNumber: ch.chapterNumber ?? ci + 1,
        title: ch.title,
        summary: ch.summary ?? "",
        insights: ch.insights ?? [],
        exercises: ch.exercises ?? [],
        order: ch.order ?? ci,
        chapterImageUrl: ch.chapterImageUrl ?? "",
      }),
    );

    const microlearnings = ch.microlearnings ?? [];
    for (let mi = 0; mi < microlearnings.length; mi++) {
      const ml = microlearnings[mi];
      const mlSubRef = doc(
        collection(
          db,
          "books_v2",
          bookRef.id,
          "chapters",
          chapterRef.id,
          "microlearnings",
        ),
      );
      const mlRootRef = doc(db, "microlearnings", mlSubRef.id);
      const mlPayload: Omit<MicrolearningData, "id"> = {
        title: ml.title,
        content: ml.content,
        reflectionQuestion: ml.reflectionQuestion ?? "",
        quickExercise: ml.quickExercise ?? "",
        tags: ml.tags ?? [],
        order: ml.order ?? mi,
        microlearningImageUrl: ml.microlearningImageUrl ?? "",
        bookId: bookRef.id,
        bookTitle: data.title,
        bookAuthor: data.author,
        chapterId: chapterRef.id,
        chapterTitle: ch.title,
        chapterNumber: ch.chapterNumber ?? ci + 1,
        category: data.category ?? "",
      };

      ops.push({ ref: mlSubRef, data: mlPayload });
      ops.push({
        ref: mlRootRef,
        data: { ...mlPayload, createdAt: serverTimestamp() },
      });
    }
  }

  if (ops.length > 0) {
    await commitInBatches(ops, 100);
  }
}

// ─── 1. uploadBookFromJSON ────────────────────────────────────────────────────

/**
 * Sube un libro a Firestore de forma incremental:
 *   1. Escribe el documento raíz del libro.
 *   2. Por cada capítulo, escribe el documento del capítulo.
 *   3. Por cada microlearning, escribe el sub-doc y el doc raíz en un mini-batch.
 *
 * Estructura resultante:
 *   books_v2/{bookId}
 *   books_v2/{bookId}/chapters/{chapterId}
 *   books_v2/{bookId}/chapters/{chapterId}/microlearnings/{mlId}
 *   microlearnings/{mlId}  ← desnormalizado para el feed
 */
export async function uploadBookFromJSON(
  jsonData: string | BookJSON,
  coverImageUrl?: string,
): Promise<string> {
  const parsed: any =
    typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
  const data: BookJSON = parsed.book ?? parsed;

  const bookRef = doc(collection(db, "books_v2"));
  await setDoc(bookRef, {
    title: data.title,
    author: data.author,
    coverImageUrl: coverImageUrl ?? "",
    category: data.category ?? "",
    tags: data.tags ?? [],
    purchaseLink: data.purchaseLink ?? "",
    preface: data.preface ?? "",
    shortSummary: data.shortSummary ?? "",
    longSummary: data.longSummary ?? "",
    createdAt: serverTimestamp(),
  });

  await uploadBookChapters(bookRef, data, coverImageUrl ?? "");
  return bookRef.id;
}

// ─── 2. getMicrolearningsFeed ─────────────────────────────────────────────────

/**
 * Feed paginado de microlearnings desde la colección raíz.
 */
export async function getMicrolearningsFeed(
  category?: string,
  lastDoc?: QueryDocumentSnapshot,
  limitCount = 10,
): Promise<{
  items: MicrolearningData[];
  lastDoc: QueryDocumentSnapshot | null;
}> {
  let q = query(
    collection(db, "microlearnings"),
    orderBy("createdAt", "desc"),
    firestoreLimit(limitCount),
  );

  if (category) {
    q = query(
      collection(db, "microlearnings"),
      where("category", "==", category),
      orderBy("createdAt", "desc"),
      firestoreLimit(limitCount),
    );
  }

  if (lastDoc) {
    q = query(q, startAfter(lastDoc));
  }

  const snapshot = await getDocs(q);
  const items = snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as MicrolearningData,
  );
  const newLastDoc =
    snapshot.docs.length > 0 ? snapshot.docs[snapshot.docs.length - 1] : null;

  return { items, lastDoc: newLastDoc };
}

// ─── 3. getBookById ───────────────────────────────────────────────────────────

export async function getBookById(bookId: string): Promise<BookData | null> {
  const snap = await getDoc(doc(db, "books_v2", bookId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as BookData;
}

// ─── 4. getChaptersByBook ─────────────────────────────────────────────────────

export async function getChaptersByBook(
  bookId: string,
): Promise<ChapterData[]> {
  const q = query(
    collection(db, "books_v2", bookId, "chapters"),
    orderBy("order", "asc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as ChapterData);
}

// ─── 5. getMicrolearningsByChapter ───────────────────────────────────────────

export async function getMicrolearningsByChapter(
  bookId: string,
  chapterId: string,
): Promise<MicrolearningData[]> {
  const q = query(
    collection(db, "books_v2", bookId, "chapters", chapterId, "microlearnings"),
    orderBy("order", "asc"),
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(
    (d) => ({ id: d.id, ...d.data() }) as MicrolearningData,
  );
}

// ─── 6. getAllBooks ───────────────────────────────────────────────────────────

export async function getAllBooks(
  category?: string,
  limitCount = 20,
): Promise<BookData[]> {
  let q = query(
    collection(db, "books_v2"),
    orderBy("createdAt", "desc"),
    firestoreLimit(limitCount),
  );

  if (category) {
    q = query(
      collection(db, "books_v2"),
      where("category", "==", category),
      orderBy("createdAt", "desc"),
      firestoreLimit(limitCount),
    );
  }

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }) as BookData);
}

// ─── 7. Saved books (users/{userId}/savedBooks) ───────────────────────────────

export async function saveBook(userId: string, bookId: string): Promise<void> {
  await setDoc(doc(db, "users", userId, "savedBooks", bookId), {
    bookId,
    savedAt: serverTimestamp(),
  });
}

export async function unsaveBook(
  userId: string,
  bookId: string,
): Promise<void> {
  await deleteDoc(doc(db, "users", userId, "savedBooks", bookId));
}

export async function isBookSaved(
  userId: string,
  bookId: string,
): Promise<boolean> {
  const snap = await getDoc(doc(db, "users", userId, "savedBooks", bookId));
  return snap.exists();
}

/**
 * Devuelve los BookData de todos los libros guardados por el usuario,
 * ordenados por fecha de guardado descendente.
 */
export async function getSavedBooks(userId: string): Promise<BookData[]> {
  const q = query(
    collection(db, "users", userId, "savedBooks"),
    orderBy("savedAt", "desc"),
  );
  const snap = await getDocs(q);
  if (snap.empty) return [];

  const books = await Promise.all(
    snap.docs.map((d) => getBookById(d.data().bookId as string)),
  );
  return books.filter((b): b is BookData => b !== null);
}

// ─── 8. getBookFullJSON ───────────────────────────────────────────────────────

/**
 * Reconstruye el JSON completo de un libro (igual al formato de entrada)
 * para poder editarlo y re-subirlo.
 */
export async function getBookFullJSON(bookId: string): Promise<object | null> {
  const book = await getBookById(bookId);
  if (!book) return null;

  const chapters = await getChaptersByBook(bookId);
  const chaptersWithML = await Promise.all(
    chapters.map(async (ch) => {
      const mls = await getMicrolearningsByChapter(bookId, ch.id!);
      return {
        chapterNumber: ch.chapterNumber,
        title: ch.title,
        summary: ch.summary,
        insights: ch.insights,
        exercises: ch.exercises,
        chapterImageUrl: ch.chapterImageUrl ?? "",
        microlearnings: mls.map((ml) => ({
          title: ml.title,
          content: ml.content,
          reflectionQuestion: ml.reflectionQuestion,
          quickExercise: ml.quickExercise,
          tags: ml.tags,
          microlearningImageUrl: ml.microlearningImageUrl ?? "",
        })),
      };
    }),
  );

  return {
    title: book.title,
    author: book.author,
    coverImageUrl: book.coverImageUrl,
    category: book.category,
    tags: book.tags,
    purchaseLink: book.purchaseLink,
    preface: book.preface,
    shortSummary: book.shortSummary,
    longSummary: book.longSummary,
    chapters: chaptersWithML,
  };
}

// ─── 9. deleteBook ────────────────────────────────────────────────────────────

export async function deleteBook(bookId: string): Promise<void> {
  const chapters = await getChaptersByBook(bookId);

  for (const ch of chapters) {
    const mls = await getMicrolearningsByChapter(bookId, ch.id!);
    if (mls.length > 0) {
      const batch = writeBatch(db);
      for (const ml of mls) {
        batch.delete(
          doc(
            db,
            "books_v2",
            bookId,
            "chapters",
            ch.id!,
            "microlearnings",
            ml.id!,
          ),
        );
        batch.delete(doc(db, "microlearnings", ml.id!));
      }
      await batch.commit();
    }
    await deleteDoc(doc(db, "books_v2", bookId, "chapters", ch.id!));
  }

  await deleteDoc(doc(db, "books_v2", bookId));
}

// ─── 10. updateBookFromJSON ───────────────────────────────────────────────────

/**
 * Elimina el contenido anterior del libro y lo reemplaza con el nuevo JSON,
 * manteniendo el mismo bookId para no romper referencias guardadas.
 */
export async function updateBookFromJSON(
  bookId: string,
  jsonData: string | BookJSON,
  coverImageUrl?: string,
): Promise<void> {
  await deleteBook(bookId);

  const parsed: any =
    typeof jsonData === "string" ? JSON.parse(jsonData) : jsonData;
  const data: BookJSON = parsed.book ?? parsed;

  const bookRef = doc(db, "books_v2", bookId);
  await setDoc(bookRef, {
    title: data.title,
    author: data.author,
    coverImageUrl: coverImageUrl ?? "",
    category: data.category ?? "",
    tags: data.tags ?? [],
    purchaseLink: data.purchaseLink ?? "",
    preface: data.preface ?? "",
    shortSummary: data.shortSummary ?? "",
    longSummary: data.longSummary ?? "",
    createdAt: serverTimestamp(),
  });

  await uploadBookChapters(bookRef, data, coverImageUrl ?? "");
}
