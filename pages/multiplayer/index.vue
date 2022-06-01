<template>
	<div class="grid">
		<div class="grid__container">
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
					@joinAgain="joinAgain"
				/>

				<GridBox
					v-if="store.getIsPlaying"
					:comment="state.comment"
					:winner="state.winner"
					:is-game-over="state.isGameOver"
					@fillField="fillField"
					@playAgain="playAgain"
				/>
			</div>
		</div>
	</div>
</template>

<script setup context lang="ts">
import { onMounted, reactive, useContext } from '@nuxtjs/composition-api'
import { useGameplayStore } from '../../stores/gameplay'

const store = useGameplayStore()
store.$reset()
const { redirect, isDev } = useContext()

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
	isTwoPlayers: false,
	isGameOver: false,
	winner: {
		player: '',
		cells: [],
	},
})

let handleMove: any
let handlePlayAgain: any
let handleJoinAgain: any
let handlePrompt: any
const joinAgain = () => handleJoinAgain()
const playAgain = () => handlePlayAgain()
const prompt = (value: boolean) => handlePrompt(value)
const fillField = (cellId: string) => handleMove(cellId)

function closePopUp() {
	state.popUp = ''
}

onMounted(() => {
	const WEBSOCKET_URL = 'ws://localhost:3000'
	const ws = isDev
		? new WebSocket(WEBSOCKET_URL)
		: new WebSocket('wss://tictactoeisland.herokuapp.com')

	ws.onmessage = (message) => {
		const data = JSON.parse(message.data)

		switch (data.method) {
			case 'connect': {
				state.clientId = data.clientId

				// create/join game
				ws.send(
					JSON.stringify({
						method: 'join',
						clientId: state.clientId,
					})
				)
				break
			}
			case 'join': {
				state.isLoading = false
				state.isTwoPlayers = true
				if (state.gameId === '') state.gameId = data.gameId
				if (store.getTurn === 0) store.setTurn(2)
				store.toggleIsPlaying()
				state.comment = 'Player X turn'
				break
			}
			case 'join-wait': {
				state.gameId = data.gameId
				store.setTurn(data.turn)
				state.message = 'Waiting for another player...'
				break
			}
			case 'join-timeout': {
				state.isLoading = false
				state.message = data.message
				state.gameId = ''
				break
			}
			case 'play': {
				const cellPlayed = data.move.cell
				const cellSymbol = data.move.symbol

				store.getFlag === 1
					? (state.comment = 'Player O Turn')
					: (state.comment = 'Player X Turn')
				cellSymbol === 'X'
					? store.incrementFlag()
					: store.decrementFlag()

				store.getCells[cellPlayed] = cellSymbol
				break
			}
			case 'end': {
				state.comment = data.message
				state.winner = {
					player: data.symbol,
					cells: data.cells,
				}
				state.isGameOver = true
				break
			}
			case 'play-again': {
				state.promptMsg = {
					head: 'play rematch?',
					body: data.message,
				}
				break
			}
			case 'rematch': {
				// only show popup on opponents side
				if (state.clientId !== data.clientId) state.popUp = data.message
				// if opponent accepts rematch
				if (data.value) {
					store.$patch({
						isPlaying: true,
						flag: 1,
						symbol: 'X',
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
					state.comment = 'Player X turn'
				} else {
					// show popup and redirect user back to home
					state.popUp = data.message
					setTimeout(() => redirect('/'), 2000)
				}
				break
			}
		}
	}

	handleMove = (cellId: string): void => {
		const payLoad = {
			method: 'play',
			clientId: state.clientId,
			gameId: state.gameId,
			cell: cellId,
		}
		ws.send(JSON.stringify(payLoad))
	}

	handlePlayAgain = () => {
		const payLoad = {
			method: 'play-again',
			clientId: state.clientId,
			gameId: state.gameId,
		}
		// ask to play game again
		ws.send(JSON.stringify(payLoad))
	}

	handleJoinAgain = () => {
		state.isLoading = true
		state.isTwoPlayers = false

		// create/join game again
		ws.send(
			JSON.stringify({
				method: 'join',
				clientId: state.clientId,
			})
		)
	}

	handlePrompt = (value: boolean) => {
		state.promptMsg = {
			head: '',
			body: '',
		}
		if (!value) redirect('/')
		const payLoad = {
			method: 'play-again-prompt',
			clientId: state.clientId,
			gameId: state.gameId,
			isPlayAgain: value,
		}
		// create/join game again
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
