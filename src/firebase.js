import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { collection, getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyB4e5XjnftGLjiyh7rYdXGfaPOGp51wtPo",
    authDomain: "cloudy-dd33b.firebaseapp.com",
    projectId: "cloudy-dd33b",
    storageBucket: "cloudy-dd33b.appspot.com",
    messagingSenderId: "225615129751",
    appId: "1:225615129751:web:ff1cfd18170ca6cd270dd2",
    measurementId: "G-PXBHJP7EZ3"
};
//initializing firebase app
const app = initializeApp(firebaseConfig)
    //auth initialization
export const auth = getAuth(app)
    //firestore
export const storage = getStorage(app)
export const firestore = getFirestore(app)

export const database = {
    folders: collection(firestore, 'folders'),
    files: collection(firestore, 'files')
}

export default app;