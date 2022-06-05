<template>
	<div class="table">
		<div class="table__item table__item--head">
			<div class="item-name">Name</div>
			<div class="item-stats">
				<div class="item-stat win">Win</div>
				<div class="item-stat draw">Draw</div>
				<div class="item-stat loss">Loss</div>
				<div class="item-stat points">Pts</div>
			</div>
		</div>
		<TableItem
			v-for="player in state.players"
			:key="player.points"
			:player="player"
		></TableItem>
	</div>
</template>

<script setup lang="ts">
import { reactive } from '@nuxtjs/composition-api'
import { getDatabase, ref, get, orderByChild, query } from 'firebase/database'
interface Player {
	name: string
	win: number
	draw: number
	loss: number
	points: number
}
const state: { players: Player[] } = reactive({ players: [] })

const playersQuery = query(
	ref(getDatabase(), 'players'),
	orderByChild('points')
)
// populate table
get(playersQuery).then((snapshot) => {
	snapshot.forEach((child) => {
		state.players.unshift({ name: child.key, ...child.val() })
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
