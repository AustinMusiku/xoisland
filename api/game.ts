import { Cells, ClientsMap, Game } from "./types"


export const checkPlayerWin = (x: string, state: Cells, game: Game, clients: ClientsMap) => {
    let isWinner: boolean = (( state.c1 == x && state.c2 == x && state.c3 == x) ||( state.c4 == x && state.c5 == x && state.c6 == x) ||( state.c7 == x && state.c8 == x && state.c9 == x) ||( state.c1 == x && state.c4 == x && state.c7 == x) ||( state.c2 == x && state.c5 == x && state.c8 == x) ||( state.c3 == x && state.c6 == x && state.c9 == x) ||( state.c1 == x && state.c5 == x && state.c9 == x) ||( state.c3 == x && state.c5 == x && state.c7 == x))
    if (isWinner) endGame(game, clients, x);
    // if all cells are filled, match draw
    if (Object.entries(state).every(x => x[1] !== '')) {
        endGame(game, clients);
    }
}

export const endGame = (game: Game, clients: ClientsMap, winner?: string) => {
    // send end game message to all players in game
    const payLoad = {
        "method": "end",
        "message": winner === null ? 'match draw' : `Player ${winner} won`,
        "gameId": game.gameId,
        "symbol": `${winner}`,
    }
    game.players.forEach(player => {
        clients[player].connection.send(JSON.stringify(payLoad))
    })
}