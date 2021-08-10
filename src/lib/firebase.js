import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/firestore'
import 'firebase/functions'
import 'firebase/messaging'
import 'firebase/storage'
import 'firebase/analytics'

const firebaseConfig = {
  apiKey: 'AIzaSyDSbHCQsQv9iyZwR-ACjs--FGV8xT89C_c',
  authDomain: 'givlink.firebaseapp.com',
  projectId: 'givlink',
  storageBucket: 'givlink.appspot.com',
  messagingSenderId: '1001888415925',
  appId: '1:1001888415925:web:5ee6c2011063eb70a17efc',
  measurementId: 'G-X7F0ETQBTT',
}
// Initialize Firebase

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig)
  firebase.analytics()
}

export default firebase
