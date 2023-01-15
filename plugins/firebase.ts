/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
import { initializeApp, getApps } from 'firebase/app'
import { getDatabase } from 'firebase/database'
import { getAnalytics } from 'firebase/analytics'
import { getMessaging, onMessage } from 'firebase/messaging'

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

const apps = getApps()
const app = !apps.length ? initializeApp(firebaseConfig) : apps[0]
const db = getDatabase(app)
const messaging = getMessaging(app)

export default ({ isDev }: any) => {
	if (process.client && !isDev) {
		getAnalytics(app)
	}
}

export { messaging, db }
