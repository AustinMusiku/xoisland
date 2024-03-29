importScripts('https://www.gstatic.com/firebasejs/9.8.1/firebase-app-compat.js')
importScripts(
	'https://www.gstatic.com/firebasejs/9.8.1/firebase-messaging-compat.js'
)

importScripts('./swenv.js')

firebase.initializeApp({
	apiKey: process.env.apiKey,
	authDomain: process.env.authDomain,
	databaseURL: process.env.databaseURL,
	projectId: process.env.projectId,
	storageBucket: process.env.storageBucket,
	messagingSenderId: process.env.messagingSenderId,
	appId: process.env.appId,
	measurementId: process.env.measurementId,
})

if (firebase.messaging.isSupported()) {
	firebase.messaging()
}
