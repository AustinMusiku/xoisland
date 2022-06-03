import { getDatabase, ref, update, increment } from 'firebase/database'

const db = getDatabase()

export function useSaveOutcome(
	symbol: string,
	playerSymbol: string,
	name: string
) {
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
	return update(ref(db), updates)
}
