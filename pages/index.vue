<template>
	<div class="grid">
		<div class="grid__container">
			<invitePromptPopUp
				v-if="showInvitePrompt"
				@invite="handleInvite"
				@close="showInvitePrompt = false"
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
							@click="showInvitePrompt = true"
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
						<a
							href="https://github.com/AustinMusiku/xoisland"
							target="_blank"
							class="item__content heading2"
						>github
						</a>
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

const showInvitePrompt = ref(false)

const promptMsg = reactive({
	head: 'Sign in with google',
	body: 'You will be able to save your achievements in the leaderboard.',
})

const handleInvite = async ({ name, token }: Player) => {
	const inviteHandlerUrl = 'https://fcm-push.fly.dev/notify'
	const gameID = generateUUID()
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
			name,
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
