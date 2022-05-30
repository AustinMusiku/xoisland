<template>
	<div class="playGround">
		<div class="playComments">
			<h1 class="heading2">{{ comment }}</h1>

			<button
				v-if="isOver"
				class="sub-heading button"
				@click="playAgain"
			>
				Play Again
			</button>
		</div>

		<div
			v-if="!isOver"
			class="playSpace"
		>
			<div class="bar horizontal horizontal-1"></div>
			<div class="bar horizontal horizontal-2"></div>
			<div class="bar vertical vertical-1"></div>
			<div class="bar vertical vertical-2"></div>

			<div class="playGrid">
				<div
					id="c1"
					class="input-field"
					@click="handleClick('c1')"
				>
					{{ cells.c1 }}
				</div>
				<div
					id="c2"
					class="input-field"
					@click="handleClick('c2')"
				>
					{{ cells.c2 }}
				</div>
				<div
					id="c3"
					class="input-field"
					@click="handleClick('c3')"
				>
					{{ cells.c3 }}
				</div>
				<div
					id="c4"
					class="input-field"
					@click="handleClick('c4')"
				>
					{{ cells.c4 }}
				</div>
				<div
					id="c5"
					class="input-field"
					@click="handleClick('c5')"
				>
					{{ cells.c5 }}
				</div>
				<div
					id="c6"
					class="input-field"
					@click="handleClick('c6')"
				>
					{{ cells.c6 }}
				</div>
				<div
					id="c7"
					class="input-field"
					@click="handleClick('c7')"
				>
					{{ cells.c7 }}
				</div>
				<div
					id="c8"
					class="input-field"
					@click="handleClick('c8')"
				>
					{{ cells.c8 }}
				</div>
				<div
					id="c9"
					class="input-field"
					@click="handleClick('c9')"
				>
					{{ cells.c9 }}
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { ref, computed, onMounted } from '@nuxtjs/composition-api'
import { useGameplayStore } from '../stores/gameplay'

const store = useGameplayStore()
let resetGame: any
let endGame: any
const cells = computed(() => store.getCells)
const isOver = ref<boolean>(false)

const props = defineProps<{
	comment: string
	winner: {
		player: string
		cells: string[]
	}
}>()

const emits = defineEmits<{
	(e: 'playAgain'): void
	(e: 'fillField', cellId: string): void
}>()

const handleClick = (cellId: string) => {
	if (store.getCells[cellId] !== '') {
		console.log('store cell not empty')
		return
	}
	if (store.getTurn !== store.getFlag) {
		console.log('not your turn')
		return
	}
	console.log('done!')
	emits('fillField', cellId)
}

const playAgain = () => {
	emits('playAgain')
}

onMounted(() => {
	const inputFieldElements =
		document.querySelectorAll<HTMLElement>('.input-field')
	const playComments = document.querySelector<HTMLElement>('.playComments')
	const bars = gsap.utils.toArray('.bar')
	const animateLoadingGrid = gsap.timeline({
		onReverseComplete: () => {
			isOver.value = true
		},
	})
	const animateWinningCombo = gsap.timeline({ repeat: 2 })

	animateLoadingGrid
		.from(bars.slice(0, 2), {
			duration: 0.5,
			scaleX: 0,
			transformOrigin: 'left center',
			opacity: 0,
			ease: 'power4.out',
			stagger: 0.2,
		})
		.from(bars.slice(2), {
			duration: 0.5,
			scaleY: 0,
			transformOrigin: 'top center',
			opacity: 0,
			ease: 'power4.out',
			stagger: 0.2,
		})

	endGame = () => {
		inputFieldElements.forEach((field) =>
			field.setAttribute('disabled', 'disabled')
		)
		gsap.to(playComments, {
			duration: 0.5,
			opacity: 0,
			ease: 'power4.out',
		})
		// if there is a winner
		if (props.winner.cells !== undefined) {
			const winningCells = props.winner.cells.map((c: string) =>
				document.getElementById(`${c}`)
			)
			// perform winners animation
			animateWinningCombo.to(winningCells, {
				duration: 0.5,
				scale: 1.2,
				transformOrigin: 'center center',
				ease: 'power4.out',
				stagger: 0.2,
			})
		}
		gsap.to(playComments, {
			duration: 0.5,
			opacity: 1,
			ease: 'power4.out',
			delay: 1.6,
		})
		for (const key in store.getCells) store.getCells[key] = ''
		// perform grid outro animation
		animateLoadingGrid.reverse()
	}

	resetGame = () => {
		isOver.value = false
		animateLoadingGrid.play()
		inputFieldElements.forEach((field) => field.removeAttribute('disabled'))
	}

	store.$subscribe(() => {
		if (store.getIsGameOver) endGame()
		if (!store.getIsGameOver) resetGame()
	})
})
</script>

<style lang="scss" scoped>
.playGround {
	display: grid;
	grid-template-columns: 1fr;
	gap: 2rem;
	justify-items: center;

	.playSpace {
		position: relative;
		margin: auto;
		height: 300px;
		width: 300px;

		.bar {
			position: absolute;
			background-color: black;
			z-index: 5;

			&.vertical {
				top: 0;
				height: 100%;
				width: 0.2em;
				transform: translateX(-50%);
			}

			&.horizontal {
				left: 0;
				width: 100%;
				height: 0.2em;
				transform: translateY(-50%);
			}

			&.vertical-1 {
				left: 33.3333%;
			}
			&.vertical-2 {
				left: 66.6666%;
			}

			&.horizontal-1 {
				top: 33.3333%;
			}
			&.horizontal-2 {
				top: 66.6666%;
			}
		}
		.playGrid {
			position: relative;
			display: grid;
			grid-template-columns: repeat(3, 1fr);
			grid-template-rows: repeat(3, 1fr);
			width: 100%;
			height: 100%;

			.input-field {
				display: grid;
				place-items: center;
				width: 100%;
				height: 100%;
				border: none;
				outline: none;
				font-size: 70px;
				color: black;
				background-color: transparent;
				text-align: center;
				caret-color: transparent;
				cursor: pointer;
			}
		}
	}
}
</style>
