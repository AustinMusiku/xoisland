import { createServer } from 'http'
import { server, connection } from 'websocket'
import { config } from 'dotenv'

import { ClientsMap, Game, GamesMap } from './types'
import { generateUUID } from './utils'
import {
	flushGameState,
	checkPlayerWin,
	getReadyGame,
	addReadyGame,
	removeReadyGame,
} from './game'

config()

const PORT = process.env.WEBSOCKET_PORT

const WebsocketServer = server
const httpServer = createServer()

const wsServer = new WebsocketServer({ httpServer })

// ------------------------------------------------------------
// clients map
const guidToClients: ClientsMap = {}
// games map
const guidToGames: GamesMap = {}

// ------------------------------------------------------------
// place all games that have waiting players in a queue
let readyGames: Game[] = []

// ------------------------------------------------------------
wsServer.on('request', (request) => {
	const connection: connection = request.accept(null, request.origin)

	// generate a new clientId
	const clientId = generateUUID()
	guidToClients[clientId] = { connection }

	connection.on('message', (data: any) => {
		const message = data.utf8Data
		const result: any = JSON.parse(message)
		connection.send(JSON.stringify({ msg: 'arrived' }))

		switch (result.method) {
			case 'join':
				handleJoin(result)
				break
			case 'play':
				handleMove(result)
				break
			case 'play-again':
				handlePlayAgain(result)
				break
			case 'play-again-prompt':
				handlePlayAgainPrompt(result)
				break
			default:
				break
		}
	})

	// send back the clientId
	connection.send(JSON.stringify({ method: 'connect', clientId }))

	// eslint-disable-next-line no-console
	connection.on('close', () => console.log('closed!'))
})

// ------------------------------------------------------------
// server methods
const handleJoin = (result: any) => {
	const readyGame = getReadyGame(readyGames)
	if (readyGame) {
		readyGame?.players.push(result.clientId)

		// send broadcast to all players in game
		const payLoad = {
			method: 'join',
			message: `${result.clientId} joined ${readyGame.gameId}`,
			clientId: result.clientId,
			gameId: readyGame.gameId,
		}
		readyGame.players.forEach((player) => {
			guidToClients[player].connection.send(JSON.stringify(payLoad))
		})
	} else {
		// create a new game and add it to the queue of ready games
		const gameId = generateUUID()
		const game = {
			gameId,
			players: [result.clientId],
			gameOver: false,
			cells: {
				c1: '',
				c2: '',
				c3: '',
				c4: '',
				c5: '',
				c6: '',
				c7: '',
				c8: '',
				c9: '',
			},
		}
		guidToGames[gameId] = game
		addReadyGame(game, readyGames)
		// send the clientId and gameId to the client
		const payLoad = {
			method: 'join-wait',
			message: `new game ${gameId} created`,
			clientId: result.clientId,
			gameId,
			turn: 1,
		}
		guidToClients[result.clientId].connection.send(JSON.stringify(payLoad))
		// Send timeout message to client and remove game from queue
		const TIME_OUT =
			process.env.NODE_ENV === 'development' ? 4000 : 120 * 1000
		setTimeout(() => {
			const payLoad = {
				method: 'join-timeout',
				message: `Failed to get another player`,
				clientId: result.clientId,
				gameId,
			}
			if (game.players.length < 2) {
				readyGames = removeReadyGame(gameId, readyGames)
				guidToClients[result.clientId].connection.send(
					JSON.stringify(payLoad)
				)
			}
		}, TIME_OUT)
	}
}

const handleMove = (result: any) => {
	// fill game state
	const game = guidToGames[result.gameId]
	if (game === null) return
	const symbol: string =
		game.players.indexOf(result.clientId) === 0 ? 'X' : 'O'
	game.cells[result.cell] = symbol
	// send played move to all players in game
	const payLoad = {
		method: 'play',
		gameId: result.gameId,
		move: {
			cell: result.cell,
			symbol,
		},
		message: `move made on ${result.cell}`,
	}
	game.players.forEach((player) => {
		guidToClients[player].connection.send(JSON.stringify(payLoad))
	})
	// check for game win/draw
	checkPlayerWin(symbol, game.cells, game, guidToClients)
}

const handlePlayAgain = (result: any) => {
	const game = guidToGames[result.gameId]
	// send play again request to opponent
	let payLoad = {
		method: 'play-again',
		gameId: result.gameId,
		message: `Opponent wants to play again`,
	}
	const opponentId: any = game?.players.find(
		(player) => player !== result.clientId
	)

	guidToClients[opponentId].connection.send(
		JSON.stringify(payLoad),
		(err) => {
			// if opponent is not found, remove game from map and send error message to client
			if (err) {
				guidToGames[result.gameId] = null
				payLoad = {
					method: 'play-again-fail',
					gameId: result.gameId,
					message: `Opponent has left the game, you will be redirected back home`,
				}
				guidToClients[result.clientId].connection.send(
					JSON.stringify(payLoad)
				)
			}
		}
	)
}
const handlePlayAgainPrompt = (result: any) => {
	let game = guidToGames[result.gameId]
	const opponentId: any = game?.players.find(
		(player) => player !== result.clientId
	)
	const isPlayAgain: boolean = result.isPlayAgain
	if (!isPlayAgain) {
		// send play again request to opponent
		const payLoad = {
			method: 'rematch',
			value: false,
			message: `Opponent declined to play again`,
		}
		guidToClients[opponentId].connection.send(JSON.stringify(payLoad))
	} else {
		// flush game state
		if (game) game = flushGameState(game)
		const payLoad = {
			method: 'rematch',
			value: true,
			clientId: result.clientId,
			message: `Opponent accepted to play again`,
		}
		game?.players.forEach((player) => {
			guidToClients[player].connection.send(JSON.stringify(payLoad))
		})
	}
}

httpServer.listen(PORT)
