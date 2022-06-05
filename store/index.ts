import cookieParser from 'cookieparser'
import jwtdecode from 'jwt-decode'
import { useAuthenticationStore } from './authentication'
import { useGameplayStore } from './gameplay'

export const actions = {
	nuxtServerInit(_: any, { req, $pinia }: any) {
		if (process.server && process.static) return
		if (!req.headers.cookie) return

		const parsed = cookieParser.parse(req.headers.cookie)
		// disable signin popup if user declined before
		if (parsed.prefers_no_login)
			useGameplayStore($pinia).togglePrefersNoLogin()
		// call the auth store
		const authStore = useAuthenticationStore($pinia)

		const accessToken = parsed.access_token
		if (!accessToken) return

		const decodedToken: any = jwtdecode(accessToken)
		if (decodedToken !== undefined) {
			authStore.isAuth = true
			authStore.user = {
				uid: decodedToken.user_id,
				displayName: decodedToken.name,
			}
		}
	},
}
