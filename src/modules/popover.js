import { omit } from 'lodash'
import { set } from 'vue'

const popover = {
  state: {
    popovers: {}
  },
  mutations: {
    registerPopover (state, { id, el }) {
      set(state.popovers, id, el)
    },
    unregisterPopover (state, { id }) {
      state.popovers = omit(state.popovers, id)
    }
  },
  actions: {
    registerPopover (store, el) {
      // Generate unique id, it will be used to link portal and portal-target
      // popover-target will make portal targets for each registered popover
      // el will be used by popover target to put popovers in their places.
      let id = Math.floor(Math.random() * 1000000).toString()
      store.commit('registerPopover', { id, el })
      return id
    },
    unregisterPopover (store, id) {
      store.commit('unregisterPopover', { id })
    }
  }
}

export default popover
