// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAoU0T7ZCCf92OogHrogP5xgZFTNd71KpA",
  authDomain: "practice-project-1538117498527.firebaseapp.com",
  databaseURL: "https://practice-project-1538117498527.firebaseio.com",
  projectId: "practice-project-1538117498527",
  storageBucket: "practice-project-1538117498527.appspot.com",
  messagingSenderId: "995086821882",
  appId: "1:995086821882:web:997e98860c7156351f1c43"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const storage = getStorage(app);

export async function uploadImageToFirebase(file) {
  if (!file) return null;
  const path = `uploads/${Date.now()}_${file.name}`;
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
}

export default app;
