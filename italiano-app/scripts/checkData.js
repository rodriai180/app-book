const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyAmWDkhB3wrQw_Vk8IbE4bKkM1GCoKq1xU",
    authDomain: "italian-app-488ee.firebaseapp.com",
    projectId: "italian-app-488ee",
    storageBucket: "italian-app-488ee.firebasestorage.app",
    messagingSenderId: "923769718572",
    appId: "1:923769718572:web:747c42ade31331f0758e89",
    measurementId: "G-CSCD2VLS06"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const checkData = async () => {
    try {
        const snapshot = await getDocs(collection(db, 'exercises'));
        console.log(`Total exercises: ${snapshot.size}`);

        const lessonIds = new Set();
        snapshot.docs.forEach(doc => {
            lessonIds.add(doc.data().lessonId);
        });

        console.log('--- Unique lessonIds found in exercises collection ---');
        console.log(Array.from(lessonIds).sort());

        const lesson3Count = snapshot.docs.filter(doc => String(doc.data().lessonId) === '3').length;
        console.log(`\nManual filter count for lesson 3: ${lesson3Count}`);

    } catch (err) {
        console.error('Error:', err);
    }
    process.exit(0);
};

checkData();
