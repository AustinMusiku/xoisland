import cookieParser from 'cookieparser'
import jwtdecode from 'jwt-decode'
import { useAuthenticationStore } from './authentication'

export const actions = {
	nuxtServerInit(_: any, { req, $pinia }: any) {
		if (process.server && process.static) return
		if (!req.headers.cookie) return
		// call the auth store
		const authStore = useAuthenticationStore($pinia)

		const parsed = cookieParser.parse(req.headers.cookie)
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
