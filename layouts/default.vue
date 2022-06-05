<template>
	<div
		class="layout-wrapper"
		:class="[darkMode ? 'dark-mode' : 'light-mode']"
	>
		<Nuxt />
	</div>
</template>

<script setup lang="ts">
import { ref } from '@nuxtjs/composition-api'
import { useUserStore } from '~/store/user'

const userStore = useUserStore()

const darkMode = ref<boolean>(userStore.preferences.prefersDarkMode)

userStore.$subscribe(() => {
	darkMode.value = userStore.preferences.prefersDarkMode
})
</script>
