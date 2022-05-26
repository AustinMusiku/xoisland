<template>
    <div class="grid">
        <div class="grid__container">
            <div class="content-wrapper">
                <!-- <div v-if="$nuxt.isOffline">You are offline</div> -->
                <Grid :comment="state.comment" @fillField="fillField"/>
            </div>
        </div>
    </div>
</template>

<script setup context lang="ts">
import { reactive, useContext } from '@nuxtjs/composition-api';
import { useGameplayStore } from '../../stores/gameplay';

let store = useGameplayStore();
const { redirect } = useContext();

let state = reactive({
    clientId: '',
    gameId: '',
    message: '',
    comment: ''
})

let handleMove: any;
const fillField = (cellId: string) => handleMove(cellId);

if(process.client){
    let ws = new WebSocket('ws://localhost:4500');

    ws.onmessage = message => {
        const data = JSON.parse(message.data);

        switch(data.method){
            case 'connect':
                state.clientId = data.clientId;
                console.log(`client connected: ${state.clientId}`);

                // create/join game
                ws.send(JSON.stringify({
                    method: 'join',
                    clientId: state.clientId
                }))
                break;

            case 'join':
                if(state.gameId === '') state.gameId = data.gameId;
                if(store.getTurn == 0) store.setTurn(2);
                state.message = data.message;
                state.comment = 'Touch to play!'
                break;

            case 'join-wait':
                state.gameId = data.gameId;
                state.message = data.message;
                store.setTurn(data.turn);
                console.log(state.message);
                break;

            case 'join-timeout':
                state.message = data.message;
                state.gameId = '';
                console.log(state.message);
                redirect('/');
                break;

            case 'play':
                let cellPlayed = data.move.cell;
                let cellSymbol = data.move.symbol
                state.message = data.message;

                store.getFlag === 1 ? state.comment = "Player O Turn": state.comment = "Player X Turn";
                cellSymbol === 'X' ? store.incrementFlag() : store.decrementFlag();
                
                store.getCells[cellPlayed] = cellSymbol;
                break;

            case 'end':
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
}

</script>

<style lang="scss" scoped>
    .content-wrapper{
        width: 100%;
        text-align: center;
        justify-content: center;
    }
</style>
