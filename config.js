// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQJlB11Z8Un3D0wYgkK3KI9UPGm5u8Yug",
  authDomain: "net-score-40ee9.firebaseapp.com",
  databaseURL: "https://net-score-40ee9-default-rtdb.firebaseio.com",
  projectId: "net-score-40ee9",
  storageBucket: "net-score-40ee9.appspot.com",
  messagingSenderId: "52994023446",
  appId: "1:52994023446:web:949daab5b7f7876b1a9537",
  measurementId: "G-E2DR6GPZJH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
