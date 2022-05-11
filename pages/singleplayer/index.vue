<template>
    <div class="grid">
        <div class="grid__container">
            <div class="content-wrapper">
                <h1 class="sub-heading">make the first move!</h1>
                <Grid />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import Grid from '@/components/Grid'

</script>

<style lang="scss" scoped>
    .content-wrapper{
        width: 100%;
        text-align: center;
        justify-content: center;
    }
</style>
