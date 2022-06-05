<template>
	<div class="grid grid--small">
		<div class="grid__container">
			<h1 class="heading">leaderboard</h1>
			<RankingsTable />
		</div>
	</div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
.grid {
	.grid__container {
		height: fit-content;
		min-height: 100vh !important;
	}
}
.heading {
	margin: 1em 0;
}
</style>
