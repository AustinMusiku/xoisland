import { defineStore } from 'pinia'
import cookies from 'js-cookie'
import { base64 } from '@firebase/util'

export const useUserStore = defineStore('userStore', {
	state: () => {
		return {
			preferences: {
				prefersNoLogin: false,
				prefersDarkMode: false,
			},
		}
	},

	actions: {
		togglePrefersNoLogin() {
			this.preferences.prefersNoLogin = true
			savePreferences(this.preferences)
		},
		toggleDarkMode() {
			this.preferences.prefersDarkMode = !this.preferences.prefersDarkMode
			savePreferences(this.preferences)
		},
	},
})

function savePreferences(preferences: any) {
	const JSONPrefs = base64.encodeString(JSON.stringify(preferences))
	cookies.set('preferences', JSONPrefs)
}
