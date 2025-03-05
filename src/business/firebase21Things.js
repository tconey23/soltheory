import { getDatabase } from 'firebase/database';
import { initializeApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyBJchGkHDbdPTdrH-nRE06JZG0b_Hf1Frk",
    authDomain: "connect21-d0acd.firebaseapp.com",
    databaseURL: "https://connect21-d0acd-default-rtdb.firebaseio.com",
    projectId: "connect21-d0acd",
    storageBucket: "connect21-d0acd.firebasestorage.app",
    messagingSenderId: "233350318265",
    appId: "1:233350318265:web:9a9d112b61a7163fa8b368",
    measurementId: "G-4WZN05J8LT"
};

const app21 = initializeApp(firebaseConfig);
const database21 = getDatabase(app21)

export { database21, app21}