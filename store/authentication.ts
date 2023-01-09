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
				})

			// set user in store
			const displayName = auth.currentUser?.displayName
			const uid = auth.currentUser?.uid
			this.isAuth = true
			this.user = {
				uid: uid || '',
				displayName: displayName || '',
			}

			// Add the public key generated from the console here.
			const vapidKey =
				'BLmEJ4hKPo_RLj23m2RREguKpZKNx7_4cMIg4T1Ocbz0XTYGXVCxPml1v09w6ZKlndPgF1EymRY-Z0qxDTJmMi8'
			const currentToken = await getToken(messaging, { vapidKey })
			// eslint-disable-next-line no-console
			if (currentToken) {
				console.log(currentToken)
			}

			// check if user exists in db
			if (displayName) {
				if (!checkUserExists(displayName)) {
					addUser(displayName)
				}
				addMsgToken(displayName, currentToken)
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
function checkUserExists(name: string): boolean {
	let exists = false
	onValue(
		ref(db, `players/${name}`),
		(snapshot) => {
			exists = snapshot.exists()
		},
		{ onlyOnce: true }
	)
	return exists
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
