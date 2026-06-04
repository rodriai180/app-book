import { collection, doc, getDoc, getDocs, query, setDoc, where, writeBatch } from 'firebase/firestore';
import { db } from '../constants/firebaseConfig';
import { Exercise, Lesson, LevelContent, VocabularyItem } from '../constants/mockData';

/**
 * Fetches all lessons from Firestore.
 */
export const getLessons = async (): Promise<Lesson[]> => {
  const querySnapshot = await getDocs(collection(db, 'lessons'));
  return querySnapshot.docs.map(doc => ({
    ...doc.data()
  } as Lesson));
};

/**
 * Fetches level content for a specific lesson.
 * Note: levelContents were flattened in the migration.
 * Each document should have a lessonId or similar to filter, 
 * but looking at the mockData, they didn't have a direct lessonId in the LevelContent interface.
 * Let's check the migration script again to see how we stored them.
 */
export const getLevelContentByLessonId = async (lessonId: string): Promise<LevelContent[]> => {
  const q = query(collection(db, 'levelContents'), where('lessonId', '==', String(lessonId)));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as LevelContent);
};

/**
 * Fetches exercises for a specific lesson.
 */
export const getExercisesByLessonId = async (lessonId: string): Promise<Exercise[]> => {
  const q = query(collection(db, 'exercises'), where('lessonId', '==', String(lessonId)));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as Exercise);
};

/**
 * Fetches all vocabulary items.
 */
export const getVocabulary = async (): Promise<VocabularyItem[]> => {
  const querySnapshot = await getDocs(collection(db, 'vocabulary'));
  return querySnapshot.docs.map(doc => doc.data() as VocabularyItem);
};

export const getVocabularyById = async (id: string): Promise<VocabularyItem | null> => {
  const q = query(collection(db, 'vocabulary'), where('id', '==', id));
  const snap = await getDocs(q);
  if (snap.empty) return null;
  return snap.docs[0].data() as VocabularyItem;
};

export const getVocabularyByCategory = async (category: string): Promise<VocabularyItem[]> => {
  const q = query(collection(db, 'vocabulary'), where('category', '==', category));
  const snap = await getDocs(q);
  return snap.docs.map(d => d.data() as VocabularyItem);
};

export const getAllExercises = async (): Promise<Exercise[]> => {
  const querySnapshot = await getDocs(collection(db, 'exercises'));
  return querySnapshot.docs.map(d => d.data() as Exercise);
};

export const getDialogueExercisesByLessonId = async (lessonId: string): Promise<any | null> => {
  const docRef = doc(db, 'dialogueExercises', String(lessonId));
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
};

export type DialogueExerciseItem = {
  id: number;
  answer: string;
  hint: string;
  type: 'dialogue' | 'sentence';
};

export type DialogueLessonData = {
  title: string;
  count: number;
  exercises: DialogueExerciseItem[];
};

export const saveSubtopicExercises = async (lessonId: string, subtopicKey: string, exercises: Exercise[]): Promise<void> => {
  const isSinSubtema = subtopicKey === 'Sin subtema';
  const q = query(collection(db, 'exercises'), where('lessonId', '==', String(lessonId)));
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach(d => {
    const docSubtopic = d.data().subtopic;
    const matches = isSinSubtema
      ? (docSubtopic === undefined || docSubtopic === null || docSubtopic === '')
      : docSubtopic === subtopicKey;
    if (matches) batch.delete(d.ref);
  });
  exercises.forEach(ex => {
    const ref = doc(collection(db, 'exercises'));
    const toSave: any = { ...ex, lessonId: String(lessonId) };
    if (isSinSubtema) delete toSave.subtopic;
    else toSave.subtopic = subtopicKey;
    batch.set(ref, toSave);
  });
  await batch.commit();
};

export const saveLevelContentForLesson = async (lessonId: string, items: LevelContent[]): Promise<void> => {
  const q = query(collection(db, 'levelContents'), where('lessonId', '==', String(lessonId)));
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  items.forEach(item => {
    const ref = doc(collection(db, 'levelContents'));
    batch.set(ref, { ...item, lessonId: String(lessonId) });
  });
  await batch.commit();
};

export const saveVocabularyByCategory = async (category: string, items: VocabularyItem[]): Promise<void> => {
  const q = query(collection(db, 'vocabulary'), where('category', '==', category));
  const snap = await getDocs(q);
  const batch = writeBatch(db);
  snap.docs.forEach(d => batch.delete(d.ref));
  items.forEach(item => {
    const ref = doc(collection(db, 'vocabulary'));
    batch.set(ref, item);
  });
  await batch.commit();
};

export const saveDialogueExercisesForLesson = async (lessonId: string, exercises: any[]): Promise<void> => {
  const docRef = doc(db, 'dialogueExercises', String(lessonId));
  const snap = await getDoc(docRef);
  const base = snap.exists() ? snap.data() : { lessonId, title: '' };
  await setDoc(docRef, { ...base, exercises });
};

export const getAllDialogueExercises = async (): Promise<Record<string, DialogueLessonData>> => {
  const querySnapshot = await getDocs(collection(db, 'dialogueExercises'));
  const result: Record<string, DialogueLessonData> = {};
  querySnapshot.docs.forEach(d => {
    const data = d.data();
    const exercises: DialogueExerciseItem[] = Array.isArray(data.exercises)
      ? data.exercises.map((ex: any) => ({
          id: ex.id,
          answer: ex.answer ?? '',
          hint: ex.hint ?? '',
          type: 'dialogue' in ex ? 'dialogue' : 'sentence',
        }))
      : [];
    result[d.id] = { title: data.title ?? '', count: exercises.length, exercises };
  });
  return result;
};
