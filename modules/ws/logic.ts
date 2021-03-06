import { Cells, ClientsMap, Game, Winner } from './types'

export const createGame = (gameId: string, players?: string[]): Game => {
	return {
		gameId,
		players: players || [],
		gameOver: false,
		rematchTime: 0,
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
}

export const flushGameState = (game: Game): Game => {
	// for(const key in game.cells) game.cells[key] = '';
	game.cells = {
		c1: '',
		c2: '',
		c3: '',
		c4: '',
		c5: '',
		c6: '',
		c7: '',
		c8: '',
		c9: '',
	}
	return game
}

export const addReadyGame = (game: Game, readyGames: Game[]) => {
	readyGames.push(game)
}

export const getReadyGame = (readyGames: Game[]) => {
	if (readyGames.length < 1) return null
	const game = readyGames.shift()
	return game
}

export const removeReadyGame = (gameId: string, readyGames: Game[]): Game[] => {
	readyGames = readyGames.filter((game) => game.gameId !== gameId)
	return readyGames
}

export function checkPlayerWin(
	x: string,
	state: Cells,
	game: Game,
	clients: ClientsMap
) {
	let isWinner: boolean = false
	let winner: Winner = { symbol: x, cells: [] }

	const setWinner = (x: string, cells: string[]) => {
		isWinner = true
		winner = {
			symbol: x,
			cells,
		}
	}
	// check all possible win conditions
	if (state.c1 === x && state.c2 === x && state.c3 === x)
		setWinner(x, ['c1', 'c2', 'c3'])
	if (state.c4 === x && state.c5 === x && state.c6 === x)
		setWinner(x, ['c4', 'c5', 'c6'])
	if (state.c7 === x && state.c8 === x && state.c9 === x)
		setWinner(x, ['c7', 'c8', 'c9'])
	if (state.c1 === x && state.c4 === x && state.c7 === x)
		setWinner(x, ['c1', 'c4', 'c7'])
	if (state.c2 === x && state.c5 === x && state.c8 === x)
		setWinner(x, ['c2', 'c5', 'c8'])
	if (state.c3 === x && state.c6 === x && state.c9 === x)
		setWinner(x, ['c3', 'c6', 'c9'])
	if (state.c1 === x && state.c5 === x && state.c9 === x)
		setWinner(x, ['c1', 'c5', 'c9'])
	if (state.c3 === x && state.c5 === x && state.c7 === x)
		setWinner(x, ['c3', 'c5', 'c7'])

	// if there is a winner, call the end game function
	if (isWinner) {
		endGame(game, clients, winner)
	}
	// else if all cells are filled, match draw
	else if (Object.entries(state).every((x) => x[1] !== '')) {
		endGame(game, clients)
	}
}

export function endGame(game: Game, clients: ClientsMap, winner?: Winner) {
	// send end game message to all players in game
	const payload = {
		method: 'end',
		message:
			winner === undefined
				? 'match draw'
				: `Player ${winner?.symbol} won`,
		gameId: game.gameId,
		symbol: winner ? winner.symbol : 'D',
		cells: winner?.cells,
	}
	game.players.forEach((player) => {
		clients[player].connection.send(JSON.stringify(payload))
	})
}
