import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import firebase from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, set } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCPZEqPh6WNR5l-QDTwhkyJE1uOOuB10Wo",
  authDomain: "social0app.firebaseapp.com",
  projectId: "social0app",
  storageBucket: "social0app.appspot.com",
  messagingSenderId: "440774964472",
  appId: "1:440774964472:web:c0e5a85d7d5c4643aab70d",
  measurementId: "G-GX0580N269",
};
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getDatabase(app);
