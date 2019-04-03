const poll = {
  state: {
    pollOptions: ['', '']
  },
  mutations: {
    addPollOption (state, option) {
      state.pollOptions.push(option)
    },
    updatePollOption (state, { index, option }) {
      state.pollOptions[index] = option
    },
    deletePollOption (state, index) {
      state.pollOptions.splice(index, 1)
    }
  }
}

export default poll
