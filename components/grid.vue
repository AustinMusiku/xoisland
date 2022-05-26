<template>
    <div class="playGround">
        <h1 class="heading">{{ comment }}</h1>

        <button class="sub-heading" @click="resetGame" v-if="state.isOver">Play Again</button>
        
        <div v-if="isPlaying" class="playSpace">
            <div class="bar horizontal horizontal-1"></div>
            <div class="bar horizontal horizontal-2"></div>
            <div class="bar vertical vertical-1"></div>
            <div class="bar vertical vertical-2"></div>

            <div class="playGrid">
                <div id="c1" class="input-field" @click="handleClick('c1')">{{cells.c1}}</div>
                <div id="c2" class="input-field" @click="handleClick('c2')">{{cells.c2}}</div>
                <div id="c3" class="input-field" @click="handleClick('c3')">{{cells.c3}}</div>
                <div id="c4" class="input-field" @click="handleClick('c4')">{{cells.c4}}</div>
                <div id="c5" class="input-field" @click="handleClick('c5')">{{cells.c5}}</div>
                <div id="c6" class="input-field" @click="handleClick('c6')">{{cells.c6}}</div>
                <div id="c7" class="input-field" @click="handleClick('c7')">{{cells.c7}}</div>
                <div id="c8" class="input-field" @click="handleClick('c8')">{{cells.c8}}</div>
                <div id="c9" class="input-field" @click="handleClick('c9')">{{cells.c9}}</div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
    import { reactive, ref, computed } from '@nuxtjs/composition-api'
    import { useGameplayStore } from '../stores/gameplay';

    const store = useGameplayStore();

    let props = defineProps<{
        isPlaying: boolean,
        comment: string,
    }>()

    let emit = defineEmits<{
        (e: 'fillField', cellId: string) :void
    }>()

    let cells = computed(() => store.getCells)

    interface State {
        isOver: boolean
    }

    let state: State = reactive({
        isOver: false
    })

    const endGame = () => {
        // state.isPlaying = false;
        state.isOver = true;
        // perform end animation
        if(process.client){
            let playSpace = document.querySelector('.playSpace') as HTMLElement;
            let inputFieldElements = document.querySelectorAll<HTMLElement>('.input-field')
            inputFieldElements.forEach(field => field.setAttribute('disabled', 'disabled'));
            playSpace.style.display = 'none';
        }
    }

    const resetGame = () => {
        // state.isPlaying = true;
        state.isOver = false;
        // state.comment = 'Touch to play!';
        for(let key in cells) store.getCells[key] = '';
        // perform start animation
        if(process.client){
            let playSpace = document.querySelector('.playSpace') as HTMLElement;
            let inputFieldElements = document.querySelectorAll<HTMLElement>('.input-field')
            inputFieldElements.forEach(field => field.removeAttribute('disabled'));
            playSpace.style.display = 'inline-block';
        }
        store.$reset();
    }

    const handleClick = (cellId: string) => {
        if(store.getCells[cellId] !== '') return;
        if(store.getTurn !== store.getFlag) return;

        emit('fillField', cellId);
    }
    
</script>

<style lang="scss" scoped>
    .playGround{
        display: grid;
        grid-template-columns: 1fr;
        gap: 2rem;
        justify-items: center;

        
        button{
            width: fit-content;
            padding: .25em 1em;
            border: none;
            outline: none;
            background-color: transparent;
            cursor: pointer;
            text-decoration: underline;
        }

        .playSpace{
            position: relative;
            margin: auto;
            height: 300px;
            width: 300px;
    
            .bar{
                position: absolute;
                background-color: black;
                z-index: 5;
    
                &.vertical{
                    top: 0;
                    height: 100%;
                    width: .2em;
                    transform: translateX(-50%);
                }
    
                &.horizontal{
                    left: 0;
                    width: 100%;
                    height: .2em;
                    transform: translateY(-50%);
                }
    
                &.vertical-1{ left: 33.3333% }
                &.vertical-2{ left: 66.6666% }
    
                &.horizontal-1{ top: 33.3333% }
                &.horizontal-2{ top: 66.6666% }
            }
            .playGrid{
                position: relative;
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                grid-template-rows: repeat(3, 1fr);
                width: 100%;
                height: 100%;

                .input-field {
                    display: grid;
                    place-items: center;
                    width: 100%;
                    height: 100%;
                    border: none;
                    outline: none;
                    font-size: 70px;
                    color: black;
                    background-color: transparent;
                    text-align: center;
                    caret-color: transparent;
                    cursor: pointer;
                }
            }
        }
    }
</style>