// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAwCixdFGlEOJeMZmystupEJBSi0GS2yas",
  authDomain: "voterstracking.firebaseapp.com",
  projectId: "voterstracking",
  storageBucket: "voterstracking.appspot.com",
  messagingSenderId: "27727580657",
  appId: "1:27727580657:web:9c83656eb36747124ac850",
  measurementId: "G-2SCKRD98MS",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);
