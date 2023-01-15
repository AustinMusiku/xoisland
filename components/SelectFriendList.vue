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
			<div class="prompt__list">
				<div
					v-for="friend in filteredFriends"
					:key="friend.id"
					class="list__item"
				>
					<button
						class="button"
						@click="handlePrompt(friend.name)"
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
import { computed, onMounted, ref, watch } from '@nuxtjs/composition-api'
import { onValue, ref as fireRef } from 'firebase/database'
import { db } from '~/plugins/firebase'

// Each friend has an id and name
interface Friend {
	name: string
}

const emits = defineEmits<{
	(el: 'invite', value: string): void
	(el: 'close'): void
}>()

// reactive list of 30 friends.
// const friends = ref<Friend[]>([
// 	{ id: '1', name: 'Austin Musiku' },
// 	{ id: '2', name: 'Rick Grimmes' },
// 	{ id: '3', name: 'Shane Walsh' },
// 	{ id: '4', name: 'Daryl Dixon' },
// 	{ id: '5', name: 'Eugene Porter' },
// 	{ id: '6', name: 'Glenn Rhee' },
// 	{ id: '7', name: 'Maggie Greene' },
// 	{ id: '8', name: 'Merle Dixon' },
// 	{ id: '9', name: 'Carol Peletier' },
// 	{ id: '10', name: 'Abraham Ford' },
// 	{ id: '11', name: 'Tara Chambler' },
// 	{ id: '12', name: 'Tyreese Williams' },
// 	{ id: '13', name: 'Bob Stookey' },
// 	{ id: '14', name: 'Sasha Williams' },
// 	{ id: '15', name: 'Carl Grimmes' }
// ])

// input binding
const listInput = ref('')

// fetch users from db
const friends = ref<Friend[]>([])
const friendsRef = fireRef(db, 'players')

onValue(friendsRef, (snapshot) => {
	const data = snapshot.val()
	const friendsList: Friend[] = []
	for (const key in data) {
		friendsList.push({ name: key })
	}
	friends.value = friendsList
})

// computed friends list
const sortedFriends = computed(() => {
	return friends.value.sort((a, b) => {
		if (a.name < b.name) {
			return -1
		}
		if (a.name > b.name) {
			return 1
		}
		return 0
	})
})

// reactive filtered friends
const filteredFriends = ref<Friend[]>(sortedFriends.value)

// watch for changes in listInput
watch(listInput, (value) => {
	if (!value) {
		filteredFriends.value = friends.value
	} else {
		console.log(value)
		filteredFriends.value = friends.value.filter((friend) =>
			friend.name.toLowerCase().includes(value.toLowerCase())
		)
	}
})

// handle input
const handleInput = (e: Event) => {
	const target = e.target as HTMLInputElement
	listInput.value = target.value
}

// emit invite event with the selected friend name
const handlePrompt = (value: string) => {
	emits('invite', value)
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
				border: 1px solid $clr-grey;
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
				// justify-content: center;
				align-items: center;
				border-top: 1px solid $clr-grey;
				width: 100%;
				.button {
					padding: 0.25em 0.5em;
					width: 100%;
					height: 100%;
					text-align: left;
					// border-radius: 5px;
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
