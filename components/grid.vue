<template>
    <div class="playSpace">
        <div class="bar horizontal horizontal-1"></div>
        <div class="bar horizontal horizontal-2"></div>
        <div class="bar vertical vertical-1"></div>
        <div class="bar vertical vertical-2"></div>

        <div class="playGrid">
            <!-- <div class="input-field" id="b1" @click="fillField('b1')"> </div> -->
            <Cell id="c1" :modelValue="cells.c1" @update:modelValue="value => cells.c1 = value"/>
            <Cell id="c2" :modelValue="cells.c2" @update:modelValue="value => cells.c2 = value"/>
            <Cell id="c3" :modelValue="cells.c3" @update:modelValue="value => cells.c3 = value"/>
            <Cell id="c4" :modelValue="cells.c4" @update:modelValue="value => cells.c4 = value"/>
            <Cell id="c5" :modelValue="cells.c5" @update:modelValue="value => cells.c5 = value"/>
            <Cell id="c6" :modelValue="cells.c6" @update:modelValue="value => cells.c6 = value"/>
            <Cell id="c7" :modelValue="cells.c7" @update:modelValue="value => cells.c7 = value"/>
            <Cell id="c8" :modelValue="cells.c8" @update:modelValue="value => cells.c8 = value"/>
            <Cell id="c9" :modelValue="cells.c9" @update:modelValue="value => cells.c9 = value"/>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref, computed, watch, toRefs } from '@nuxtjs/composition-api'
    import Cell from '@/components/Cell.vue'


    let flag = ref<number>(1);
    let comment = ref<string>('');
    let cells = reactive({
        c1: '',
        c2: '',
        c3: '',
        c4: '',
        c5: '',
        c6: '',
        c7: '',
        c8: '',
        c9: ''
    })

    // Function called whenever user tab on any box and fills with X or 0
    // function fillField(id: string){
    //     // disable selected field
    //     document.querySelector(`#${id}`).disabled = true;
    //     console.log(flag.value);
    //     if (flag.value === 1) {
    //         document.querySelector(`#${id}`).innerHTML = "X";
    //         flag.value++;
    //         comment.value = "Player 0 Turn";
    //         checkPlayerWin('X');
    //     }
    //     else {
    //         document.querySelector(`#${id}`).innerHTML = "O";
    //         flag.value--;
    //         comment.value = "Player X Turn";
    //         checkPlayerWin('0');
    //     }
    // }

    // function checkPlayerWin(x: string) {
    //     if (
    //         ( inputFields[0].innerHTML == x && inputFields[1].innerHTML == x && inputFields[2].innerHTML == x) ||
    //         ( inputFields[3].innerHTML == x && inputFields[4].innerHTML == x && inputFields[5].innerHTML == x) ||
    //         ( inputFields[6].innerHTML == x && inputFields[7].innerHTML == x && inputFields[8].innerHTML == x) ||
    //         ( inputFields[0].innerHTML == x && inputFields[3].innerHTML == x && inputFields[6].innerHTML == x) ||
    //         ( inputFields[1].innerHTML == x && inputFields[4].innerHTML == x && inputFields[7].innerHTML == x) ||
    //         ( inputFields[2].innerHTML == x && inputFields[5].innerHTML == x && inputFields[8].innerHTML == x) ||
    //         ( inputFields[0].innerHTML == x && inputFields[4].innerHTML == x && inputFields[8].innerHTML == x) ||
    //         ( inputFields[2].innerHTML == x && inputFields[4].innerHTML == x && inputFields[6].innerHTML == x)
    //     ) {
    //         comment.value.innerHTML = `Player ${x} won`;
    //         // disableFields(inputFields);
    //         window.alert(`Player ${x} won`);
    //     }else{
    //         // checkForDraw()
    //     }
    // }
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