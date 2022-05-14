<template>
    <div class="grid">
        <div class="grid__container">
            <div class="content-wrapper">
                <h1 class="sub-heading" v-if="!isPlaying">make the first move!</h1>
                <h1 class="sub-heading" v-else="!isPlaying">{{ comment }}</h1>
                <Grid @endGame="endGame"/>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from '@nuxtjs/composition-api'

let comment = ref<string>();
let isPlaying = ref<boolean>(false)

function endGame(commentValue: string){
    isPlaying.value =! isPlaying.value;
    comment.value = commentValue;
}

</script>

<style lang="scss" scoped>
    .content-wrapper{
        width: 100%;
        text-align: center;
        justify-content: center;
    }
</style>
