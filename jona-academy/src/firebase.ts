import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: "AIzaSyB1N9mCNQ5ao0lNa5olDxF0iET088p-j4I",
  authDomain: "jonaapp-736f5.firebaseapp.com",
  projectId: "jonaapp-736f5",
  storageBucket: "jonaapp-736f5.firebasestorage.app",
  messagingSenderId: "760698992780",
  appId: "1:760698992780:web:24f0e6399e64b52cce63a9"
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export default app
