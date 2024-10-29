
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAzJ0E0Lgl8SGNDUR1YnTxBcRVLhl30W0I",
  authDomain: "feed-67655.firebaseapp.com",
  databaseURL: "https://feed-67655-default-rtdb.firebaseio.com",
  projectId: "feed-67655",
  storageBucket: "feed-67655.appspot.com",
  messagingSenderId: "790246472220",
  appId: "1:790246472220:web:3b5fcf1030e8927755bdd9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export{db};
