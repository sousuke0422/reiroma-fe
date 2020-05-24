import { set } from 'vue'
import { find, omitBy, debounce, last, orderBy } from 'lodash'
import chatService from '../services/chat_service/chat_service.js'
import { parseChat, parseChatMessage } from '../services/entity_normalizer/entity_normalizer.service.js'

const emptyChatList = () => ({
  data: [],
  pagination: { maxId: undefined, minId: undefined },
  idStore: {}
})

const defaultState = {
  chatList: emptyChatList(),
  openedChats: {},
  openedChatMessageServices: {},
  fetcher: undefined,
  chatFocused: false,
  currentChatId: null
}

const getChatById = (state, id) => {
  return find(state.chatList.data, { id })
}

const sortedChatList = (state) => {
  return orderBy(state.chatList.data, ['updated_at'], ['desc'])
}

const chats = {
  state: { ...defaultState },
  getters: {
    currentChat: state => state.openedChats[state.currentChatId],
    currentChatMessageService: state => state.openedChatMessageServices[state.currentChatId],
    findOpenedChatByRecipientId: state => recipientId => find(state.openedChats, c => c.account.id === recipientId),
    sortedChatList
  },
  actions: {
    // Chat list
    startFetchingChats ({ dispatch }) {
      setInterval(() => {
        dispatch('fetchChats', { reset: true })
        // dispatch('refreshCurrentUser')
      }, 5000)
    },
    fetchChats ({ dispatch, rootState, commit }, params = {}) {
      const pagination = rootState.chats.chatList.pagination
      const opts = { maxId: params.reset ? undefined : pagination.maxId }

      return rootState.api.backendInteractor.chats(opts)
        .then(({ chats, pagination }) => {
          dispatch('addNewChats', { chats, pagination })
          return chats
        })
    },
    addNewChats ({ rootState, commit, dispatch, rootGetters }, { chats, pagination }) {
      commit('addNewChats', { dispatch, chats, pagination, rootGetters })
    },
    updateChatByAccountId: debounce(({ rootState, commit, dispatch, rootGetters }, { accountId }) => {
      rootState.api.backendInteractor.getOrCreateChat({ accountId }).then(chat => {
        commit('updateChat', { dispatch, rootGetters, chat: parseChat(chat) })
      })
    }, 100),

    // Opened Chats
    startFetchingCurrentChat ({ commit, dispatch }, { fetcher }) {
      dispatch('setCurrentChatFetcher', { fetcher })
    },
    setCurrentChatFetcher ({ rootState, commit }, { fetcher }) {
      commit('setCurrentChatFetcher', { fetcher })
    },
    addOpenedChat ({ rootState, commit, dispatch }, { chat }) {
      commit('addOpenedChat', { dispatch, chat: parseChat(chat) })
      dispatch('addNewUsers', [chat.account])
    },
    addChatMessages ({ commit }, value) {
      commit('addChatMessages', { commit, ...value })
    },
    setChatFocused ({ commit }, value) {
      commit('setChatFocused', value)
    },
    resetChatNewMessageCount ({ commit }, value) {
      commit('resetChatNewMessageCount', value)
    },
    removeFromCurrentChatStatuses ({ commit }, { id }) {
      commit('removeFromCurrentChatStatuses', id)
    },
    clearCurrentChat ({ rootState, commit, dispatch }, value) {
      commit('setCurrentChatId', { chatId: undefined })
      commit('setCurrentChatFetcher', { fetcher: undefined })
    },
    readChat ({ rootState, dispatch }, { id }) {
      dispatch('resetChatNewMessageCount')
      dispatch('markMultipleNotificationsAsSeen', {
        finder: n => n.chatMessage && n.chatMessage.chat_id === id && !n.seen
      })
      rootState.api.backendInteractor.readChat({ id }).then(() => {
        // dispatch('refreshCurrentUser')
      })
    },
    deleteChatMessage ({ rootState, commit, dispatch }, value) {
      rootState.api.backendInteractor.deleteChatMessage(value)
      commit('deleteChatMessage', { commit, ...value })
    },
    resetChats ({ commit, dispatch }) {
      dispatch('clearCurrentChat')
      commit('resetChats', { commit })
    }
  },
  mutations: {
    setCurrentChatFetcher (state, { fetcher }) {
      let prevFetcher = state.fetcher
      if (prevFetcher) {
        clearInterval(prevFetcher)
      }
      state.fetcher = fetcher && fetcher()
    },
    addOpenedChat (state, { _dispatch, chat }) {
      state.currentChatId = chat.id
      set(state.openedChats, chat.id, chat)

      if (!state.openedChatMessageServices[chat.id]) {
        set(state.openedChatMessageServices, chat.id, chatService.empty(chat.id))
      }
    },
    setCurrentChatId (state, { chatId }) {
      state.currentChatId = chatId
    },
    addNewChats (state, { _dispatch, chats, pagination, _rootGetters }) {
      if (chats.length > 0) {
        state.chatList.pagination = { maxId: last(chats).id }
      }
      chats.forEach((updatedChat) => {
        let chat = getChatById(state, updatedChat.id)

        if (chat) {
          chat.lastMessage = updatedChat.lastMessage
          chat.unread = updatedChat.unread
        } else {
          state.chatList.data.push(updatedChat)
          set(state.chatList.idStore, updatedChat.id, updatedChat)
        }
      })
    },
    updateChat (state, { _dispatch, chat: updatedChat, _rootGetters }) {
      let chat = getChatById(state, updatedChat.id)
      if (chat) {
        chat.lastMessage = updatedChat.lastMessage
        chat.unread = updatedChat.unread
        chat.updated_at = updatedChat.updated_at
      }
      if (!chat) { state.chatList.data.unshift(updatedChat) }
      set(state.chatList.idStore, updatedChat.id, updatedChat)
    },
    deleteChat (state, { _dispatch, id, _rootGetters }) {
      state.chats.data = state.chats.data.filter(conversation =>
        conversation.last_status.id !== id
      )
      state.chats.idStore = omitBy(state.chats.idStore, conversation => conversation.last_status.id === id)
    },
    resetChats (state, { _dispatch }) {
      state.chatList = emptyChatList()
      state.chats.openedChats = {}
      state.chats.openedChatMessageServices = {}
      state.chats.fetcher = undefined
      state.chats.chatFocused = false
      state.chats.currentChatId = null
    },
    setChatsLoading (state, { value }) {
      state.chats.loading = value
    },
    addChatMessages (state, { commit, chatId, messages }) {
      const chatMessageService = state.openedChatMessageServices[chatId]
      if (chatMessageService) {
        chatService.add(chatMessageService, { messages: messages.map(parseChatMessage) })
        commit('refreshLastMessage', { chatId })
      }
    },
    refreshLastMessage (state, { chatId }) {
      const chatMessageService = state.openedChatMessageServices[chatId]
      if (chatMessageService) {
        let chat = getChatById(state, chatId)
        if (chat) {
          chat.lastMessage = chatMessageService.lastMessage
          chat.updated_at = chatMessageService.lastMessage.created_at
        }
      }
    },
    deleteChatMessage (state, { commit, chatId, messageId }) {
      const chatMessageService = state.openedChatMessageServices[chatId]
      if (chatMessageService) {
        chatService.deleteMessage(chatMessageService, messageId)
        commit('refreshLastMessage', { chatId })
      }
    },
    resetChatNewMessageCount (state, _value) {
      const chatMessageService = state.openedChatMessageServices[state.currentChatId]
      chatService.resetNewMessageCount(chatMessageService)
    },
    setChatFocused (state, value) {
      state.chatFocused = value
    }
  }
}

export default chats
