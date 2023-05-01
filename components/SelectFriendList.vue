<template>
	<div class="content-wrapper">
		<div class="prompt__body">
			<div class="prompt__header">
				<button
					class="button"
					@click="handleClose"
				>
					<p>close</p>
				</button>
			</div>
			<div class="prompt__input">
				<!-- add eager modifier -->
				<input
					:value="listInput"
					type="text"
					class="input"
					placeholder="Type name to filter..."
					@input="handleInput"
				/>
			</div>
			<!-- fixed height scrollable list of clickable names -->
			<div
				v-if="fetchState.pending || friends.length === 0"
				class="prompt__list prompt__list--loading"
			>
				<p>
					{{
						friends.length === 0
							? 'you have no friends'
							: 'loading...'
					}}
				</p>
			</div>
			<div class="prompt__list">
				<div
					v-for="friend in filteredFriends"
					:key="friend.token"
					class="list__item"
				>
					<button
						class="button"
						@click="handlePrompt(friend.name, friend.token)"
					>
						<p>{{ friend.name }}</p>
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import gsap from 'gsap'
import { onMounted, ref, watch, useFetch } from '@nuxtjs/composition-api'
import { useGetFriends } from '@/composables/database'
import { useAuthenticationStore } from '@/store/authentication'

// Each friend has an id and name
interface Player {
	name: string
	token: string
}

const emits = defineEmits<{
	(el: 'invite', value: string, token: string): void
	(el: 'close'): void
}>()

const authStore = useAuthenticationStore()

// input binding
const listInput = ref('')

const friends = ref<Player[]>([])

const { fetchState } = useFetch(async () => {
	friends.value = await useGetFriends(authStore.user.displayName)
})

const sortFriends = (friendsArr: Player[]) => {
	return friendsArr.sort((a, b) => (a.name < b.name ? -1 : 1))
}

// reactive filtered friends
const filteredFriends = ref<Player[]>([])

// watch for changes in fetchState
watch(fetchState, (state) => {
	if (!state.pending && !state.error) {
		filteredFriends.value = sortFriends(friends.value)
	}
})

// watch for changes in listInput
watch(listInput, (value) => {
	if (!value) {
		filteredFriends.value = sortFriends(friends.value)
	} else {
		filteredFriends.value = sortFriends(
			friends.value.filter((friend) =>
				friend.name.toLowerCase().includes(value.toLowerCase())
			)
		)
	}
})

// handle input
const handleInput = (e: Event) => {
	const target = e.target as HTMLInputElement
	listInput.value = target.value
}

// emit invite event with the selected friend name
const handlePrompt = (name: string, token: string) => {
	emits('invite', name, token)
	emits('close')
}

// emit close event
const handleClose = () => {
	emits('close')
}

onMounted(() => {
	const prompt = document.querySelector('.prompt')
	gsap.from(prompt, {
		duration: 0.35,
		opacity: 0,
		scale: 0.75,
	})
})
</script>

<style lang="scss" scoped>
$clr-dark: #0d0d0d;
$clr-light: #fff;
$clr-grey: #4f4f4f;
$clr-accent: rgba(0, 220, 130, 1);
$clr-accent2: rgba(0, 58, 67, 1);

.content-wrapper {
	top: 0;
	left: 0;
	transform: translate(0, 0);

	.prompt__header {
		width: 100%;
		display: flex;
		justify-content: flex-end;

		.button {
			padding: 0 0.125em;

			p {
				line-height: 1;
			}
		}
	}

	.prompt__body {
		display: flex;
		flex-direction: column;
		gap: 0.5em;
		.prompt__input {
			display: flex;
			flex-direction: column;
			gap: 0.25em;
			margin: 0.25em 0;
			text-align: left;
			.input {
				width: 100%;
				padding: 0.125em 0.5em;
				border-radius: 5px;
				border: 1px solid #8d8d8d;
				outline: none;
				color: $clr-dark;
			}
		}

		.prompt__list {
			height: fit-content;
			max-height: 200px;
			overflow-y: auto;

			// scrollbar
			&::-webkit-scrollbar {
				width: 0.4em;
			}
			&::-webkit-scrollbar-track {
				background-color: $clr-accent;
				border-radius: 10px;
			}
			&::-webkit-scrollbar-thumb {
				background-color: $clr-grey;
				border-radius: 10px;
			}

			.list__item {
				display: flex;
				align-items: center;
				border-top: 1px solid #d4d4d4;
				width: 100%;

				&.--item-center {
					padding: 1em 0 0;
					justify-content: center;
					border-top: none;
				}
				.button {
					padding: 0.25em 0.5em;
					width: 100%;
					height: 100%;
					text-align: left;
					border-radius: 0;
					transition: all 0.25s ease-in-out;
					cursor: pointer;
					text-decoration: none;

					&:hover,
					&:focus {
						background-color: $clr-accent;
						color: $clr-light;
					}
				}
			}
		}
	}
}
</style>
