<template>
	<div class="grid grid--small">
		<div class="grid__container">
			<h1 class="heading">leaderboard</h1>
			<RankingsTable
				v-if="players"
				:players="players"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useAsync } from '@nuxtjs/composition-api'
import { getDatabase, ref, onValue } from 'firebase/database'

const players = useAsync(() => {
	const players: any[] = []
	const playersRef = ref(getDatabase(), `players/`)
	onValue(playersRef, (snapshot) => {
		snapshot.forEach((child) => {
			players.push({ name: child.key, ...child.val() })
		})
	})
	return players
})
</script>

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
