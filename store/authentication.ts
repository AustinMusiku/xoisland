import { defineStore } from 'pinia'
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from 'firebase/auth'
import cookies from 'js-cookie'
import { getToken } from 'firebase/messaging'
import { onValue, ref, set } from 'firebase/database'
import { messaging, db } from '~/plugins/firebase'

export const useAuthenticationStore = defineStore('authenticationStore', {
	state: () => {
		return {
			isAuth: false,
			user: { uid: '', displayName: '' },
			errMsg: '',
		}
	},
	getters: {
		getUser: (state) => state.user,
	},
	actions: {
		async login() {
			const provider = new GoogleAuthProvider()
			const auth = getAuth()
			await signInWithPopup(auth, provider)
			// get jwt from firebase
			const token = await auth.currentUser?.getIdToken()
			// set access token cookie
			if (token !== undefined)
				cookies.set('access_token', token, {
					secure: !this.$nuxt.isDev,
					expires: 7,
					sameSite: 'none',
				})

			// set user in store
			const displayName = auth.currentUser?.displayName
			const uid = auth.currentUser?.uid
			this.isAuth = true
			this.user = {
				uid: uid || '',
				displayName: displayName || '',
			}

			// if client and Notification is supported and permission is granted
			if (
				typeof window !== 'undefined' &&
				'Notification' in window &&
				Notification.permission === 'granted'
			) {
				const vapidKey = process.env.vapidKey
				const currentToken = await getToken(messaging, { vapidKey })

				// check if user exists in db
				if (displayName) {
					const userExists = await checkUserExists(displayName)
					if (!userExists) {
						addUser(displayName)
					}
					addMsgToken(displayName, currentToken)
				}
			}
		},
		async logout() {
			const auth = getAuth()
			await signOut(auth)
			// clear local store
			this.isAuth = false
			this.user = {
				uid: '',
				displayName: '',
			}
			// clear cookie
			cookies.remove('access_token')
		},
	},
})

// chexk if user exists in db
function checkUserExists(name: string): Promise<boolean> {
	return new Promise((resolve) => {
		onValue(
			ref(db, `players/${name}/`),
			(snapshot: any) => {
				resolve(snapshot.exists())
			},
			{ onlyOnce: true }
		)
	})
}

// add user to db
function addUser(name: string): Promise<void> {
	return set(ref(db, `players/${name}`), {
		draw: 0,
		loss: 0,
		points: 0,
		win: 0,
	})
}

// add msg token to user in db
function addMsgToken(name: string, token: string): Promise<void> {
	return set(ref(db, `players/${name}/msgToken`), token)
}
