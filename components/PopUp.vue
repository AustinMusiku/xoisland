<template>
	<div class="pop-up pop-up--message">
		<div class="content-wrapper">
			<div class="pop-up__message">
				<p>
					{{ message }}
				</p>
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
	setTimeout(() => emits('close'), 2500)
})
</script>

<style lang="scss">
.pop-up {
	position: absolute;
	display: grid;
	padding: 0.75em 2em !important;
	place-items: center;
	top: 5%;
	left: 50%;
	transform: translateX(-50%);
	width: 85%;
	background-color: #003a4330;
	border-radius: 9px;

	.pop-up__message {
		color: $clr-light;
	}
}

// desktop and tablet
@media (min-width: 62rem) {
	.pop-up {
		width: fit-content;
		padding: 0.75em 6em !important;
	}
}

.pop-up--message {
	&.none {
		display: none;
	}
}
</style>
