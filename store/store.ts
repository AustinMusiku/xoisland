import { GetterTree, ActionTree, MutationTree } from 'vuex'

export const state = () => ({
    flag: 1,
});

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {
    menu: (state) => state.flag
};
  
export const mutations: MutationTree<RootState> = { 
    INCREMENT_FLAG(state) { state.flag++ },
    DECREMENT_FLAG(state) { state.flag-- }, 
    RESET_FLAG(state) { state.flag = 1 } 
};
  
export const actions: ActionTree<RootState, RootState> = { 
    incrementFlag({ commit }) { commit('INCREMENT_FLAG') },
    decrementFlag({ commit }) { commit('DECREMENT_FLAG') },
    resetFlag({ commit }) { commit('RESET_FLAG') }
};