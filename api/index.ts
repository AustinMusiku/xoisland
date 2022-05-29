import { createServer } from 'http';
import websocket from 'websocket'; 
import dotenv from 'dotenv';

import { ClientsMap, Game, GamesMap } from './types';
import { generateUUID } from './utils';
import { checkPlayerWin, getReadyGame, addReadyGame, removeReadyGame } from './game';

dotenv.config();

const PORT = process.env.WEBSOCKET_PORT;

const websocketServer = websocket.server; 
const server = createServer();

const wsServer = new websocketServer({ httpServer: server })

// ------------------------------------------------------------
// clients map
const guidToClients: ClientsMap = {};
// games map
const guidToGames: GamesMap = {};

// ------------------------------------------------------------
// place all games that have waiting players in a queue
let readyGames: Game[] = []

// ------------------------------------------------------------
wsServer.on('request', request => {
    const connection: websocket.connection = request.accept(null, request.origin);

    //generate a new clientId
    const clientId = generateUUID();
    guidToClients[clientId] = { 'connection': connection }

    connection.on('message', (data: any) => {
        let message = data.utf8Data;
        let result: any = JSON.parse(message);
        connection.send(JSON.stringify({ msg: "arrived" }))

        switch (result.method) {
            case 'join':
                handleJoin(result)
                break;
            case 'play':
                handleMove(result)
                break;
            case 'play-again':
                handlePlayAgain(result)
                break;
            default:
                break;
        }
    })

    //send back the clientId
    connection.send(JSON.stringify({ "method": "connect", "clientId": clientId})) 

    connection.on("close", () => console.log("closed!"))
})

// ------------------------------------------------------------
// server methods
const handleJoin = (result: any) => {
    let readyGame = getReadyGame(readyGames);
    if(readyGame){
        console.log('found ready game')
        readyGame?.players.push(result.clientId);

        // send broadcast to all players in game
        const payLoad = {
            method: "join",
            message: `${result.clientId} joined ${readyGame.gameId}`,
            clientId: result.clientId,
            gameId: readyGame.gameId,
        }
        readyGame.players.forEach(player => {
            guidToClients[player].connection.send(JSON.stringify(payLoad))
        })
    }else{
        // create a new game and add it to the queue of ready games
        let gameId = generateUUID();
        let game = {
            gameId,
            players: [result.clientId],
            gameOver: false,
            cells: {c1: '',c2: '',c3: '',c4: '',c5: '',c6: '',c7: '',c8: '',c9: ''}
        };
        guidToGames[gameId] = game;
        addReadyGame(game, readyGames);
        // send the clientId and gameId to the client
        const payLoad = {
            method: "join-wait",
            message: `new game ${gameId} created`,
            clientId: result.clientId,
            gameId: gameId,
            turn: 1,
        }
        guidToClients[result.clientId].connection.send(JSON.stringify(payLoad))
        // After 10 seconds, send timeout message to client and remove game from queue
        setTimeout(() => {
            readyGames = removeReadyGame(gameId, readyGames)
            const payLoad = {
                method: "join-timeout",
                message: `Failed to get another player`,
                clientId: result.clientId,
                gameId: gameId,
            }
            guidToClients[result.clientId].connection.send(JSON.stringify(payLoad))
        }, 4000)
    }
}

const handleMove = (result: any) => {
    // fill game state
    let game = guidToGames[result.gameId];
    if(game === null) return;
    let symbol: string = game.players.indexOf(result.clientId) === 0 ? 'X' : 'O';
    game.cells[result.cell] = symbol;
    // send played move to all players in game
    let payLoad = {
        method: "play",
        gameId: result.gameId,
        move: {
            cell: result.cell,
            symbol: symbol,
        },
        message: `move made on ${result.cell}`,
    }
    game.players.forEach(player => {
        guidToClients[player].connection.send(JSON.stringify(payLoad))
    })
    // check for game win/draw
    checkPlayerWin(symbol, game.cells, game, guidToClients);
}

const handlePlayAgain = (result: any) => {
    let game = guidToGames[result.gameId];
    // send play again request to opponent
    let payLoad = {
        method: "play-again",
        gameId: result.gameId,
        message: `Opponent wants to play again`,
    }
    let opponentId: any = game?.players.find(player => player !== result.clientId);

    guidToClients[opponentId].connection.send(JSON.stringify(payLoad), () => {
        // if opponent is not found, remove game from map and send error message to client
        // guidToGames[result.gameId] = null;
        payLoad = {
            method: "play-again-fail",
            gameId: result.gameId,
            message: `Opponent has left the game`,
        }
        guidToClients[result.clientId].connection.send(JSON.stringify(payLoad));
    });
}

server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});