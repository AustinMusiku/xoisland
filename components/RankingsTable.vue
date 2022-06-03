<template>
	<div class="table">
		<div class="table__item table__head">
			<div class="item-name">Name</div>
			<div class="item-stats">
				<div class="item-stat win">Win</div>
				<div class="item-stat draw">Draw</div>
				<div class="item-stat loss">Loss</div>
				<div class="item-stat points">Pts</div>
			</div>
		</div>
		<TableItem
			v-for="player in players"
			:key="player.name"
			:player="player"
		></TableItem>
	</div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { onMounted } from '@nuxtjs/composition-api'

defineProps<{
	players: {
		name: string
		win: number
		draw: number
		loss: number
		points: number
	}[]
}>()

onMounted(() => {
	const items = gsap.utils.toArray('.item-line')
	const items2 = gsap.utils.toArray('.table__item')
	gsap.from(items, {
		duration: 0.25,
		scaleX: 0,
		transformOrigin: 'left',
		stagger: 0.25,
	})
	gsap.from(items2, {
		duration: 0.25,
		opacity: 0,
		stagger: 0.125,
	})
})
</script>

<style lang="scss" scoped>
.table {
	display: flex;
	margin: auto;
	flex-direction: column;
	width: 100%;
	max-width: 62em;
}
</style>
