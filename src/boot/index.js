// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyABH_dfXPGKxi3OYXxa-DendR7nDyKOtNE',
  authDomain: 'bgb-match-management-1904.firebaseapp.com',
  databaseURL: 'https://bgb-match-management-1904-default-rtdb.europe-west1.firebasedatabase.app',
  projectId: 'bgb-match-management-1904',
  storageBucket: 'bgb-match-management-1904.appspot.com',
  messagingSenderId: '3079157652',
  appId: '1:3079157652:web:aff3485b285c0630f2c181',
  measurementId: 'G-BP73X0M5H0'
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
