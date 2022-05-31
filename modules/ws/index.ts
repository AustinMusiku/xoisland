import websocket from './webSocket'

export default function (this: any) {
	this.nuxt.hook('listen', (server: any) => {
		websocket(server)
	})
}
