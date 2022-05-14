<template>
    <input class="input-field" @click="fillField" v-model="modelValue">
</template>

<script setup lang="ts">
    import { reactive, ref, computed, watch, toRefs } from '@nuxtjs/composition-api'
    import { flag } from '~/store'

    interface Props {
        cellId: string,
        modelValue: string
    }

    const props = defineProps<Props>()

    const emit = defineEmits<{
        (e: 'update:modelValue', id: string, value: string): void
        (e: 'updateComment', comment: string): void
    }>()
    
    let cell = ref<string>('');
    let comment = ref<string>('')

    // Function called whenever user tab on any box and fills with X or 0
    let fillField = () => {
        // toggle isPlaying if false
        
        // disable selected field
        if(cell.value !== '') return;

        if (flag.value === 1) {
            cell.value = 'X'
            flag.increment();
            comment.value = "Player O Turn";
            emit('update:modelValue', props.cellId, 'X');
        }else {
            cell.value = 'O'
            flag.decrement();
            comment.value = "Player X Turn";
            emit('update:modelValue', props.cellId, 'O');
        }
    }

</script>

<style lang="scss" scoped>
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
</style>