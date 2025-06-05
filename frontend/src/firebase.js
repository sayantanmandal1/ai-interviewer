import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ✅ Add this

const firebaseConfig = {
  apiKey: "AIzaSyARylgZieomfH8QQINpbr4xR6yuWZtSw0Q",
  authDomain: "interview-login-dea97.firebaseapp.com",
  projectId: "interview-login-dea97",
  storageBucket: "interview-login-dea97.firebasestorage.app",
  messagingSenderId: "67671664689",
  appId: "1:67671664689:web:b8af2f15c7f4ad72320d10",
  measurementId: "G-V07PNCZRKW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const db = getFirestore(app); 

export { auth, googleProvider, db };
