import { defineStore } from 'pinia'
import cookies from 'js-cookie'
import { base64 } from '@firebase/util'
import { getToken, Messaging } from 'firebase/messaging'
import { set, ref } from 'firebase/database'
import { db, messaging } from '~/plugins/firebase'

export const useUserStore = defineStore('userStore', {
	state: () => {
		return {
			preferences: {
				prefersNoLogin: false,
				prefersDarkMode: false,
				preferNotifications: false,
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
		toggleNotification(displayName: string) {
			if (!this.preferences.preferNotifications) {
				getMsgToken(messaging, displayName)
			}

			this.preferences.preferNotifications =
				!this.preferences.preferNotifications
			savePreferences(this.preferences)
		},
	},
})

async function getMsgToken(messaging: Messaging, displayName: string) {
	const vapidKey = process.env.vapidKey
	const currentToken = await getToken(messaging, { vapidKey })

	set(ref(db, `players/${displayName}/msgToken`), currentToken)
}

function savePreferences(preferences: any) {
	const JSONPrefs = base64.encodeString(JSON.stringify(preferences))
	cookies.set('preferences', JSONPrefs, {
		expires: 7,
	})
}
