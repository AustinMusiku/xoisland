import { defineStore } from 'pinia'

export const useGameplayStore = defineStore('gameplayStore', {
    state: () => {
        let cells: {[key: string]: string} = { c1: '', c2: '', c3: '', c4: '', c5: '', c6: '', c7: '', c8: '', c9: '' }
        return {
            flag: 1,
            turn: 1,
            symbol: 'X',
            cells
        }
    },
    
    getters: {
        getFlag: state => state.flag,
        getTurn: state => state.turn,
        getSymbol: state => state.symbol,
        getCells: state => state.cells
    },

    actions: { 
        incrementFlag(){ this.flag++ },
        decrementFlag(){ this.flag-- },
    }
})