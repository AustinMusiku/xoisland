import websocket from 'websocket';

export interface Cells{
    [key: string]: string
}

export interface ClientsMap{
    [key: string]: {
        connection: websocket.connection;
    }
}

export interface Game{
    gameId: string;
    players: string[],
    gameOver: boolean,
    cells: Cells,
}

export interface GamesMap{
    [key: string]: Game
}

