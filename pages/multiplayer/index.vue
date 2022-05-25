<template>
    <div class="grid">
        <div class="grid__container">
            <div class="content-wrapper">
                <button @click="joinBtnClick">join</button>
                <p>{{ state.message }}</p>
                <Grid @fillField="fillField"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive } from '@nuxtjs/composition-api';

let state = reactive({
    clientId: '',
    gameId: '',
    turn: null,
    message: '',
})

// const payLoad = {
//     "turns": {
//         "player1": readyGame.players[0],
//         "player2": readyGame.players[1],
//     },
// }

let handleClick: any;
const joinBtnClick = () => handleClick();
const fillField = (cellId: string) => handleClick();


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
            if(state.turn === null) state.turn = data.turn;
            state.message = data.message;
            let msg = data.message;
        }
        if(data.method === 'join-wait'){
            state.gameId = data.gameId;
            state.message = data.message;
            state.turn = data.turn;
            console.log(state.message);
        }
        if(data.method === 'join-timeout'){
            state.message = data.message;
            state.gameId = '';

        }

        if(data.method === 'play'){
        }

        if(data.method === 'end'){
        }

        if(data.method === 'update'){
        }
    }

    handleClick = () :void => {
        ws.send(JSON.stringify({
            method: 'join',
            clientId: state.clientId
        }))
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
