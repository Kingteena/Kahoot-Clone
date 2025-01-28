import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC2mL76bPKLaQeS6EdYJIK72oKAP57q7oU",
  authDomain: "kahoot-clone-c7751.firebaseapp.com",
  projectId: "kahoot-clone-c7751",
  storageBucket: "kahoot-clone-c7751.firebasestorage.app",
  messagingSenderId: "1062070593322",
  appId: "1:1062070593322:web:62bf745bf7e43a9078e053",
  measurementId: "G-0L2NPKJ205",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// const analytics = getAnalytics(app);

export { auth, db };
