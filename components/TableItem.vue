<template>
	<div class="table__item table__item--data">
		<div class="item-name">
			{{ player.name }}
		</div>
		<div class="item-stats">
			<div class="item-stat win">{{ player.win }}</div>
			<div class="item-stat draw">{{ player.draw }}</div>
			<div class="item-stat loss">{{ player.loss }}</div>
			<div class="item-stat points">{{ player.points }}</div>
		</div>
		<div class="item-line"></div>
	</div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { onMounted } from '@nuxtjs/composition-api'

defineProps<{
	player: {
		name: number
		win: number
		draw: number
		loss: number
		points: number
	}
}>()

onMounted(() => {
	const tabeItemAnimationTl = gsap.timeline()
	tabeItemAnimationTl
		.to('.table__item--data', {
			duration: 0.25,
			opacity: 1,
			stagger: 0.125,
		})
		.to(
			'.item-line',
			{
				duration: 0.25,
				scaleX: 1,
				transformOrigin: 'left',
				stagger: 0.125,
			},
			'-=1.75'
		)
})
</script>

<style lang="scss">
.table__item {
	position: relative;
	padding: 1em 0;
	display: grid;
	grid-template-columns: 1fr 1.5fr;

	&.table__item--head {
		padding: 0;
		border: none;
	}

	&.table__item--data {
		counter-increment: (item-counter);
		opacity: 0;

		&:before {
			content: counter(item-counter);
			position: absolute;
			top: 50%;
			left: 0;
			transform: translateY(-50%);
			color: $clr-dark;
		}

		.item-name {
			padding: 0 0 0 1em;
		}
	}

	.item-stats {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		justify-content: space-between;

		.item-stat {
			width: 100%;
			text-align: right;
		}
	}
	.item-line {
		position: absolute;
		content: '';
		background-color: $clr-dark;
		width: 100%;
		height: 1px;
		left: 0;
		top: 100%;
		transform: scaleX(0);
	}
}
</style>
