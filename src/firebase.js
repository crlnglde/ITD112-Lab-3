import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQbFMe5nIRg4JYMH1J4FfhheqIdVh9qMU",
  authDomain: "elevera-lab3.firebaseapp.com",
  projectId: "elevera-lab3",
  storageBucket: "elevera-lab3.firebasestorage.app",
  messagingSenderId: "760948008468",
  appId: "1:760948008468:web:3424b7ffad377dd9a16901",
  measurementId: "G-CF4T55R7YX"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
// Initialize Firestore
const db = getFirestore(app);

export { db };