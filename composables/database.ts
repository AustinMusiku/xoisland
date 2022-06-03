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
	// let updates: any;
	// check if user exists in database
	onValue(
		ref(db, `players/${name}/`),
		(snapshot) => {
			if (snapshot.exists()) {
				// update user if exists
				console.log('updating old user')
				update(ref(db), updateUserDetails(symbol, playerSymbol, name))
			} else {
				// add user to db then update
				addUser(name).then(() => {
					console.log('updating new user')
					// updates = updateUserDetails(symbol, playerSymbol, name);
					update(
						ref(db),
						updateUserDetails(symbol, playerSymbol, name)
					)
				})
			}
		},
		{ onlyOnce: true }
	)
	// console.log(updates)
	// return update(ref(db), updates)
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
		// loss
		updates[pathSuffix + 'loss'] = increment(1)
	}
	console.log(updates)
	return updates
}
