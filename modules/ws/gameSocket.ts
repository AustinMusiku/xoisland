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
const guidToRandomGames: GamesMap = {}
const guidToHostedGames: GamesMap = {}

// ------------------------------------------------------------
// place all games that have waiting players in a queue
let readyRandomGames: Game[] = []
let readyHostedGames: Game[] = []

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
				case 'join-cancel':
					handleCancel(result)
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
				case 'abort-game':
					handleAbortGame(result)
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
	// -----------
	// Hosted mode
	// -----------
	if (result.mode === 'hosted') {
		const readyGame = readyHostedGames.find(
			(game) => game.gameId === result.gameId
		)
		if (readyGame) {
			readyGame.players.push(result.clientId)

			// send broadcast to all players in game
			readyGame.players.forEach((playerId) => {
				const payload = {
					method: 'join',
					message: `${result.clientId} joined ${readyGame.gameId}`,
					clientId: result.clientId,
					gameId: readyGame.gameId,
					turn: readyGame.players.indexOf(playerId) === 0 ? 1 : 2,
				}
				guidToClients[playerId].connection.send(JSON.stringify(payload))
			})
		} else {
			// create a new game and add it to the queue of ready games
			const { gameId } = result
			const game = createGame(gameId, [result.clientId])
			guidToHostedGames[gameId] = game
			addReadyGame(game, readyHostedGames)
			// send the clientId and gameId to the client
			const payload = {
				method: 'join-create',
				message: `new game ${gameId} created`,
				clientId: result.clientId,
				gameId,
			}
			guidToClients[result.clientId].connection.send(
				JSON.stringify(payload)
			)
			// Send timeout message to client and remove game from queue
			const TIME_OUT =
				process.env.NODE_ENV === 'development' ? 4000 : 60 * 1000
			setTimeout(() => {
				const payload = {
					method: 'join-create-timeout',
					message: 'Invite timeout',
					clientId: result.clientId,
					gameId,
				}
				if (
					readyHostedGames.includes(game) &&
					game.players.length < 2
				) {
					readyHostedGames = removeReadyGame(gameId, readyHostedGames)
					guidToClients[result.clientId].connection.send(
						JSON.stringify(payload)
					)
				}
			}, TIME_OUT)
		}
	} else {
		// ---------------
		// random mode
		// ---------------
		const readyGame = getReadyGame(readyRandomGames)
		if (readyGame) {
			readyGame.players.push(result.clientId)

			// send broadcast to all players in game
			readyGame.players.forEach((playerId) => {
				const payload = {
					method: 'join',
					message: `${result.clientId} joined ${readyGame.gameId}`,
					clientId: result.clientId,
					gameId: readyGame.gameId,
					turn: readyGame.players.indexOf(playerId) === 0 ? 1 : 2,
				}
				guidToClients[playerId].connection.send(JSON.stringify(payload))
			})
		} else {
			// create a new game and add it to the queue of ready games
			const gameId = generateUUID()
			const game = createGame(gameId, [result.clientId])
			guidToRandomGames[gameId] = game
			addReadyGame(game, readyRandomGames)
			// send the clientId and gameId to the client
			const payload = {
				method: 'join-wait',
				message: `new game ${gameId} created`,
				clientId: result.clientId,
				gameId,
			}
			guidToClients[result.clientId].connection.send(
				JSON.stringify(payload)
			)
			// Send timeout message to client and remove game from queue
			const TIME_OUT =
				process.env.NODE_ENV === 'development' ? 4000 : 60 * 1000
			setTimeout(() => {
				const payload = {
					method: 'join-timeout',
					message: `Failed to get another player`,
					clientId: result.clientId,
					gameId,
				}
				if (
					readyRandomGames.includes(game) &&
					game.players.length < 2
				) {
					readyRandomGames = removeReadyGame(gameId, readyRandomGames)
					guidToClients[result.clientId].connection.send(
						JSON.stringify(payload)
					)
				}
			}, TIME_OUT)
		}
	}
}
const handleMove = (result: any) => {
	// fill game state
	const game = guidToRandomGames[result.gameId]
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
	const game = guidToRandomGames[result.gameId]
	if (game === null) return
	// check for time since last rematch request in order to avoid collisions
	const now = Date.now()
	const timeDifference = now - game.rematchTime
	if (timeDifference < 5000) return // reject if last request was <5s ago
	game.rematchTime = now
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
				guidToRandomGames[result.gameId] = null
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
	let game = guidToRandomGames[result.gameId]
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
const handleCancel = (result: any) => {
	const { clientId, gameId } = result
	readyRandomGames = removeReadyGame(gameId, readyRandomGames)
	const payload = {
		method: 'join-cancel',
		message: 'you have left the game',
	}
	guidToClients[clientId].connection.send(JSON.stringify(payload))
}
const handleAbortGame = (result: any) => {
	const game = guidToRandomGames[result.gameId]
	if (game === null) return
	const opponentId: any = game?.players.find(
		(player) => player !== result.clientId
	)
	// clear game from guid
	guidToRandomGames[result.gameId] = null
	// send abort to opponent
	const payload = {
		method: 'abort-game',
		message: `Opponent has left the game`,
	}
	guidToClients[opponentId].connection.send(JSON.stringify(payload))
}
