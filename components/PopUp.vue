<template>
    <div class="pop-up">
        <div class="content-wrapper">
            <div class="pop-up__message">
                {{ message }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    message: string
}>()


</script>