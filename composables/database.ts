import { ref, update, increment, onValue, set } from 'firebase/database'
import { db } from '~/plugins/firebase'

interface Player {
	name: string
	token: string
}

export function useSaveOutcome(
	symbol: string,
	playerSymbol: string,
	name: string
) {
	// check if user exists in database
	onValue(
		ref(db, `players/${name}/`),
		(snapshot) => {
			if (snapshot.exists()) {
				// update user if exists
				update(ref(db), updateUserDetails(symbol, playerSymbol, name))
			} else {
				// add user to db then update
				addUser(name).then(() => {
					update(
						ref(db),
						updateUserDetails(symbol, playerSymbol, name)
					)
				})
			}
		},
		{ onlyOnce: true }
	)
}

// helpers
function addUser(name: string) {
	return set(ref(db, `players/${name}`), {
		draw: 0,
		loss: 0,
		points: 0,
		win: 0,
	})
}

function updateUserDetails(symbol: string, playerSymbol: string, name: string) {
	const updates: any = {}
	const pathSuffix: string = `players/${name}/`
	if (symbol === playerSymbol) {
		// win
		updates[pathSuffix + 'win'] = increment(1)
		updates[pathSuffix + 'points'] = increment(3)
	} else if (symbol === 'D') {
		// draw
		updates[pathSuffix + 'draw'] = increment(1)
		updates[pathSuffix + 'points'] = increment(1)
	} else {
		// lose
		updates[pathSuffix + 'loss'] = increment(1)
	}
	return updates
}

export function useCheckUserExists(name: string): Promise<boolean> {
	return new Promise((resolve) => {
		onValue(ref(db, `players/${name}/`), (snapshot: any) => {
			resolve(snapshot.exists())
		})
	})
}

// get users as a list
export function useGetFriends(name: string): Promise<Player[]> {
	const users: any[] = []
	return new Promise((resolve) => {
		onValue(ref(db, `players/${name}/friends`), (snapshot) => {
			const friends = snapshot.val()
			for (const friend in friends) {
				users.push({
					name: friend,
					token: friends[friend].msgToken,
				})
			}
			resolve(users)
		})
	})
}

// get token for a user
export function useGetToken(name: string): Promise<string> {
	return new Promise((resolve) => {
		onValue(ref(db, `players/${name}/msgToken`), (snapshot) => {
			resolve(snapshot.val())
		})
	})
}
