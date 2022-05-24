import { createServer } from 'http';
import express, { Express, request, Request, Response } from 'express';
import websocket, { IUtf8Message } from 'websocket'; 
import dotenv from 'dotenv';

import { generateUUID } from './utils';

dotenv.config();

const app = express();
const websocketServer = websocket.server; 
const server = createServer();

const wsServer = new websocketServer({
    httpServer: server
})

// ------------------------------------------------------------
// clients map
interface Clients{
    [key: string]: {
        connection: websocket.connection;
    }
}
const guidToClients: Clients = {};

// games map
interface Game{
    gameId: string;
    players: string[],
    gameOver: boolean,
    cells: {c1: string,c2: string,c3: string,c4: string,c5: string,c6: string,c7: string,c8: string,c9: string}
}
interface MapGame{
    [key: string]: Game
}
const guidToGames: MapGame = {};

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


    connection.on('message', sent => {
        let result: any = JSON.parse(sent.utf8Data);
        connection.send(JSON.stringify({ msg: "arrived" }))

        if(result.type === 'join'){
            let readyGame = getReadyGame();
            if(readyGame){
                readyGame.players.push(clientId);

                const payLoad = {
                    "method": "join",
                    "message": `${clientId} joined`,
                    "clientId": clientId,
                    "gameId": readyGame.gameId,
                    "symbol": 'O',
                    "turn": 2,
                }
                // guidToClients[clientId].connection.send(JSON.stringify(payLoad))
                readyGame.players.forEach(player => {
                    guidToClients[player].connection.send(JSON.stringify(payLoad))
                    // console.log(player);
                })
            }else{
                let gameId = generateUUID();
                let game = {
                    gameId: gameId,
                    players: [clientId],
                    gameOver: false,
                    cells: {c1: '',c2: '',c3: '',c4: '',c5: '',c6: '',c7: '',c8: '',c9: ''}
                };
                guidToGames[gameId] = game;
                addReadyGame(game);
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
    })

    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }
    //send back the client connect
    connection.send(JSON.stringify(payLoad)) 

    connection.on("close", () => console.log("closed!"))
})

const PORT = process.env.WEBSOCKET_PORT;
server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});