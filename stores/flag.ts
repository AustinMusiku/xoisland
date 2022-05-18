import { defineStore } from 'pinia'

export const useFlagStore = defineStore('flagStore', {
    state: () => {
        return {
            flag: 1
        }
    },
    
    getters: {
        flag: state => state.flag
    },

    actions: { 
        incrementFlag(){ this.flag++ },
        decrementFlag(){ this.flag-- },
    }
})

  


// import { reactive } from '@nuxtjs/composition-api'

// export const flag = reactive({
//   value: 1,
//   increment() { this.value++ },
//   decrement() { this.value-- },
//   reset() { this.value = 1 }
// })