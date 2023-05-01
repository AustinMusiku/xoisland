<template>
	<div class="grid">
		<div class="grid__container">
			<SmallPromptPopUp
				v-if="state.smallPromptMsg && OpponentName !== 'Opponent'"
				:message="state.smallPromptMsg"
				@accept="smallPrompt"
			/>

			<PromptPopUp
				v-if="state.promptMsg.body"
				:prompt-msg="state.promptMsg"
				@accept="prompt"
			/>
			<PopUp
				v-if="state.popUp"
				:message="state.popUp"
				@close="closePopUp"
			/>
			<div class="content-wrapper">
				<!-- <div v-if="$nuxt.isOffline">You are offline</div> -->

				<Loading
					v-if="!state.isTwoPlayers"
					:is-loading="state.isLoading"
					:message="state.message"
					@joinAgain="handleJoinAgain"
				/>

				<GridBox
					v-if="gameStore.getIsPlaying"
					:comment="state.comment"
					:winner="state.winner"
					:is-game-over="state.isGameOver"
					@fillField="fillField"
					@playAgain="handlePlayAgain"
					@abortGame="abortGame"
				/>
			</div>
		</div>
	</div>
</template>

<script setup context lang="ts">
import {
	onMounted,
	onUnmounted,
	reactive,
	useContext,
	useRoute,
} from '@nuxtjs/composition-api'
import { useGameplayStore } from '../../store/gameplay'
import { useAuthenticationStore } from '../../store/authentication'
import { useSaveOutcome, useAddFriend } from '@/composables/database'

const { redirect, isDev } = useContext()
const route = useRoute()

const { mode, gameId, opponent } = route.value.query

const OpponentName: string =
	opponent !== undefined ? (opponent as string) : 'Opponent'
const formattedOpponentName = formatName(OpponentName)

const authStore = useAuthenticationStore()
const gameStore = useGameplayStore()
gameStore.$reset()

const state = reactive({
	clientId: '',
	gameId: '',
	message: '',
	comment: '',
	promptMsg: {
		head: '',
		body: '',
	},
	popUp: '',
	isLoading: true,
	canTryAgain: true,
	isTwoPlayers: false,
	smallPromptMsg: `Add ${OpponentName} as a friend?`,
	isGameOver: false,
	winner: {
		player: '',
		cells: [],
	},
})

let ws: WebSocket
const prompt = (value: boolean) => handlePrompt(value)
const smallPrompt = (value: boolean) => handleSmallPrompt(value)

const fillField = (cellId: string) => handleMove(cellId)

// initial websocket connection
if (process.client) {
	state.message = 'Establishing connection...'

	// get client ip host
	const WEBSOCKET_URL = isDev
		? `ws://${window.location.host}`
		: `wss://${window.location.host}`

	ws = new WebSocket(WEBSOCKET_URL)
}

// do not add apostrophe if opponent's name ends with s
function formatName(name: string) {
	return name.endsWith('s') ? `${name}'` : `${name}'s`
}

function closePopUp() {
	state.popUp = ''
}

function abortGame() {
	// reset game data
	gameStore.$reset()

	const payLoad = {
		method: 'abort-game',
		mode,
		gameId: state.gameId,
		clientId: state.clientId,
	}
	// reset game meta data
	state.gameId = state.clientId = ''
	ws.send(JSON.stringify(payLoad))
}

function handleMove(cellId: string): void {
	const payLoad = {
		method: 'play',
		mode,
		clientId: state.clientId,
		gameId: state.gameId,
		cell: cellId,
	}
	ws.send(JSON.stringify(payLoad))
}

function handlePlayAgain() {
	const payLoad = {
		method: 'play-again',
		mode,
		clientId: state.clientId,
		gameId: state.gameId,
	}
	// ask to play game again
	ws.send(JSON.stringify(payLoad))
}

function handleJoinAgain() {
	state.isLoading = true
	state.isTwoPlayers = false

	const payLoad = {
		method: 'join',
		mode,
		clientId: state.clientId,
		gameId: gameId as string | null,
	}
	// create/join game again
	ws.send(JSON.stringify(payLoad))
}

function handlePrompt(value: boolean) {
	state.promptMsg = {
		head: '',
		body: '',
	}
	if (!value) redirect('/')
	const payLoad = {
		method: 'play-again-prompt',
		mode,
		clientId: state.clientId,
		gameId: state.gameId,
		isPlayAgain: value,
	}
	// create/join game again
	ws.send(JSON.stringify(payLoad))
}

