<template>
    <div class="grid">
        <div class="grid__container">
            <div class="content-wrapper">
                <button @click="handleClick">Send Data</button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">


// if(process.client){
    let ws = new WebSocket('ws://localhost:3000');
    ws.onopen = () => { console.log('connected') }
    
    const handleClick = () => {
        let payload = {
            type: 'join',
            clientId: Math.random().toString(),
            payload: {
                name: 'test'
            }
        }
        console.log('message')
        ws.send(JSON.stringify(payload));
    }

    ws.onmessage = message => {
        console.log(message)
    }
// }

</script>

<style lang="scss" scoped>
    .content-wrapper{
        width: 100%;
        text-align: center;
        justify-content: center;
    }
</style>
