<template>
	<div class="grid prompt-container">
		<div class="grid__container prompt">
			<div class="content-wrapper">
				<div class="prompt__message">
					<p class="head">{{ promptMsg.head }}</p>
					<p class="body">{{ promptMsg.body }}</p>
				</div>
				<div class="prompt__controls">
					<div class="control">
						<button
							class="button decline"
							@click="handlePrompt(false)"
						>
							<SvgIcon name="close" />
							<p>Decline</p>
						</button>
					</div>

					<div class="control">
						<button
							class="button accept"
							@click="handlePrompt(true)"
						>
							<SvgIcon name="check" />
							<p>Accept</p>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { onMounted } from '@nuxtjs/composition-api'

defineProps<{
	promptMsg: {
		head: string
		body: string
	}
}>()

const emits = defineEmits<{
	(el: 'accept', value: boolean): void
}>()

const handlePrompt = (value: boolean) => {
	emits('accept', value)
}
onMounted(() => {
	const prompt = document.querySelector('.prompt')
	gsap.from(prompt, {
		duration: 0.35,
		opacity: 0,
		scale: 0.75,
		// y: '25%',
	})
})
</script>

<style lang="scss" scoped>
$clr-dark: #0d0d0d;
$clr-light: #fff;
$clr-grey: #4f4f4f;
$clr-accent: rgba(0, 220, 130, 1);
$clr-accent2: rgba(0, 58, 67, 1);

.prompt-container {
	position: fixed;
	display: grid;
	place-items: center;
	width: 100vw;
	height: 100vh;
	left: 0;
	top: 0;
	background-color: rgba(0, 0, 0, 0);
	z-index: 50;
	.prompt {
		position: relative;
		display: grid;
		width: 100%;
		height: fit-content;
		padding: 1em;
		background-color: $clr-light;
		border-radius: 9px;
		max-width: 350px;
		text-align: center;
		z-index: 100;

		.prompt__message {
			display: flex;
			flex-direction: column;
			max-width: 90%;
			margin: auto;
			gap: 0.5em;

			.head {
				font-size: 1.4rem;
				color: $clr-dark;
			}
			.body {
				color: $clr-grey;
			}
		}
		.prompt__controls {
			display: grid;
			grid-template-columns: 1fr 1fr;
			gap: 0.25em;
			place-items: center;
			.control {
				width: 100%;
				.button {
					display: flex;
					align-items: center;
					justify-content: center;
					gap: 0.25em;
					box-sizing: border-box;
					padding: 0.25em 0;
					width: 100%;
					border-radius: 5px;
					text-decoration: none;

					p {
						color: $clr-dark;
					}

					&.accept {
						background-color: $clr-accent;

						.svg-container {
							margin-left: -0.5em;
						}
					}
				}
			}
		}
	}
}
</style>
