<template>
    <input class="input-field" @click="fillField" v-model="cellValue">
</template>

<script setup lang="ts">
    import { useFlagStore } from '@/stores/flag'

    const store = useFlagStore();

    interface Props {
        cellId: string,
        cellValue: string
    }

    const props = defineProps<Props>()

    const emit = defineEmits<{
        (e: 'update:cellValue', id: string, value: string): void
        (e: 'updateComment', comment: string): void
    }>()

    // Function called whenever user tab on any box and fills with X or 0
    let fillField = () => {
        // toggle isPlaying if false
        
        // disable selected field
        if(props.cellValue !== '') return;

        if (store.flag === 1) {
            // store.incrementFlag();
            emit('update:cellValue', props.cellId, 'X');
        }else {
            // store.decrementFlag();
            emit('update:cellValue', props.cellId, 'O');
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