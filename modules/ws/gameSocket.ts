import { server, connection } from 'websocket'

import { ClientsMap, Game, GamesMap } from './types'
import { generateUUID } from './utils'
import {
	createGame,
	flushGameState,
	checkPlayerWin,
	getReadyGame,
	addReadyGame,
	removeReadyGame,
} from './logic'

const WebsocketServer = server

// ------------------------------------------------------------
// clients map
const guidToClients: ClientsMap = {}
// games map
const guidToGames: GamesMap = {}

// ------------------------------------------------------------
// place all games that have waiting players in a queue
let readyGames: Game[] = []

export default function (httpServer: any) {
	const wsServer = new WebsocketServer({ httpServer })

	wsServer.on('request', (request) => {
		const connection: connection = request.accept(null, request.origin)

		// generate a new clientId
		const clientId = generateUUID()
		guidToClients[clientId] = { connection }

		connection.on('message', (data: any) => {
			const message = data.utf8Data
			const result = JSON.parse(message)

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

	return wsServer
}

// ------------------------------------------------------------
// server methods
const handleJoin = (result: any) => {
	const readyGame = getReadyGame(readyGames)
	if (readyGame) {
		readyGame?.players.push(result.clientId)

		// send broadcast to all players in game
		const payload = {
			method: 'join',
			message: `${result.clientId} joined ${readyGame.gameId}`,
			clientId: result.clientId,
			gameId: readyGame.gameId,
		}
		readyGame.players.forEach((player) => {
			guidToClients[player].connection.send(JSON.stringify(payload))
		})
	} else {
		// create a new game and add it to the queue of ready games
		const gameId = generateUUID()
		const game = createGame(gameId, [result.clientId])
		guidToGames[gameId] = game
		addReadyGame(game, readyGames)
		// send the clientId and gameId to the client
		const payload = {
			method: 'join-wait',
			message: `new game ${gameId} created`,
			clientId: result.clientId,
			gameId,
			turn: 1,
		}
		guidToClients[result.clientId].connection.send(JSON.stringify(payload))
		// Send timeout message to client and remove game from queue
		const TIME_OUT =
			process.env.NODE_ENV === 'development' ? 4000 : 120 * 1000
		setTimeout(() => {
			const payload = {
				method: 'join-timeout',
				message: `Failed to get another player`,
				clientId: result.clientId,
				gameId,
			}
			if (game.players.length < 2) {
				readyGames = removeReadyGame(gameId, readyGames)
				guidToClients[result.clientId].connection.send(
					JSON.stringify(payload)
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
	const payload = {
		method: 'play',
		gameId: result.gameId,
		move: {
			cell: result.cell,
			symbol,
		},
		message: `move made on ${result.cell}`,
	}
	game.players.forEach((player) => {
		guidToClients[player].connection.send(JSON.stringify(payload))
	})
	// check for game win/draw
	checkPlayerWin(symbol, game.cells, game, guidToClients)
}
const handlePlayAgain = (result: any) => {
	const game = guidToGames[result.gameId]
	// send play again request to opponent
	let payload = {
		method: 'play-again',
		gameId: result.gameId,
		message: `Opponent wants to play again`,
	}
	const opponentId: any = game?.players.find(
		(player) => player !== result.clientId
	)

	guidToClients[opponentId].connection.send(
		JSON.stringify(payload),
		(err) => {
			// if opponent is not found, remove game from map and send error message to client
			if (err) {
				guidToGames[result.gameId] = null
				payload = {
					method: 'play-again-fail',
					gameId: result.gameId,
					message: `Opponent has left the game, you will be redirected back home`,
				}
				guidToClients[result.clientId].connection.send(
					JSON.stringify(payload)
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
		const payload = {
			method: 'rematch',
			value: false,
			message: `Opponent declined to play again`,
		}
		guidToClients[opponentId].connection.send(JSON.stringify(payload))
	} else {
		// flush game state
		if (game) game = flushGameState(game)
		const payload = {
			method: 'rematch',
			value: true,
			clientId: result.clientId,
			message: `Opponent accepted to play again`,
		}
		game?.players.forEach((player) => {
			guidToClients[player].connection.send(JSON.stringify(payload))
		})
	}
}
