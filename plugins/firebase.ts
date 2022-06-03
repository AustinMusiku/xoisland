// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/app'
import { getDatabase } from 'firebase/database'

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
	apiKey: process.env.apiKey,
	authDomain: process.env.authDomain,
	databaseURL: process.env.databaseURL,
	projectId: process.env.projectId,
	storageBucket: process.env.storageBucket,
	messagingSenderId: process.env.messagingSenderId,
	appId: process.env.appId,
	measurementId: process.env.measurementId,
}

// Initialize Firebase
let app
let db = null
if (!firebase.getApps.length) {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	app = firebase.initializeApp(firebaseConfig)
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	db = getDatabase(app)
}

export default firebase
