<template>
	<div class="grid">
		<div class="grid__container">
			<PromptPopUp
				v-if="promptMsg && store.isAuth"
				:prompt="prompt"
				@accept="prompt"
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
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { ref } from '@nuxtjs/composition-api'

const isAuth = ref<boolean>(false)
const promptMsg = ref<string>(
	'Sign in with google? You will be able to save your achievements in the leaderboard.'
)
// let user;

const prompt = (value: true) => {
	if (value) {
		const provider = new GoogleAuthProvider()
		const auth = getAuth()
		signInWithPopup(auth, provider).then(() => {
			// const credential = GoogleAuthProvider.credentialFromResult(result);
			// const token = credential.accessToken;
			// The signed-in user info.
			// user = result.user;
			isAuth.value = true
		})
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
