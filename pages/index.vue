<template>
	<div class="grid">
		<div class="grid__container">
			<PromptPopUp
				v-if="promptMsg.body"
				:prompt-msg="promptMsg"
				@accept="handlePrompt"
			/>

			<div class="content-wrapper --two-sections">
				<h1 class="super-heading">XO</h1>
				<ul class="menu">
					<li class="menu__item">
						<nuxt-link
							class="heading"
							to="/multiplayer"
						>play
						</nuxt-link>
					</li>
					<li class="menu__item">
						<nuxt-link
							class="heading"
							to="/leaderboard"
						>leaderboard
						</nuxt-link>
					</li>
					<li class="menu__item">
						<nuxt-link
							class="heading"
							to="/help"
						>help </nuxt-link>
					</li>
					<li class="menu__item">
						<a
							href="https://github.com/AustinMusiku/tictactoe"
							target="_blank"
							class="heading"
						>github
						</a>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive } from '@nuxtjs/composition-api'

// const promptMsg = ref<string>(
// 	'Sign in with google? You will be able to save your achievements in the leaderboard.'
// )
const promptMsg = reactive({
	head: 'Sign in with google?',
	body: 'You will be able to save your achievements in the leaderboard.',
})

const handlePrompt = (value: boolean) => {
	if (value) {
		promptMsg.head = ''
		promptMsg.body = ''
	} else {
		promptMsg.head = ''
		promptMsg.body = ''
	}
}
</script>

<style lang="scss" scoped>
.menu__item {
	position: relative;
	width: fit-content;
	transition: 0.25s;

	&:hover {
		transform: translateX(10px);
	}
}

// mobile
@media (max-width: 62rem) {
	.menu__item {
		width: 100%;
	}
}
</style>
