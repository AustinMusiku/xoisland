/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
// Import the functions you need from the SDKs you need
import * as firebase from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAnalytics } from 'firebase/analytics'
import { getMessaging, getToken, onMessage } from 'firebase/messaging'
import { onBackgroundMessage } from 'firebase/messaging/sw'

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
export default ({ isDev }: any) => {
	let app
	let db = null
	let analytics = null
	if (!firebase.getApps.length) {
		app = firebase.initializeApp(firebaseConfig)
		db = getDatabase(app)
		if (process.client) {
			if (!isDev) {
				analytics = getAnalytics(app)
			}
			const messaging = getMessaging(app)
			const vapidKey =
				'BLmEJ4hKPo_RLj23m2RREguKpZKNx7_4cMIg4T1Ocbz0XTYGXVCxPml1v09w6ZKlndPgF1EymRY-Z0qxDTJmMi8'
			console.log('vapidKey', vapidKey)
			// Add the public key generated from the console here.
			getToken(messaging, { vapidKey })
				.then((currentToken) => {
					if (currentToken) {
						// Send the token to your server and update the UI if necessary
						console.log(currentToken)
					} else {
						// Show permission request UI
						console.log(
							'No registration token available. Request permission to generate one.'
						)
						// ...
					}
				})
				.catch((err) => {
					console.log(
						'An error occurred while retrieving token. ',
						err
					)
					// ...
				})

			onBackgroundMessage(messaging, (payload) => {
				console.log(
					'[firebase-messaging-sw.js] Received background message ',
					payload
				)
				// Customize notification here
				const notificationTitle = 'Background Message Title'
				const notificationOptions = {
					body: 'Background Message body.',
					icon: '/firebase-logo.png',
				}
			})

			onMessage(messaging, (payload) => {
				console.log('Message received. ', payload)
				// ...
			})
		}

		// function requestPermission() {
		// 	console.log('Requesting permission...');
		// 	Notification.requestPermission().then((permission) => {
		// 	  if (permission === 'granted') {
		// 		console.log('Notification permission granted.');
	}

	return firebase
}
