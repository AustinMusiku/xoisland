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

// players:
// 		henk:
//          name: henk
//          birthdate: 14-05-2016
// 			friends:
// 				priscilla: true,
// 				prisca: true,

//      priscilla:
//          name: priscilla
//          birthdate: 14-05-2016
// 			friends:
// 			    henk: true,
// 		prisca:
// 			name: prisca
// 			birthdate: 14-05-2016
// 			friends:
// 				henk: true,

// get users as a list
export function useGetFriends(name: string): Promise<Player[]> {
	const users: any[] = []
	return new Promise((resolve) => {
		onValue(ref(db, `players/${name}/friends`), (snapshot) => {
			const friends = snapshot.val()
			for (const friend in friends) {
				users.push(friend)
			}
			resolve(namesToUserObjects(users))
		})
	})
}

export function isFriend(self: string, friend: string): boolean {
	let isFriend = false
	onValue(ref(db, `players/${self}/friends/${friend}`), (snapshot) => {
		isFriend = snapshot.val()
	})
	return isFriend
}

// Add friend to user's friend list and vice versa
export function useAddFriend(self: string, friend: string): void {
	if (self === friend) return

	if (isFriend(self, friend)) return

	const updates: any = {}

	updates[`players/${self}/friends/${friend}`] = true
	updates[`players/${friend}/friends/${self}`] = true

	update(ref(db), updates)
}

// get token for a user
export function useGetToken(name: string): Promise<string> {
	return new Promise((resolve) => {
		onValue(ref(db, `players/${name}/msgToken`), (snapshot) => {
			resolve(snapshot.val())
		})
	})
}

function namesToUserObjects(names: string[]): Promise<Player[]> {
	const users: Player[] = []

	return new Promise((resolve) => {
		names.forEach((name) => {
			onValue(ref(db, `players/${name}/msgToken`), (snapshot) => {
				users.push({
					name,
					token: snapshot.val(),
				})

				if (users.length === names.length) {
					resolve(users)
				}
			})
		})
	})
}
