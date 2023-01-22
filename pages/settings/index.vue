<template>
	<div class="grid grid--small">
		<div class="grid__container">
			<h1 class="heading">SETTINGS</h1>
			<PopUp
				v-if="popUpMsg"
				:message="popUpMsg"
				@close="closePopUp"
			/>
			<section class="block">
				<h2 class="heading2">Preferences</h2>
				<div class="slab">
					<div class="slab__header">
						<p>Dark mode</p>
						<button
							class="button"
							@click="toggleDarkMode"
						>
							{{
								userStore.preferences.prefersDarkMode
									? 'on'
									: 'off'
							}}
						</button>
					</div>
				</div>

				<div class="slab">
					<div class="slab__header">
						<p>Notifications</p>
						<button
							class="button"
							@click="toggleNotifications"
						>
							{{ isNotificationsEnabled ? 'on' : 'off' }}
						</button>
					</div>
				</div>
			</section>

			<section class="block">
				<h2 class="heading2">Account</h2>
				<div class="slab">
					<div
						v-if="isAuth"
						class="slab__header"
					>
						<p>logged in as {{ authStore.user.displayName }}</p>
						<button
							class="button red"
							@click="handleLogout"
						>
							logout
						</button>
					</div>

					<div
						v-else
						class="slab__header"
					>
						<p>You are not logged in</p>
						<button
							class="button"
							@click="handleLogin"
						>
							login
						</button>
					</div>
				</div>

				<!-- TODO: add delete account -->
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref } from '@nuxtjs/composition-api'
import { useAuthenticationStore } from '~/store/authentication'
import { useUserStore } from '~/store/user'

const authStore = useAuthenticationStore()
const userStore = useUserStore()

const isAuth = ref<boolean>(authStore.isAuth)
const isNotificationsEnabled = ref<boolean>(false)

const popUpMsg = ref<string>('')

const handleLogin = () => {
	authStore.login().then(() => {
		isAuth.value = authStore.isAuth
		const firstName = authStore.user.displayName.split(' ')[0]
		popUpMsg.value = `Hello ${firstName}`
	})
}

const handleLogout = () => {
	authStore.logout().then(() => {
		isAuth.value = authStore.isAuth
		popUpMsg.value = `You have signed out`
	})
}
const toggleDarkMode = () => {
	userStore.toggleDarkMode()
}

const toggleNotifications = () => {
	Notification.requestPermission()
	// getToken if user is logged in
	if (isAuth) {
		userStore.toggleNotification(authStore.user.displayName)
	}
}

const closePopUp = () => {
	popUpMsg.value = ''
}

onMounted(() => {
	if (Notification.permission === 'granted') {
		isNotificationsEnabled.value = true
	}
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
	margin: 1em 0 0;
}
.block {
	width: 100%;
	padding: 1.5em 0;

	&:first-of-type {
		padding-top: 2.5em;
	}

	.slab {
		padding: 2em 0;
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		border-bottom: 1px solid $clr-dark;

		.slab__header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
		}

		.slab__txt {
			max-width: 60ch;
			line-height: 1.2;
		}
	}
}
@media screen and(max-width: 768px) {
	.block {
		padding-top: 2em;
		.slab {
			padding: 1.25em 0;
		}
	}
}
</style>
