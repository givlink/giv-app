importScripts("https://www.gstatic.com/firebasejs/6.3.4/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/6.3.4/firebase-messaging.js");

firebase.initializeApp({
  apiKey: "AIzaSyDSbHCQsQv9iyZwR-ACjs--FGV8xT89C_c",
  authDomain: "givlink.firebaseapp.com",
  projectId: "givlink",
  storageBucket: "givlink.appspot.com",
  messagingSenderId: "1001888415925",
  appId: "1:1001888415925:web:5ee6c2011063eb70a17efc",
  measurementId: "G-X7F0ETQBTT"
});

const messaging = firebase.messaging();
