import { createServer } from 'http';
import websocket from 'websocket'; 
import dotenv from 'dotenv';
import { ClientsMap, Game, GamesMap } from './types';

import { generateUUID } from './utils';

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
// store all games that have waiting players in a queue
let readyGames: Game[] = []
// queue methods
const addReadyGame = (game: Game) => readyGames.push(game);
const getReadyGame = () => {
    if(readyGames.length < 1) return null;
    const game = readyGames.shift();
    return game;
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

        switch (result.type) {
            case 'join':
                handleJoin(clientId)
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
const handleJoin = (clientId: string) => {
    let readyGame = getReadyGame();
    if(readyGame){
        readyGame.players.push(clientId);
        console.log(readyGame)

        const payLoad = {
            "method": "join",
            "message": `${clientId} joined`,
            "clientId": clientId,
            "gameId": readyGame.gameId,
            "symbol": 'O',
            "turn": 2,
        }
        readyGame.players.forEach(player => {
            guidToClients[player].connection.send(JSON.stringify(payLoad))
        })
    }else{
        // create a new game and add it to the queue of ready games
        let gameId = generateUUID();
        let game = {
            gameId,
            players: [clientId],
            gameOver: false,
            cells: {c1: '',c2: '',c3: '',c4: '',c5: '',c6: '',c7: '',c8: '',c9: ''}
        };
        guidToGames[gameId] = game;
        addReadyGame(game);

        // send the clientId and gameId to the client
        const payLoad = {
            "method": "join",
            "message": `new game ${gameId} created`,
            "clientId": clientId,
            "gameId": gameId,
            "symbol": 'O',
            "turn": 2,
        }
        guidToClients[clientId].connection.send(JSON.stringify(payLoad))
        
    }
}

server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});