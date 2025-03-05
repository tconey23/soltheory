import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth'
import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBJchGkHDbdPTdrH-nRE06JZG0b_Hf1Frk",
    authDomain: "connect21-d0acd.firebaseapp.com",
    databaseURL: "https://connect21-d0acd-default-rtdb.firebaseio.com",
    projectId: "connect21-d0acd",
    storageBucket: "connect21-d0acd.firebasestorage.app",
    messagingSenderId: "233350318265",
    appId: "1:233350318265:web:9a9d112b61a7163fa8b368",
    measurementId: "G-4WZN05J8LT",
  };

const firebaseUsers = {
    apiKey: "AIzaSyBJchGkHDbdPTdrH-nRE06JZG0b_Hf1Frk",
    authDomain: "connect21-d0acd.firebaseapp.com",
    databaseURL: "https://connect21-users.firebaseio.com/",
    projectId: "connect21-d0acd",
    storageBucket: "connect21-d0acd.firebasestorage.app",
    messagingSenderId: "233350318265",
    appId: "1:233350318265:web:9a9d112b61a7163fa8b368",
    measurementId: "G-4WZN05J8LT",
  };

  const app = initializeApp(firebaseConfig); // Default app
  const userApp = initializeApp(firebaseUsers, "userApp"); // Secondary app with unique name

  const auth = getAuth(app);
  const users = getDatabase(userApp);

  let currentUser

    setPersistence(auth, browserLocalPersistence)
    .then(() => {
        currentUser = auth.currentUser
    })
    .catch((error) => {
        console.error("Error setting persistence:", error.code, error.message);
    });

    console.log(auth.currentUser)

    export {auth, users, app, userApp, currentUser }