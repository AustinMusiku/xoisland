import websocket from './gameSocket'

export default function (this: any) {
	this.nuxt.hook('listen', (server: any) => {
		websocket(server)
	})
}
