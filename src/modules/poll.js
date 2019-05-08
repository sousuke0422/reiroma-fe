const poll = {
  state: {
    options: ['', ''],
    multiple: false,
    expiresIn: '86400'
  },
  mutations: {
    ADD_OPTION (state, { option }) {
      state.options.push(option)
    },
    UPDATE_OPTION (state, { index, option }) {
      state.options[index] = option
    },
    DELETE_OPTION (state, { index }) {
      state.options.splice(index, 1)
    },
    SWAP_OPTIONS (state, { options }) {
      state.options = options
    },
    SET_MULTIPLE (state, { multiple }) {
      state.multiple = multiple
    },
    SET_EXPIRES_IN (state, { expiresIn }) {
      state.expiresIn = expiresIn
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
    },
    setMultiple (store, { multiple }) {
      store.commit('SET_MULTIPLE', { multiple })
    },
    setExpiresIn (store, { expiresIn }) {
      store.commit('SET_EXPIRES_IN', { expiresIn })
    }
  }
}

export default poll
