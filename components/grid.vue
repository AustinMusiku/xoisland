<template>
    <div class="playGround">
        <h1 class="sub-heading" v-if="!isPlaying">make the first move!</h1>
        <h1 class="sub-heading" v-else="!isPlaying">{{ comment }}</h1>
        
        <div class="playSpace">
            <div class="bar horizontal horizontal-1"></div>
            <div class="bar horizontal horizontal-2"></div>
            <div class="bar vertical vertical-1"></div>
            <div class="bar vertical vertical-2"></div>

            <div class="playGrid" @click="startGame">
                <Cell 
                    v-for="(cell, key) in cells" :key="key" 
                    :cell-id="key" :modelValue="cells[key]" 
                    @update:modelValue="updateCell"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref, computed, watch, toRefs } from '@nuxtjs/composition-api'
    import Cell from '@/components/Cell.vue'
    import { flag } from '~/store'


    interface Cells { c1: string, c2: string, c3: string, c4: string, c5: string, c6: string, c7: string, c8: string, c9: string}
    let cells: Cells = reactive({ c1: 'X', c2: 'O', c3: '', c4: '', c5: '', c6: '', c7: '', c8: '', c9: '' })

    let comment = ref<string>('');
    let isPlaying = ref<boolean>(false);

    const startGame = () => {
        if(!isPlaying.value) {
            console.log('started game')
            isPlaying.value =! isPlaying.value;
        }
    }

    const endGame = () => {
        if(process.client){
            document
                .querySelectorAll('.input-field')
                .forEach(field => field.setAttribute('disabled', 'disabled'));
        }

        // setTimeout(() => resetGame(), 500)
    }

    const resetGame = () => {
        isPlaying.value = false;
        for(let key in cells) cells[key] = '';
        flag.reset();
        // if(process.client) window.location.reload();
    }

    const updateCell = (id: string, value: string) => {
        cells[id] = value;
        flag.value === 1 ? comment.value = "Player X Turn": comment.value = "Player O Turn";
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
        let cellsArray = [];
        for(let key in cells){ cellsArray.push(cells[key]) }

        if (cellsArray.every(x => x !== '')) {
            comment.value = `match draw`;
            endGame()
        }
    }
    
</script>

<style lang="scss" scoped>
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
</style>