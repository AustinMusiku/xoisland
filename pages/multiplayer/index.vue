<template>
    <div class="grid">
        <div class="grid__container">
            <div class="content-wrapper">
                <button @click="joinBtnClick">join</button>
                <Grid />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
let handleClick: any;

const joinBtnClick = () => {
    handleClick()
}
if(process.client){
    let clientId: string;
    let gameId: string;
    let ws = new WebSocket('ws://localhost:4500');

    ws.onmessage = message => {
        const data = JSON.parse(message.data);

        if(data.method === 'connect'){
            clientId = data.clientId;
            console.log(`client connected: ${clientId}`);
        }

        if(data.method === 'join'){
            let msg = data.message;
            console.log(msg);
        }
        if(data.method === 'join-wait'){
            let msg = data.message;
            console.log(msg);
        }
        if(data.method === 'join-timeout'){
            let msg = data.message;
            console.log(msg);
        }

        if(data.method === 'update'){
        }
    }

    handleClick = () :void => {
        ws.send(JSON.stringify({
            method: 'join',
            clientId: clientId
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
