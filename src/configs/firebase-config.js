// Import the functions you need from the SDKs you need
import firebase from 'firebase/app';
import 'firebase/analytics';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBiGNjBIYKzThNyvUwPNhyqTxeP0WPZx6k",
  authDomain: "ishantech-e2b9a.firebaseapp.com",
  projectId: "ishantech-e2b9a",
  storageBucket: "ishantech-e2b9a.appspot.com",
  messagingSenderId: "971032021450",
  appId: "1:971032021450:web:a998af0c8f756ffb5f6733"
};

// Initialize Firebase
 firebase.initializeApp(firebaseConfig);
 firebase.analytics();