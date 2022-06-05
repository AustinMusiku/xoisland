<template>
	<div class="grid grid--small">
		<div class="grid__container">
			<h1 class="heading">settings</h1>
			<PopUp
				v-if="popUpMsg"
				:message="popUpMsg"
				@close="closePopUp"
			/>
			<section class="block">
				<h2 class="heading2">Preferences</h2>
				<div class="slab">
					<p>Dark mode</p>
					<button
						class="button"
						@click="handleLogin"
					>off</button>
				</div>
				<div class="slab">
					<p>Sound</p>
					<button
						class="button"
						@click="handleLogin"
					>on</button>
				</div>
			</section>
			<section class="block">
				<h2 class="heading2">Account</h2>
				<div
					v-if="isAuth"
					class="slab"
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
					class="slab"
				>
					<p>You are not logged in</p>
					<button
						class="button"
						@click="handleLogin"
					>login</button>
				</div>
			</section>
		</div>
	</div>
</template>

<script setup lang="ts">
import { ref } from '@nuxtjs/composition-api'
import { useAuthenticationStore } from '~/store/authentication'

const authStore = useAuthenticationStore()
const isAuth = ref<boolean>(authStore.isAuth)

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

const closePopUp = () => {
	popUpMsg.value = ''
}
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
.block {
	width: 100%;
	padding-top: 1em;

	&:nth-of-type(1) {
		padding-top: 0;
	}

	.slab {
		padding: 1em 0;
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
		border-bottom: 1px solid $clr-dark;

		// .button {
		// 	padding: .35em 1em;
		// 	border-radius: 2px;
		// 	text-decoration: none;
		// 	background-color: $clr-light;
		// }
	}
}
@media screen and(max-width: 768px) {
	.slab {
		padding: 1em 0;
		display: flex;
		flex-direction: row;
	}
}
</style>
