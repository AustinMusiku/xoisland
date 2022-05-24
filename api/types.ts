import websocket from 'websocket';

export interface ClientsMap{
    [key: string]: {
        connection: websocket.connection;
    }
}
export interface Game{
    gameId: string;
    players: string[],
    gameOver: boolean,
    cells: {c1: string,c2: string,c3: string,c4: string,c5: string,c6: string,c7: string,c8: string,c9: string}
}
export interface GamesMap{
    [key: string]: Game
}