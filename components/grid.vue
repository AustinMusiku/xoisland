<template>
    <div class="playSpace">
        <div class="bar horizontal horizontal-1"></div>
        <div class="bar horizontal horizontal-2"></div>
        <div class="bar vertical vertical-1"></div>
        <div class="bar vertical vertical-2"></div>

        <div class="playGrid">
            <!-- <div class="input-field" id="b1" @click="fillField('b1')"> </div>
            <div class="input-field" id="b2" @click="fillField('b2')"> </div>
            <div class="input-field" id="b3" @click="fillField('b3')"> </div>
            <div class="input-field" id="b4" @click="fillField('b4')"> </div>
            <div class="input-field" id="b5" @click="fillField('b5')"> </div>
            <div class="input-field" id="b6" @click="fillField('b6')"> </div>
            <div class="input-field" id="b7" @click="fillField('b7')"> </div>
            <div class="input-field" id="b8" @click="fillField('b8')"> </div>
            <div class="input-field" id="b9" @click="fillField('b9')"> </div> -->
            <Cell id="b1" @click="fillField('b1')"> </Cell>
            <Cell id="b2" @click="fillField('b2')"> </Cell>
            <Cell id="b3" @click="fillField('b3')"> </Cell>
            <Cell id="b4" @click="fillField('b4')"> </Cell>
            <Cell id="b5" @click="fillField('b5')"> </Cell>
            <Cell id="b6" @click="fillField('b6')"> </Cell>
            <Cell id="b7" @click="fillField('b7')"> </Cell>
            <Cell id="b8" @click="fillField('b8')"> </Cell>
            <Cell id="b9" @click="fillField('b9')"> </Cell>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref, computed, watch, toRefs } from '@nuxtjs/composition-api'
    import Cell from '~/components/Cell.vue'


    let flag = ref<number>(1);
    let comment = ref<string>('Player X Turn');

    const inputFields = document.querySelectorAll('.input-field');

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
            
            .input-field {
                width: 100%;
                height: 100%;
                border: none;
                outline: none;
                font-size: 70px;
                text-align: center;
                color: black;
                background-color: transparent;
            }
            .input-field.winner{
                
            }
        }
    }
</style>