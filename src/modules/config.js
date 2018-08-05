import { set, delete as del } from 'vue'
import StyleSetter from '../services/style_setter/style_setter.js'

const defaultState = {
  name: 'Pleroma FE',
  colors: {},
  hideAttachments: false,
  hideAttachmentsInConv: false,
  hideNsfw: true,
  autoLoad: true,
  streaming: false,
  hoverPreview: true,
  muteWords: [],
  muteUsers: {}
}

const config = {
  state: defaultState,
  mutations: {
    setOption (state, { name, value }) {
      set(state, name, value)
    },
    setMute (state, { user, value }) {
      if (value) {
        set(state.muteUsers, user, true)
      } else {
        del(state.muteUsers, user)
      }
    }
  },
  actions: {
    setPageTitle ({state}, option = '') {
      document.title = `${option} ${state.name}`
    },
    setMute ({ commit, dispatch }, { user, value }) {
      commit('setMute', { user, value })
    },
    setOption ({ commit, dispatch }, { name, value }) {
      commit('setOption', {name, value})
      switch (name) {
        case 'name':
          dispatch('setPageTitle')
          break
        case 'theme':
          StyleSetter.setPreset(value, commit)
          break
        case 'customTheme':
          StyleSetter.setColors(value, commit)
      }
    }
  }
}

export default config
