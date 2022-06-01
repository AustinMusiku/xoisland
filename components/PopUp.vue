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
import { onMounted } from '@nuxtjs/composition-api'

defineProps<{
	message: string
}>()
const emits = defineEmits<{
	(el: 'close'): void
}>()

onMounted(() => {
	setTimeout(() => emits('close'), 2000)
})
</script>

<style lang="scss">
.pop-up {
	position: absolute;
	display: grid;
	padding: 1em;
	place-items: center;
	top: 5%;
	left: 50%;
	transform: translateX(-50%);
	width: fit-content;
}

.pop-up--message {
	&.none {
		display: none;
	}
}
</style>
