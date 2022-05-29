<template>
    <div class="pop-up prompt">
        <div class="content-wrapper">
            <div class="prompt__message">
                {{ prompt }}
            </div>
            <div class="prompt__controls">
                <div class="control">
                    <button
                        class="button"
                        @click="handleDecline"
                    >Decline</button>
                </div>
                
                <div class="control">
                    <button
                        class="button"
                        @click="handleAccept"
                    >Accept</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    prompt: string
}>()


let emits = defineEmits<{
    (el: 'accept'): void
    (el: 'decline'): void
}>()

const handleAccept = () => emits('accept')
const handleDecline = () => emits('decline')


</script>

<style lang="scss" scoped>
    .prompt__controls{
        display: grid;
        grid-template-columns: 1fr 1fr;
        place-items: center;
    }
</style>