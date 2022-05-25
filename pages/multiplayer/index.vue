<template>
    <div class="grid">
        <div class="grid__container">
            <div class="content-wrapper">
                <button @click="joinBtnClick">join</button>
                <Grid @fillField="fillField"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from '@nuxtjs/composition-api';
import { useGameplayStore } from '../../stores/gameplay';

let store = useGameplayStore();

let state = reactive({
    clientId: '',
    gameId: '',
    message: '',
})

let handleJoin: any;
let handleMove: any;
const joinBtnClick = () => handleJoin();
const fillField = (cellId: string) => handleMove(cellId);


if(process.client){
    let ws = new WebSocket('ws://localhost:4500');

    ws.onmessage = message => {
        const data = JSON.parse(message.data);

        if(data.method === 'connect'){
            state.clientId = data.clientId;
            console.log(`client connected: ${state.clientId}`);
        }

        if(data.method === 'join'){
            if(state.gameId === '') state.gameId = data.gameId;
            if(store.getTurn == 0) store.setTurn(2);
            state.message = data.message;
        }
        if(data.method === 'join-wait'){
            state.gameId = data.gameId;
            state.message = data.message;
            store.setTurn(data.turn);
            console.log(state.message);
        }
        if(data.method === 'join-timeout'){
            state.message = data.message;
            state.gameId = '';
        }

        if(data.method === 'play'){
            let cellPlayed = data.move.cell;
            let cellSymbol = data.move.symbol
            state.message = data.message;

            cellSymbol === 'X' ? store.incrementFlag() : store.decrementFlag();
            
            store.getCells[cellPlayed] = cellSymbol;
        }

        if(data.method === 'end'){
        }

        if(data.method === 'update'){
        }
    }

    handleJoin = () :void => {
        ws.send(JSON.stringify({
            method: 'join',
            clientId: state.clientId
        }))
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
}

</script>

<style lang="scss" scoped>
    .content-wrapper{
        width: 100%;
        text-align: center;
        justify-content: center;
    }
</style>
