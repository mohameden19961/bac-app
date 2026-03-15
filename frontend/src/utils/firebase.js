import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyAFFBVoM9bsg0MvyBhlh0j6YeuuQ2vYdKc",
  authDomain: "bacprep-mr-59a4e.firebaseapp.com",
  projectId: "bacprep-mr-59a4e",
  storageBucket: "bacprep-mr-59a4e.firebasestorage.app",
  messagingSenderId: "122921728236",
  appId: "1:122921728236:web:a694b630d7a4effba4cdc9"
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
