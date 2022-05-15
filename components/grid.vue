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
                <!-- <div class="input-field" id="b1" @click="fillField('b1')"> </div> -->
                <Cell cell-id="c1" :modelValue="cells.c1" @update:modelValue="updateCell"/>
                <Cell cell-id="c2" :modelValue="cells.c2" @update:modelValue="updateCell"/>
                <Cell cell-id="c3" :modelValue="cells.c3" @update:modelValue="updateCell"/>
                <Cell cell-id="c4" :modelValue="cells.c4" @update:modelValue="updateCell"/>
                <Cell cell-id="c5" :modelValue="cells.c5" @update:modelValue="updateCell"/>
                <Cell cell-id="c6" :modelValue="cells.c6" @update:modelValue="updateCell"/>
                <Cell cell-id="c7" :modelValue="cells.c7" @update:modelValue="updateCell"/>
                <Cell cell-id="c8" :modelValue="cells.c8" @update:modelValue="updateCell"/>
                <Cell cell-id="c9" :modelValue="cells.c9" @update:modelValue="updateCell"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref, computed, watch, toRefs } from '@nuxtjs/composition-api'
    import Cell from '@/components/Cell.vue'
    import { flag } from '~/store'


    interface Cells { c1: string, c2: string, c3: string, c4: string, c5: string, c6: string, c7: string, c8: string, c9: string}
    let cells: Cells = reactive({ c1: '', c2: '', c3: '', c4: '', c5: '', c6: '', c7: '', c8: '', c9: '' })

    let comment = ref<string>('');
    let isPlaying = ref<boolean>(false);

    const startGame = () => !isPlaying.value? isPlaying.value =! isPlaying.value: '';

    const endGame = () => {
        comment.value = 'Game Over';
        setTimeout(() => resetGame(), 500)
    }

    const resetGame = () => {
        isPlaying.value =! isPlaying.value;
        for(let key in cells) cells[key] = '';
        flag.value = 1;
    }

    const updateCell = (id: string, value: string) => {
        cells[id] = value;
        flag.value === 1 ? comment.value = "Player X Turn": comment.value = "Player O Turn";;
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
            if(process.client){
                document
                    .querySelectorAll('.input-field')
                    .forEach(field => field.setAttribute('disabled', 'disabled'));
                
                setTimeout(() => endGame(), 500)

            }
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