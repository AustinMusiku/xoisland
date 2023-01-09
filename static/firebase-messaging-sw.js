importScripts('https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js')
importScripts('https://www.gstatic.com/firebasejs/9.8.1/firebase-messaging.js')

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

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
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

	self.registration.showNotification(notificationTitle, notificationOptions)
})
