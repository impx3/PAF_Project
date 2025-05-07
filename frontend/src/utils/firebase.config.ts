import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDncwGlW3VuOfEJggwmgvlwd-v_upCXPOg",
  authDomain: "chopchop-60c02.firebaseapp.com",
  projectId: "chopchop-60c02",
  storageBucket: "chopchop-60c02.firebasestorage.app",
  messagingSenderId: "241301926662",
  appId: "1:241301926662:web:f3d8dc15c60ce528e6a487",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
