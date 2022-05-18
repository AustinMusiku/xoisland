import { defineStore } from 'pinia'

export const useFlagStore = defineStore('flagStore', {
    state: () => {
        return {
            flag: 1
        }
    },
    
    getters: {
        getFlag: state => state.flag
    },

    actions: { 
        incrementFlag(){ this.flag++ },
        decrementFlag(){ this.flag-- },
    }
})