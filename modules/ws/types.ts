import websocket from 'websocket'

export interface Winner {
	symbol: string
	cells: string[]
}

export interface Cells {
	[key: string]: string
}

export interface ClientsMap {
	[key: string]: {
		connection: websocket.connection
	}
}

export interface Game {
	gameId: string
	players: string[]
	gameOver: boolean
	cells: Cells
	rematchTime: number
}

export interface GamesMap {
	[key: string]: Game | null
}
