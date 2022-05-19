import { createServer } from 'http';
import express, { Express, request, Request, Response } from 'express';
import websocket, { IUtf8Message } from 'websocket'; 
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const websocketServer = websocket.server; 
const server = createServer(app);

const wsServer = new websocketServer({
    httpServer: server
})

// clients map
interface Clients{
    [key: string]: {
        connection: websocket.connection;
    }
}
const guidToClients: Clients = {};

wsServer.on('request', request => {
    console.log('request');

    const connection: websocket.connection = request.accept(null, request.origin);
    connection.on('message', message => {
        const result: IUtf8Message = JSON.parse(message.type);
        console.log(result);
    })

    //generate a new clientId
    const clientId = guid();
    guidToClients[clientId] = { 'connection': connection }

    const payLoad = {
        "method": "connect",
        "clientId": clientId
    }
    //send back the client connect
    connection.send(JSON.stringify(payLoad))

    connection.on("close", () => console.log("closed!"))
})

const S4 = () => (((1+Math.random())*0x10000)|0).toString(16).substring(1)
const guid = () => (S4() + S4() + "-" + S4() + "-4" + S4().substr(0,3) + "-" + S4() + "-" + S4() + S4() + S4()).toLowerCase();

const PORT = process.env.PORT || 4500;
server.listen(PORT, () => {
    console.log(`server listening on port ${PORT}`);
});

// wsServer.on("request", request => {
//     //connect
//     const connection = request.accept(null, request.origin);
//     connection.on("open", () => console.log("opened!"))
//     connection.on("close", () => console.log("closed!"))
//     connection.on("message", message => {
//         const result = JSON.parse(message.utf8Data)
//         //I have received a message from the client
//         //a user want to create a new game
//         if (result.method === "create") {
//             const clientId = result.clientId;
//             const gameId = guid();
//             games[gameId] = {
//                 "id": gameId,
//                 "balls": 20,
//                 "clients": []
//             }

//             const payLoad = {
//                 "method": "create",
//                 "game" : games[gameId]
//             }

//             const con = clients[clientId].connection;
//             con.send(JSON.stringify(payLoad));
//         }

//         //a client want to join
//         if (result.method === "join") {

//             const clientId = result.clientId;
//             const gameId = result.gameId;
//             const game = games[gameId];
//             if (game.clients.length >= 3) 
//             {
//                 //sorry max players reach
//                 return;
//             }
//             const color =  {"0": "Red", "1": "Green", "2": "Blue"}[game.clients.length]
//             game.clients.push({
//                 "clientId": clientId,
//                 "color": color
//             })
//             //start the game
//             if (game.clients.length === 3) updateGameState();

//             const payLoad = {
//                 "method": "join",
//                 "game": game
//             }
//             //loop through all clients and tell them that people has joined
//             game.clients.forEach(c => {
//                 clients[c.clientId].connection.send(JSON.stringify(payLoad))
//             })
//         }
//         //a user plays
//         if (result.method === "play") {
//             const gameId = result.gameId;
//             const ballId = result.ballId;
//             const color = result.color;
//             let state = games[gameId].state;
//             if (!state)
//                 state = {}
            
//             state[ballId] = color;
//             games[gameId].state = state;
            
//         }

//     })

//     //generate a new clientId
//     const clientId = guid();
//     clients[clientId] = {
//         "connection":  connection
//     }

//     const payLoad = {
//         "method": "connect",
//         "clientId": clientId
//     }
//     //send back the client connect
//     connection.send(JSON.stringify(payLoad))

// })