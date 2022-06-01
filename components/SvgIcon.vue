<template>
	<div class="svg-container">
		<svg
			v-if="name === 'check'"
			xmlns="http://www.w3.org/2000/svg"
			height="24"
			width="24"
		>
			<path
				d="M9.55 17.3 4.575 12.35 5.3 11.625 9.55 15.875 18.7 6.725 19.425 7.45Z"
			/>
		</svg>

		<svg
			v-if="name === 'close'"
			xmlns="http://www.w3.org/2000/svg"
			height="24"
			width="24"
		>
			<path
				d="M6.4 18.3 5.7 17.6 11.3 12 5.7 6.4 6.4 5.7 12 11.3 17.6 5.7 18.3 6.4 12.7 12 18.3 17.6 17.6 18.3 12 12.7Z"
			/>
		</svg>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	name: string
}>()
</script>

<style lang="scss" scoped>
.svg-container {
	display: grid;
	place-items: center;

	svg {
		// max-width: 16px;
	}
}
</style>
