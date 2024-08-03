// Import the functions you need from the SDKs you need
import { firebase ,initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYAWJ1C-k6AZM_FijWzfNlVHr6KGOSvbo",
  authDomain: "pantry-management-12dcb.firebaseapp.com",
  projectId: "pantry-management-12dcb",
  storageBucket: "pantry-management-12dcb.appspot.com",
  messagingSenderId: "976240217176",
  appId: "1:976240217176:web:2b4f138eea01f7cc008e2d",
  measurementId: "G-VJQKR23MSS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);

export { db };