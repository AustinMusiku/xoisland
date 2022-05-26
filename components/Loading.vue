<template>
    <div class="loading">
        <h1 class="loading__text heading">{{ comment }}</h1>
        <div class="loading__spinner"></div>
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

        .loading__spinner{
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: 10px solid #fff;
            border-left: none;
            border-top: none;
            animation: spin .75s ease-out infinite;
        }

        @keyframes spin {
            to{
                transform: rotate(360deg);
            }
        }
    }
</style>