<template>
    <div class="pop-up pop-up--message">
        <div class="content-wrapper">
            <div class="pop-up__message">
                {{ message }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from '@nuxtjs/composition-api';


defineProps<{
    message: string
}>()

onMounted(() => {
    setTimeout(() => {
        document.querySelector('.pop-up--message')?.classList.add('none');
    }, 3000)
})

</script>

<style lang="scss">
    .pop-up--message{
        &.none{
            display: none;
        }
    }
</style>