<template>
	<div class="table">
		<div class="table__item table__head">
			<div class="item-name">Name</div>
			<div class="item-stats">
				<div class="item-stat win">Win</div>
				<div class="item-stat draw">Draw</div>
				<div class="item-stat loss">Loss</div>
				<div class="item-stat points">Points</div>
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
defineProps<{
	players: {
		name: number
		win: number
		draw: number
		loss: number
		points: number
	}[]
}>()
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
