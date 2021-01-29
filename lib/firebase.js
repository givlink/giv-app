import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBptPPGV7vYfnok8VBFIwbeY4Lakw_gWCM",
  authDomain: "giv-link.firebaseapp.com",
  projectId: "giv-link",
  storageBucket: "giv-link.appspot.com",
  messagingSenderId: "792202111118",
  appId: "1:792202111118:web:ad29e7cbb23d28e2dc81df",
  measurementId: "G-FELPCTFQE5"
};
// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
}

export default firebase;
