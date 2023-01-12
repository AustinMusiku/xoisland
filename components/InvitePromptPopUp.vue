<template>
	<div class="grid prompt-container">
		<div class="grid__container prompt">
			<div class="content-wrapper">
				<!-- enter player name or click invite friend -->
				<div class="prompt__body">
					<div class="prompt__name">
						<p>Enter player's name</p>
						<input
							v-model="inputPlayer"
							type="text"
							class="input"
							placeholder="e.g. Austin Musiku"
						/>
						<p class="error caption">{{ inputError }}</p>
					</div>
					<p class="separator">or</p>
					<div class="prompt__invite">
						<button
							class="button"
							@click="handlePrompt(selectedPlayer)"
						>
							<!-- <SvgIcon name="user-plus" /> -->
							<p class="head">Choose from friends</p>
						</button>
					</div>

					<div class="prompt__controls">
						<div class="control">
							<button
								class="button accept"
								@click="handlePrompt(true)"
							>
								<SvgIcon name="check" />
								<p>Invite</p>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { onMounted, ref } from '@nuxtjs/composition-api'

const emits = defineEmits<{
	(el: 'invite', value: string): void
}>()

const handlePrompt = (value: string) => {
	if (!selectedPlayer.value) {
		return
	}
	emits('invite', value)
}

const inputPlayer = ref<string>('')
const inputError = ref<string>('no such player exists')
const selectedPlayer = ref<string>('')

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
		z-index: 100;

		.prompt__body {
			display: flex;
			flex-direction: column;

			.prompt__name {
				display: flex;
				flex-direction: column;
				gap: 0.25em;
				margin: 0.25em 0;
				text-align: left;

				.head {
					font-size: 1.4rem;
					color: $clr-dark;
				}
				.input {
					width: 100%;
					padding: 0.125em 0.5em;
					border-radius: 5px;
					border: 1px solid $clr-grey;
					outline: none;
					font-size: 1.2rem;
					color: $clr-dark;
				}
				.error {
					color: red;
				}
			}

			.separator {
				position: relative;
				padding: 0.25em 0 0 1.25em;
				color: $clr-dark;
				text-align: left;

				&::before,
				&::after {
					content: '';
					position: absolute;
					top: 57.5%;
					height: 1px;
					background-color: $clr-grey;
				}

				&::before {
					content: '';
					width: 5%;
					left: 0%;
				}

				&::after {
					left: 15%;
					width: 85%;
				}
			}

			.prompt__invite {
				display: flex;
				justify-content: center;
				gap: 0.5em;
				margin: 0 0 1em;

				.button {
					padding: 0;
					gap: 0.25em;
					width: 100%;
					border-radius: 5px;
					box-sizing: border-box;
					text-align: left;
				}
			}
		}

		.prompt__controls {
			display: flex;
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
							display: none;
							margin-left: -0.5em;
						}
					}
				}
			}
		}
	}
}
</style>
