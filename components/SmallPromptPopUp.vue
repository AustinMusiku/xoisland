<template>
	<div class="pop-up pop-up--prompt">
		<div class="content-wrapper --horizontal">
			<div class="pop-up__message">
				<p>
					{{ message }}
				</p>
			</div>

			<div class="prompt__controls">
				<div class="control">
					<button
						class="button decline"
						@click="handlePrompt(false)"
					>
						<SvgIcon name="close" />
					</button>
				</div>

				<div class="control">
					<button
						class="button accept"
						@click="handlePrompt(true)"
					>
						<SvgIcon name="check" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { onMounted } from '@nuxtjs/composition-api'

defineProps<{
	message: string
}>()
const emits = defineEmits<{
	(el: 'close'): void
	(el: 'accept', value: boolean): void
}>()

const handlePrompt = (value: boolean) => {
	emits('accept', value)
}
onMounted(() => {
	const prompt = document.querySelector('.pop-up--message')
	gsap.from(prompt, {
		duration: 0.35,
		opacity: 0,
		scale: 0.75,
		y: '-25%',
	})

	setTimeout(() => {
		gsap.timeline({
			onComplete: () => {
				emits('close')
			},
		}).to(prompt, {
			duration: 0.35,
			opacity: 0,
			scale: 0.75,
			y: '-25%',
		})
	}, 2500)
})
</script>

<style lang="scss">
.content-wrapper.--horizontal {
	grid-template-columns: 2fr 1fr;
}

.pop-up {
	position: absolute;
	display: grid;
	padding: 0.45em !important;
	place-items: center;
	top: 5%;
	left: 50%;
	transform: translateX(-50%);
	width: 85%;
	background-color: $clr-light;
	border-radius: 9px;
	z-index: 1000000;

	.pop-up__message {
		margin-left: 0.45em;
		color: $clr-light;
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

				&.accept {
					background-color: $clr-accent;

					.svg-container {
						transform: scale(0.8);
					}
				}
			}
		}
	}
}

// desktop and tablet
@media (min-width: 62rem) {
	.pop-up {
		width: fit-content;
		// padding: 0.75em 1em !important;
	}
}

.pop-up--message {
	&.none {
		display: none;
	}
}
</style>
