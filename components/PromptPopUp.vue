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
						@click="handlePrompt(false)"
					>
						Decline
					</button>
				</div>

				<div class="control">
					<button
						class="button"
						@click="handlePrompt(true)"
					>
						Accept
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	prompt: string
}>()

const emits = defineEmits<{
	(el: 'accept', value: boolean): void
}>()

const handlePrompt = (value: boolean) => emits('accept', value)
</script>

<style lang="scss" scoped>
.prompt__controls {
	display: grid;
	grid-template-columns: 1fr 1fr;
	place-items: center;
}
</style>
