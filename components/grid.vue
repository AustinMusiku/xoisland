<template>
    <div class="playGround">
        
        <h1 class="sub-heading" v-if="isPlaying">{{ comment }}</h1>
        <h1 class="sub-heading" v-else="!isPlaying">Touch to play!</h1>

        <button class="mini-heading" @click="resetGame" v-if="isOver">Play Again</button>
        
        <div class="playSpace">
            <div class="bar horizontal horizontal-1"></div>
            <div class="bar horizontal horizontal-2"></div>
            <div class="bar vertical vertical-1"></div>
            <div class="bar vertical vertical-2"></div>

            <div class="playGrid" @click="startGame">
                <Cell 
                    v-for="(cell, key) in cells" :key="key" 
                    :cell-id="key" :cellValue="cells[key]" 
                    @update:cellValue="updateCell"/>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
    import { reactive, ref } from '@nuxtjs/composition-api'
    import { useFlagStore } from '../stores/flag';

    const store = useFlagStore();

    interface Cells { [c1: string]: string}
    let cells: Cells = reactive({ c1: '', c2: '', c3: '', c4: '', c5: '', c6: '', c7: '', c8: '', c9: '' })

    let comment = ref<string>('');
    let isPlaying = ref<boolean>(false);
    let isOver = ref<boolean>(false);

    const startGame = () => {
        if(!isPlaying.value) {
            isPlaying.value = true;
        }
    }

    const endGame = () => {
        isPlaying.value = false;
        isOver.value = true;
        // perform end animation
        if(process.client){
            let playSpace = document.querySelector('.playSpace') as HTMLElement;
            let inputFieldElements = document.querySelectorAll<HTMLElement>('.input-field')
            inputFieldElements.forEach(field => field.setAttribute('disabled', 'disabled'));
            playSpace.style.display = 'none';
        }
    }

    const resetGame = () => {
        isPlaying.value = true;
        isOver.value = false;
        comment.value = 'Touch to play!';
        for(let key in cells) cells[key] = '';
        // perform start animation
        if(process.client){
            let playSpace = document.querySelector('.playSpace') as HTMLElement;
            let inputFieldElements = document.querySelectorAll<HTMLElement>('.input-field')
            inputFieldElements.forEach(field => field.removeAttribute('disabled'));
            playSpace.style.display = 'inline-block';
        }
        store.$reset();
    }

    const updateCell = (id: string, value: string) => {
        (cells)[id] = value;
        store.getFlag === 1 ? comment.value = "Player X Turn": comment.value = "Player O Turn";
        checkPlayerWin(value);
    }

    const checkPlayerWin = (x: string) => {
        if (
            ( cells.c1 == x && cells.c2 == x && cells.c3 == x) ||
            ( cells.c4 == x && cells.c5 == x && cells.c6 == x) ||
            ( cells.c7 == x && cells.c8 == x && cells.c9 == x) ||
            ( cells.c1 == x && cells.c4 == x && cells.c7 == x) ||
            ( cells.c2 == x && cells.c5 == x && cells.c8 == x) ||
            ( cells.c3 == x && cells.c6 == x && cells.c9 == x) ||
            ( cells.c1 == x && cells.c5 == x && cells.c9 == x) ||
            ( cells.c3 == x && cells.c5 == x && cells.c7 == x)
        ) {
            comment.value = `Player ${x} won`;
            endGame();
        }else{
            checkForDraw()
        }
    }
    
    const checkForDraw = () => {
        if (Object.entries(cells).every(x => x[1] !== '')) {
            comment.value = `match draw`;
            endGame()
        }
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
            }
        }
    }
</style>