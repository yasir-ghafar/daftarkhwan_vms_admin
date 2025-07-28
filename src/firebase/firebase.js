// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcaQiYqZbIXhlLeccw5PurPiAu89WxEWY",
  authDomain: "flutter-project-302ef.firebaseapp.com",
  projectId: "flutter-project-302ef",
  storageBucket: "flutter-project-302ef.firebasestorage.app",
  messagingSenderId: "924275402605",
  appId: "1:924275402605:web:69e2aaa7b4523bd02b5c64",
  measurementId: "G-2HHW4BY2TR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);