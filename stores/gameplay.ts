import { defineStore } from 'pinia'

interface Cells {[key: string]: string}

export const useGameplayStore = defineStore('gameplayStore', {
    state: () => {
        return {
            flag: 1,
            turn: 0,
            symbol: 'X',
            cells: <Cells>{ c1: '', c2: '', c3: '', c4: '', c5: '', c6: '', c7: '', c8: '', c9: '' }
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
        setTurn(turn: number){ this.turn = turn },
        setSymbol(symbol: string){ this.symbol = symbol },
        setCells(cells: Cells){ this.cells = cells }
    }
})