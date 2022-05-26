<template>
    <div class="loading">
        <h1 class="loading__text heading">{{ comment }}</h1>
        <div class="loading__grid">
            <div class="bar horizontal horizontal-1"></div>
            <div class="bar horizontal horizontal-2"></div>
            <div class="bar vertical vertical-1"></div>
            <div class="bar vertical vertical-2"></div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { reactive, ref, computed } from '@nuxtjs/composition-api'

    let props = defineProps<{
        comment: string,
    }>()
    
</script>

<style lang="scss" scoped>
    .loading{
        display: flex;
        flex-direction: column;
        gap: 2em;
        align-items: center;

        .loading__grid{
            position: relative;
            width: 90px;
            height: 90px;

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
        }
    }
</style>