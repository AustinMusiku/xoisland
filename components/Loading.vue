<template>
	<div class="loading">
		<h1 class="loading__text heading2">{{ message }}</h1>
		<div class="loading__grid">
			<div class="bar horizontal horizontal-1"></div>
			<div class="bar horizontal horizontal-2"></div>
			<div class="bar vertical vertical-1"></div>
			<div class="bar vertical vertical-2"></div>
		</div>
		<div class="loading__fallback-menu hidden">
			<nuxt-link
				class="button"
				to="/"
			>Back</nuxt-link>

			<button
				class="button"
				@click="joinAgain"
			>Try again</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import { watch, onMounted } from '@nuxtjs/composition-api'
import gsap from 'gsap'

const props = defineProps<{
	message: string
	isLoading: boolean
}>()

const emits = defineEmits<{
	(e: 'joinAgain'): void
}>()

const joinAgain = () => {
	emits('joinAgain')
}

onMounted(() => {
	const bars = gsap.utils.toArray('.bar')
	const animateLoadingGrid = gsap.timeline({
		paused: true,
		repeat: -1,
	})

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

	animateLoadingGrid.play()

	watch(
		() => props.isLoading,
		() => {
			if (!props.isLoading) {
				animateLoadingGrid.pause(1.4)
				document
					.querySelector('.loading__grid')
					?.classList.add('hidden')
				document
					.querySelector('.loading__fallback-menu')
					?.classList.remove('hidden')
			} else if (props.isLoading) {
				animateLoadingGrid.restart()
				document
					.querySelector('.loading__fallback-menu')
					?.classList.add('hidden')
				document
					.querySelector('.loading__grid')
					?.classList.remove('hidden')
			}
		}
	)
})
</script>

<style lang="scss" scoped>
.loading {
	display: flex;
	flex-direction: column;
	gap: 2em;
	align-items: center;

	.loading__grid {
		position: relative;
		width: 90px;
		height: 90px;

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
	}

	.loading__fallback-menu {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	& > .hidden {
		display: none;
	}
}
</style>
