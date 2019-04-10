const poll = {
  state: {
    pollOptions: ['', '']
  },
  mutations: {
    ADD_OPTION (state, { option }) {
      state.pollOptions.push(option)
    },
    UPDATE_OPTION (state, { index, option }) {
      state.pollOptions[index] = option
    },
    DELETE_OPTION (state, { index }) {
      state.pollOptions.splice(index, 1)
    },
    SWAP_OPTIONS (state, { options }) {
      state.pollOptions = options
    }
  },
  actions: {
    addPollOption (store, { option }) {
      store.commit('ADD_OPTION', { option })
    },
    updatePollOption (store, { index, option }) {
      store.commit('UPDATE_OPTION', { index, option })
    },
    deletePollOption (store, { index }) {
      store.commit('DELETE_OPTION', { index })
    },
    swapPollOptions (store, { options }) {
      store.commit('SWAP_OPTIONS', { options })
    }
  }
}

export default poll
