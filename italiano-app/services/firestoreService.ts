import { collection, getDocs, query, where } from 'firebase/firestore';
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
