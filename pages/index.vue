<template>
	<div class="grid">
		<div class="grid__container">
			<PopUp
				v-if="popUpMsg"
				:message="popUpMsg"
				@close="closePopUp"
			/>

			<PromptPopUp
				v-if="
					promptMsg.body &&
						!authStore.isAuth &&
						!userStore.preferences.prefersNoLogin
				"
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
							to="/settings"
						>settings
						</nuxt-link>
					</li>
					<li class="menu__item">
						<a
							href="https://github.com/AustinMusiku/xoisland"
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
import { reactive, ref } from '@nuxtjs/composition-api'
import { useAuthenticationStore } from '~/store/authentication'
import { useUserStore } from '~/store/user'

const authStore = useAuthenticationStore()
const userStore = useUserStore()

const popUpMsg = ref<string>('')

const promptMsg = reactive({
	head: 'Sign in with google?',
	body: 'You will be able to save your achievements in the leaderboard.',
})
const handlePrompt = (value: boolean) => {
	if (value) {
		authStore.login().then(() => {
			const firstName = authStore.user.displayName.split(' ')[0]
			popUpMsg.value = `Hello ${firstName}`
		})
	} else {
		userStore.togglePrefersNoLogin()
	}
	promptMsg.head = promptMsg.body = ''
}
const closePopUp = () => {
	popUpMsg.value = ''
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
