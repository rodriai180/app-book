import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../constants/firebaseConfig';

const checkData = async () => {
  console.log('--- FIRESTORE DATA CHECK ---\n');

  const collections = ['lessons', 'levelContents', 'exercises', 'vocabulary'];

  for (const col of collections) {
    const snapshot = await getDocs(collection(db, col));
    console.log(`Collection '${col}': ${snapshot.size} documents found.`);
  }

  console.log('\n--- Checking Exercises for Lesson 3 ---');
  const q3 = query(collection(db, 'exercises'), where('lessonId', '==', '3'));
  const snapshot3 = await getDocs(q3);
  console.log(`Exercises for lesson 3: ${snapshot3.size} found.`);
  if (snapshot3.size > 0) {
    console.log('First exercise subtopic:', snapshot3.docs[0].data().subtopic);
  }

  console.log('\n--- Checking Exercises for Lesson 0 ---');
  const q0 = query(collection(db, 'exercises'), where('lessonId', '==', '0'));
  const snapshot0 = await getDocs(q0);
  console.log(`Exercises for lesson 0: ${snapshot0.size} found.`);

  process.exit(0);
};

checkData();
