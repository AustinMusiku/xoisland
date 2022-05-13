<template>
    <div class="input-field" @click="fillField">{{ cell }}</div>
</template>

<script setup lang="ts">
    import { reactive, ref, computed, watch, toRefs } from '@nuxtjs/composition-api'
    import { flag } from '~/store'

    let cell = ref<string>('');

    // Function called whenever user tab on any box and fills with X or 0
    let fillField = () => {
        if(cell.value === ''){
            if (flag.value === 1) {
                cell.value = 'X'
                flag.increment();
                // checkPlayerWin X
            }
            else {
                cell.value = 'O'
                flag.decrement();
                // comment.value = "Player X Turn";
                // checkPlayerWin O
            }
            console.log(cell.value);
        }
    }

</script>

<style lang="scss" scoped>
    // .input-field {
        // width: 100%;
        // height: 100%;
        // border: none;
        // outline: none;
        // font-size: 70px;
        // text-align: center;
        // color: black;
        // background-color: transparent;
    // }
</style>