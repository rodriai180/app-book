import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from '../constants/firebaseConfig';
import { exercises, lessons, levelContents, vocabulary } from '../constants/mockData';

const migrateCollection = async (collectionName: string, data: any[]) => {
  console.log(`Starting migration for collection: ${collectionName}...`);
  const colRef = collection(db, collectionName);
  
  for (const item of data) {
    try {
      const docId = item.id || item.uid || item.key || doc(colRef).id;
      // Use setDoc to overwrite or create documents with specific IDs
      await setDoc(doc(db, collectionName, String(docId)), item);
      console.log(`  - Migrated document: ${docId}`);
    } catch (error) {
      console.error(`  - Error migrating document ${item.id}:`, error);
    }
  }
  console.log(`Finished migration for collection: ${collectionName}.\n`);
};

const runMigration = async () => {
  try {
    console.log('--- FIRESTORE DATA MIGRATION START ---\n');
    
    // lessons is an array
    await migrateCollection('lessons', lessons);
    
    // levelContents is a Record<string, any[]>, flatten it for migration and include lessonId
    console.log('Starting migration for collection: levelContents...');
    for (const [lessonId, contents] of Object.entries(levelContents)) {
      for (const item of contents) {
        try {
          const uniqueId = `l${lessonId}_${item.id}`;
          const itemWithLessonId = { ...item, lessonId, id: uniqueId }; // Use uniqueId as the new ID
          await setDoc(doc(db, 'levelContents', uniqueId), itemWithLessonId);
          console.log(`  - Migrated levelContent: ${uniqueId}`);
        } catch (error) {
          console.error(`  - Error migrating levelContent ${item.id} for lesson ${lessonId}:`, error);
        }
      }
    }
    console.log('Finished migration for collection: levelContents.\n');
    
    // exercises is an array, flatten it for unique IDs if necessary
    console.log('Starting migration for collection: exercises...');
    for (const item of exercises) {
      try {
        const uniqueId = `e${item.lessonId}_${item.id}`;
        await setDoc(doc(db, 'exercises', uniqueId), item);
        console.log(`  - Migrated exercise: ${uniqueId}`);
      } catch (error) {
        console.error(`  - Error migrating exercise ${item.id}:`, error);
      }
    }
    console.log('Finished migration for collection: exercises.\n');
    
    // vocabulary is an array
    await migrateCollection('vocabulary', vocabulary);
    
    console.log('--- FIRESTORE DATA MIGRATION COMPLETE ---');
    process.exit(0);
  } catch (error: any) {
    console.error('Migration failed with error:');
    console.error('Message:', error.message);
    if (error.code) console.error('Code:', error.code);
    if (error.stack) console.error('Stack:', error.stack);
    process.exit(1);
  }
};

runMigration();
