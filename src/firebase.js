import * as firebase from "firebase/app";
import 'firebase/storage'
import 'firebase/firestore'

const config = {
    apiKey: "AIzaSyBZQp1nuuG3ZJeGSuXdaLGPfOFELXEu5kg",
    authDomain: "wbusch-f8fb7.firebaseapp.com",
    databaseURL: "https://wbusch-f8fb7.firebaseio.com",
    projectId: "wbusch-f8fb7",
    storageBucket: "wbusch-f8fb7.appspot.com",
    messagingSenderId: "491905389064",
}

const app = firebase.initializeApp(config)
export const db = app.firestore()
export const storage = app.storage()