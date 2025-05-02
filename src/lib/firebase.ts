
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey: "AIzaSyBiBGz7Ai9MSg60dRsu7iJTFLm3ZAKNH-o",
  authDomain: "note-app-edb29.firebaseapp.com",
  projectId: "note-app-edb29",
  storageBucket: "note-app-edb29.firebasestorage.app",
  messagingSenderId: "378585361721",
  appId: "1:378585361721:web:03aed9d89d6e9374aa4ce8",
  measurementId: "G-Q015J9C4LH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize analytics only in browser environment
let analytics = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}
export { analytics };
