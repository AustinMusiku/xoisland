<template>
	<div class="grid">
		<div class="grid__container">
			<invitePromptPopUp
				v-if="isInvitePromptOpen"
				@invite="handleInvite"
				@close="toggleInvitePrompt"
			/>

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
						<button
							class="item__content button button--clear button--header"
							@click="toggleInvitePrompt"
						>
							host match
						</button>
					</li>
					<li class="menu__item">
						<nuxt-link
							class="item__content heading2"
							to="/multiplayer?mode=random"
						>random match
						</nuxt-link>
					</li>
					<li class="menu__item">
						<nuxt-link
							class="item__content heading2"
							to="/leaderboard"
						>leaderboard
						</nuxt-link>
					</li>
					<li class="menu__item">
						<nuxt-link
							class="item__content heading2"
							to="/settings"
						>settings
						</nuxt-link>
					</li>
					<li class="menu__item">
						<nuxt-link
							class="item__content heading2"
							to="/help"
						>help
						</nuxt-link>
					</li>
				</ul>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { reactive, ref, useRouter } from '@nuxtjs/composition-api'
import { useAuthenticationStore } from '~/store/authentication'
import { useUserStore } from '~/store/user'
import { generateUUID } from '~/modules/ws/utils'

interface Player {
	name: string
	token: string
}

const authStore = useAuthenticationStore()
const userStore = useUserStore()
const router = useRouter()

const popUpMsg = ref<string>('')

const isInvitePromptOpen = ref(false)

const promptMsg = reactive({
	head: 'Sign in with google',
	body: 'You will be able to save your achievements in the leaderboard.',
})

// toggle invite prompt if user is logged in
const toggleInvitePrompt = () => {
	isInvitePromptOpen.value = !isInvitePromptOpen.value
}

const handleInvite = async ({ name, token }: Player) => {
	// block user from hosting a match if not logged in
	if (!authStore.isAuth) {
		toggleInvitePrompt()
		popUpMsg.value = 'Sign in to host a match'
		return
	}
	// block user from inviting self
	if (name === authStore.getUser.displayName) {
		popUpMsg.value = 'You cannot invite yourself'
		return
	}

	// generate a unique game id
	const gameID = generateUUID()

	// send invite to opponent
	const inviteHandlerUrl = 'https://fcm-push.fly.dev/notify'
	const inviteResponse = await fetch(inviteHandlerUrl, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			title: 'Match Invite',
			body: `You have been challenged to a match by ${authStore.getUser.displayName}`,
			sendToSpecificDeviceToken: token,
			gameID,
			opponent: authStore.getUser.displayName,
		}),
	})
	if (inviteResponse.status === 200) {
		router.push(
			`/multiplayer?mode=hosted&opponent=${name}&gameId=${gameID}`
		)
	} else {
		popUpMsg.value = 'Server error: Could not send invite'
	}
}

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

	.item__content {
		transition: 0.25s;
		width: fit-content;
		display: block;
	}
}

// desktop
@media (min-width: 62rem) {
	.menu__item {
		&:hover {
			.item__content {
				transform: translateX(20px);
			}
		}

		&::before {
			content: '';
			position: absolute;
			width: 5px;
			height: 5px;
			left: 0;
			top: 60%;
			transform: translateY(-50%) scale(0);
			background-color: $clr-dark;
			transition: 0.25s;
		}

		&:hover::before {
			transform: translateY(-50%) scale(1);
		}
	}
}

// mobile
@media (max-width: 62rem) {
	.menu__item {
		width: 100%;

		.item__content {
			width: 100%;
		}
	}
}
</style>
