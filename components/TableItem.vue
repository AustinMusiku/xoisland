<template>
	<div class="table__item">
		<div class="item-name">
			{{ player.name }}
		</div>
		<div class="item-stats">
			<div class="item-stat win">{{ player.win }}</div>
			<div class="item-stat draw">{{ player.draw }}</div>
			<div class="item-stat loss">{{ player.loss }}</div>
			<div class="item-stat points">{{ player.points }}</div>
		</div>
	</div>
</template>

<script setup lang="ts">
defineProps<{
	player: {
		name: number
		win: number
		draw: number
		loss: number
		points: number
	}
}>()
</script>

<style lang="scss">
.table__item {
	padding: 1em 0;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	border-bottom: 1px solid black;

	&.table__head {
		padding: 0;
		border: none;
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
}
</style>