function handleSmallPrompt(value: boolean) {
	state.smallPromptMsg = ''

	if (!value) return

	// add to friends list
	useAddFriend(authStore.getUser.displayName, OpponentName)
}

onMounted(() => {
	ws.onmessage = (message: { data: string }) => {
		const data = JSON.parse(message.data)

		switch (data.method) {
			case 'connect': {
				state.clientId = data.clientId
				const payLoad = {
					method: 'join',
					clientId: state.clientId,
					gameId: gameId as string | null,
					mode,
				}

				// create/join game
				ws.send(JSON.stringify(payLoad))
				break
			}
			case 'join': {
				state.isLoading = false
				state.isTwoPlayers = true
				state.gameId = data.gameId
				gameStore.setTurn(data.turn)
				gameStore.setSymbol(data.turn === 1 ? 'X' : 'O')
				gameStore.toggleIsPlaying()

				state.comment =
					data.turn === 1
						? 'Your turn'
						: `${formattedOpponentName} turn`
				break
			}
			case 'join-create': {
				state.message = `Waiting for ${OpponentName} to join...`
				break
			}
			case 'join-wait': {
				state.message = 'Waiting for another player...'
				break
			}
			case 'join-create-timeout': {
				state.isLoading = false
				state.message = data.message
				state.gameId = ''
				break
			}
			case 'join-timeout': {
				state.isLoading = false
				state.message = data.message
				state.gameId = ''
				break
			}
			case 'join-expire': {
				state.isLoading = false
				state.message = data.message
				state.gameId = ''
				state.canTryAgain = false
				break
			}
			case 'play': {
				const cellPlayed = data.move.cell
				const cellSymbol = data.move.symbol

				state.comment =
					gameStore.getFlag === gameStore.turn
						? `${formattedOpponentName} turn`
						: 'Your turn'

				cellSymbol === 'X'
					? gameStore.incrementFlag()
					: gameStore.decrementFlag()

				gameStore.getCells[cellPlayed] = cellSymbol
				break
			}
			case 'end': {
				// save to db
				if (authStore.isAuth) {
					const winningSymbol = data.symbol
					const playerSymbol = gameStore.symbol
					const playerName = authStore.user.displayName
					useSaveOutcome(winningSymbol, playerSymbol, playerName)
				}
				state.winner = {
					player: data.symbol,
					cells: data.cells,
				}
				if (data.symbol === 'D') {
					state.comment = 'Draw!'
				} else {
					state.comment =
						gameStore.symbol === data.symbol
							? 'You won!'
							: 'You lost!'
				}
				state.isGameOver = true
				break
			}
			case 'play-again': {
				state.promptMsg = {
					head: 'Rematch',
					body: `${OpponentName} wants to play again.`,
				}
				break
			}
			case 'rematch': {
				// only show popup on opponents side
				if (state.clientId !== data.clientId) state.popUp = data.message
				// if opponent accepts rematch
				if (data.value) {
					gameStore.$patch({
						isPlaying: true,
						flag: 1,
						cells: {
							c1: '',
							c2: '',
							c3: '',
							c4: '',
							c5: '',
							c6: '',
							c7: '',
							c8: '',
							c9: '',
						},
					})
					state.message = ''
					state.winner = { player: '', cells: [] }
					state.isLoading = state.isGameOver = false
					state.comment =
						gameStore.turn === 1
							? 'Your turn'
							: `${formattedOpponentName} turn`
				} else {
					// show popup and redirect user back to home
					state.popUp = data.message
					setTimeout(() => redirect('/'), 2000)
				}
				break
			}
			case 'abort-game': {
				state.popUp = data.message
				setTimeout(() => redirect('/'), 2000)
				break
			}
		}
	}

	// abort game if user exits screen while playing
	window.addEventListener('beforeunload', abortGame)
})

onUnmounted(() => {
	// if exits screen while still looking for opponent, send cancel request
	if (state.isLoading) {
		// persist initial states before resetting
		const initialGameId = state.gameId
		const initialClientId = state.clientId
		state.gameId = state.clientId = ''
		// send request
		const payLoad = {
			method: 'join-cancel',
			mode,
			gameId: initialGameId,
			clientId: initialClientId,
		}
		ws.send(JSON.stringify(payLoad))
	}
})
</script>

<style lang="scss" scoped>
.content-wrapper {
	width: 100%;
	text-align: center;
	justify-content: center;
}
</style>
