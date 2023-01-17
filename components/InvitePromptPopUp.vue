<template>
	<div class="grid prompt-container">
		<div class="grid__container prompt">
			<div class="content-wrapper">
				<div
					v-if="!showChooseFriend"
					class="prompt__header"
				>
					<button
						class="button"
						@click="handleClose"
					>
						<p>close</p>
					</button>
				</div>
				<!-- enter player name or click invite friend -->
				<div class="prompt__body">
					<div
						v-if="!showChooseFriend"
						class="prompt__name"
					>
						<p>Enter player's name</p>
						<div class="input-container">
							<input
								:value="inputPlayer"
								type="text"
								class="input"
								placeholder="e.g. Austin Musiku"
								@input="handleInput"
							/>
							<div
								v-if="isCheckLoading"
								class="check-loading"
							></div>
							<SvgIcon
								v-if="inputPlayer && !isCheckLoading"
								:class="inputError ? 'error' : 'success'"
								:name="inputError ? 'close' : 'check'"
							></SvgIcon>
						</div>
						<!-- <p class="error caption">{{ inputError }}</p> -->
					</div>
					<p
						v-if="!showChooseFriend"
						class="separator"
					>or</p>
					<div class="prompt__invite">
						<button class="button">
							<p
								v-if="!showChooseFriend"
								class="head"
								@click="showChooseFriend = !showChooseFriend"
							>
								Choose from friends
							</p>
						</button>
						<div class="prompt__list-container">
							<SelectFriendList
								v-if="showChooseFriend"
								@close="showChooseFriend = !showChooseFriend"
								@invite="handleChooseFriend"
							/>
						</div>
					</div>

					<div
						v-if="!showChooseFriend"
						class="prompt__controls"
					>
						<div class="control">
							<button
								class="button accept"
								@click="handlePrompt"
							>
								<SvgIcon name="check" />
								<p>Invite {{ selectedPlayer.name }}</p>
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
import { onMounted, reactive, ref, watch } from '@nuxtjs/composition-api'
import { useCheckUserExists, useGetToken } from '~/composables/database'

interface Player {
	name: string
	token: string
}

const emits = defineEmits<{
	(el: 'invite', player: Player): void
	(el: 'close'): void
}>()

const inputError = ref<string>('')
const inputPlayer = ref<string>('')
const selectedPlayer = reactive<Player>({
	name: '',
	token: '',
})
const showChooseFriend = ref<boolean>(false)
const isCheckLoading = ref<boolean>(false)

// validate player name
const checkPlayer = async (value: string) => {
	isCheckLoading.value = true
	const valid = ref<boolean>(true)
	if (!value) return
	// check if player exists in db
	const userExists = await useCheckUserExists(value)
	if (!userExists) {
		valid.value = false
		inputError.value = 'Player does not exist'
	} else {
		inputError.value = ''
		valid.value = true
	}
	return valid.value
}

const handleInput = (e: any) => {
	inputPlayer.value = e.target.value
}

const handleChooseFriend = (name: string, token: string) => {
	selectedPlayer.name = name
	selectedPlayer.token = token
	inputPlayer.value = name
}

const handlePrompt = () => {
	if (selectedPlayer.name === '') {
		inputError.value = 'Please enter a name or choose below'
		return
	}
	emits('invite', selectedPlayer)
}

const handleClose = () => {
	emits('close')
}

watch(inputPlayer, async (value) => {
	selectedPlayer.name = ''
	selectedPlayer.token = ''
	const isValidPlayer = await checkPlayer(value)
	isCheckLoading.value = false
	if (isValidPlayer) {
		selectedPlayer.name = value
		selectedPlayer.token = await useGetToken(value)
	}
})

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

<style lang="scss">
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
		height: fit-content !important;
		padding: 1em;
		background-color: $clr-light;
		border-radius: 9px;
		max-width: 350px;
		z-index: 100;

		.content-wrapper {
			gap: 0;

			.prompt__header {
				width: 100%;
				display: flex;
				justify-content: flex-end;

				.button {
					padding: 0 0.125em;
					p {
						line-height: 1;
					}
				}
			}

			.prompt__body {
				display: flex;
				flex-direction: column;

				.prompt__name {
					display: flex;
					flex-direction: column;
					gap: 0.25em;
					margin: 0 0 0.25em;
					text-align: left;

					.head {
						font-size: 1.4rem;
						color: $clr-dark;
					}
					.input-container {
						position: relative;
						display: flex;
						flex-direction: row;
						.input {
							width: 100%;
							padding: 0.125em 0.5em;
							border-radius: 5px;
							border: 1px solid $clr-grey;
							outline: none;
							font-size: 1.2rem;
							color: $clr-dark;
						}

						.check-loading {
							position: absolute;
							height: 24px;
							width: 24px;
							right: 0.67em;
							top: 50%;
							transform: translateY(-50%);
							border: 4px dotted $clr-accent2;
							border-radius: 50px;
							animation: spin 2s linear infinite;
						}

						@keyframes spin {
							0% {
								transform: translateY(-50%) rotate(0deg);
							}
							100% {
								transform: translateY(-50%) rotate(360deg);
							}
						}

						.svg-container {
							display: grid;
							place-items: center;
							position: absolute;
							right: 0.5em;
							top: 50%;
							padding: 0.12em;
							transform: translateY(-50%) scale(0.7);
							color: $clr-grey;
							border-radius: 50px;

							&.error {
								border: 1px solid red;
								.svg {
									stroke: red;
								}
							}

							&.success {
								border: 1px solid $clr-accent;
								.svg {
									stroke: $clr-accent;
								}
							}
						}
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
					flex-direction: column;
					margin: 0 0 1em;

					.button {
						padding: 0;
						gap: 0.25em;
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
							transition: 0.25s;
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
}
</style>
