import { createServer } from 'http';
import websocket from 'websocket'; 
import dotenv from 'dotenv';

import { ClientsMap, Game, GamesMap } from './types';
import { generateUUID } from './utils';
import { checkPlayerWin, endGame } from './game';

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
// queue methods
const addReadyGame = (game: Game) => readyGames.push(game);
const getReadyGame = () => {
    if(readyGames.length < 1) return null;
    const game = readyGames.shift();
    return game;
}
const removeReadyGame = (gameId: string) => {
    readyGames = readyGames.filter(game => game.gameId !== gameId);
}

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
    let readyGame = getReadyGame();
    if(readyGame){
        readyGame.players.push(result.clientId);

        // send broadcast to all players in game
        const payLoad = {
            "method": "join",
            "message": `${result.clientId} joined ${readyGame.gameId}`,
            "clientId": result.clientId,
            "gameId": readyGame.gameId,
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
        addReadyGame(game);

        // send the clientId and gameId to the client
        const payLoad = {
            "method": "join-wait",
            "message": `new game ${gameId} created`,
            "clientId": result.clientId,
            "gameId": gameId,
            "turn": 1,
        }
        guidToClients[result.clientId].connection.send(JSON.stringify(payLoad))
        // After 10 seconds, send timeout message to client and remove game from queue
        setTimeout(() => {
            const payLoad = {
                "method": "join-timeout",
                "message": `Failed to get another player`,
                "clientId": result.clientId,
                "gameId": gameId,
            }
            if(guidToGames[gameId].players.length < 2){
                guidToClients[result.clientId].connection.send(JSON.stringify(payLoad))
                removeReadyGame(gameId)
            }
        }, 2000)
    }
}

const handleMove = (result: any) => {
    // fill game state
    let game: Game = guidToGames[result.gameId];
    let symbol: string = game.players.indexOf(result.clientId) === 0 ? 'X' : 'O';
    game.cells[result.cell] = symbol;
    // send played move to all players in game
    let payLoad = {
        "method": "play",
        "gameId": result.gameId,
        "move": {
            "cell": result.cell,
            "symbol": symbol,
        },
        message: `move made on ${result.cell}`,
    }
    game.players.forEach(player => {
        guidToClients[player].connection.send(JSON.stringify(payLoad))
    })
    // check for game win/draw
    checkPlayerWin(symbol, game.cells, game, guidToClients);
}

server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});