import {
	getDatabase,
	ref,
	update,
	increment,
	onValue,
	set,
} from 'firebase/database'

const db = getDatabase()

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
