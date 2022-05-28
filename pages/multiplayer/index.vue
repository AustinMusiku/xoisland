<template>
    <div class="grid">
        <div class="grid__container">
            <div class="content-wrapper">
                <!-- <div v-if="$nuxt.isOffline">You are offline</div> -->
                <Loading 
                    v-if="!state.isTwoPlayers"
                    :isLoading="state.isLoading"
                    :comment="state.comment"
                    @joinAgain="joinAgain"
                />

                <Grid
                    v-if="store.getIsPlaying"
                    :comment="state.comment"
                    :winner="state.winner"
                    @fillField="fillField"
                />
            </div>
        </div>
    </div>
</template>

<script setup context lang="ts">
import { onMounted, reactive, useContext } from '@nuxtjs/composition-api';
import { useGameplayStore } from '../../stores/gameplay';

let store = useGameplayStore();

interface State{
    clientId: string,
    gameId: string,
    message: string,
    comment: string,
    isLoading: boolean,
    isTwoPlayers: boolean,
    winner: { player: string, cells: string[] },
}

let state: State= reactive({
    clientId: '',
    gameId: '',
    message: '',
    comment: '',
    
    isLoading: true,
    isTwoPlayers: false,
    winner: {
        player: '',
        cells: []
    },
})


let handleMove: any; 
let handleTryAgain: any; 
let joinAgain = () => {
    handleTryAgain()
}
const fillField = (cellId: string) => handleMove(cellId);

onMounted(() => {
    let ws = new WebSocket('ws://192.168.8.187:4500');

    ws.onmessage = message => {
        const data = JSON.parse(message.data);

        switch(data.method){
            case 'connect':
                state.clientId = data.clientId;

                // create/join game
                ws.send(JSON.stringify({
                    method: 'join',
                    clientId: state.clientId
                }))
                break;

            case 'join':
                state.isLoading = false;
                state.isTwoPlayers = true;
                if(state.gameId === '') state.gameId = data.gameId;
                if(store.getTurn == 0) store.setTurn(2);
                state.message = data.message;
                store.toggleIsPlaying();
                state.comment = 'Player X turn'
                break;

            case 'join-wait':
                state.gameId = data.gameId;
                store.setTurn(data.turn);
                state.comment = 'Waiting for another player...';
                break;

            case 'join-timeout':
                state.isLoading = false;
                state.comment = data.message;
                state.gameId = '';
                break;

            case 'play':
                let cellPlayed = data.move.cell;
                let cellSymbol = data.move.symbol

                store.getFlag === 1 ? state.comment = "Player O Turn": state.comment = "Player X Turn";
                cellSymbol === 'X' ? store.incrementFlag() : store.decrementFlag();
                
                store.getCells[cellPlayed] = cellSymbol;
                break;

            case 'end':
                state.comment = data.message;
                state.winner = {
                    player: data.symbol,
                    cells: data.cells
                };
                store.toggleIsGameOver();
                break;

            case 'update':
                break;
        }
    }

    handleMove = (cellId: string) :void => {
        let payLoad = {
            "method": "play",
            "clientId": state.clientId,
            "gameId": state.gameId,
            "cell": cellId
        }
        ws.send(JSON.stringify(payLoad))
    }

    handleTryAgain = () => {
        state.isLoading = true;
        state.isTwoPlayers = false;

        // create/join game again
        ws.send(JSON.stringify({
            method: 'join',
            clientId: state.clientId
        }))
    }
})

</script>

<style lang="scss" scoped>
    .content-wrapper{
        width: 100%;
        text-align: center;
        justify-content: center;
    }
</style>
