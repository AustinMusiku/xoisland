import { defineStore } from 'pinia'
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from 'firebase/auth'
import cookies from 'js-cookie'

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
