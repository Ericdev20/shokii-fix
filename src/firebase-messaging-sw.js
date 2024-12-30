importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.11.0/firebase-messaging-compat.js"
);
firebase.initializeApp({
  apiKey: "AIzaSyCLq0_UOnb1azpkR330LBIXp4dEV8_EaPI",
  authDomain: "shokii-notif.firebaseapp.com",
  projectId: "shokii-notif",
  storageBucket: "shokii-notif.appspot.com",
  messagingSenderId: "423597396252",
  appId: "1:423597396252:web:3abd17de167e9f15aa2ad9",
  measurementId: "G-GZEDDT2NG0",
});
const messaging = firebase.messaging();
