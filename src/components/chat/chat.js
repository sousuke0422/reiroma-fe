import _ from 'lodash'
import { mapGetters, mapState } from 'vuex'
import ChatMessage from '../chat_message/chat_message.vue'
import ChatAvatar from '../chat_avatar/chat_avatar.vue'
import PostStatusForm from '../post_status_form/post_status_form.vue'
import ChatTitle from '../chat_title/chat_title.vue'
import chatService from '../../services/chat_service/chat_service.js'
import ChatLayout from './chat_layout.js'

const Chat = {
  components: {
    ChatMessage,
    ChatTitle,
    ChatAvatar,
    PostStatusForm
  },
  mixins: [ChatLayout],
  data () {
    return {
      loadingOlderMessages: false,
      loadingMessages: true,
      loadingChat: false,
      editedStatusId: undefined,
      fetcher: undefined,
      jumpToBottomButtonVisible: false,
      mobileLayout: this.$store.state.interface.mobileLayout,
      recipientId: this.$route.params.recipient_id,
      hoveredSequenceId: undefined,
      lastPosition: undefined
    }
  },
  created () {
    this.startFetching()
    window.addEventListener('resize', this.handleLayoutChange)
  },
  mounted () {
    this.$nextTick(() => {
      let scrollable = this.$refs.scrollable
      if (scrollable) {
        window.addEventListener('scroll', this.handleScroll)
      }
      this.updateSize()
      this.handleResize()
    })
    this.setChatLayout()

    if (typeof document.hidden !== 'undefined') {
      document.addEventListener('visibilitychange', this.handleVisibilityChange, false)
      this.$store.commit('setChatFocused', !document.hidden)
    }
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
    window.removeEventListener('resize', this.handleLayoutChange)
    this.unsetChatLayout()
    if (typeof document.hidden !== 'undefined') document.removeEventListener('visibilitychange', this.handleVisibilityChange, false)
    this.$store.dispatch('clearCurrentChat')
  },
  computed: {
    chatParticipants () {
      if (this.currentChat) {
        return [this.currentChat.account]
      } else {
        const user = this.findUser(this.recipientId)
        if (user) {
          return [user]
        } else {
          return []
        }
      }
    },
    recipient () {
      return this.currentChat && this.currentChat.account
    },
    formPlaceholder () {
      if (this.recipient) {
        return this.$t('chats.message_user', { nickname: this.recipient.screen_name })
      } else {
        return this.$t('chats.write_message')
      }
    },
    chatViewItems () {
      return chatService.getView(this.currentChatMessageService)
    },
    newMessageCount () {
      return this.currentChatMessageService && this.currentChatMessageService.newMessageCount
    },
    ...mapGetters(['currentChat', 'currentChatMessageService', 'findUser', 'findOpenedChatByRecipientId']),
    ...mapState({
      backendInteractor: state => state.api.backendInteractor,
      currentUser: state => state.users.currentUser,
      isMobileLayout: state => state.interface.mobileLayout,
      openedChats: state => state.chats.openedChats,
      windowHeight: state => state.interface.layoutHeight
    })
  },
  watch: {
    chatViewItems (prev, next) {
      let bottomedOut = this.bottomedOut(10)
      this.$nextTick(() => {
        if (bottomedOut && prev.length !== next.length) {
          this.scrollDown({ forceRead: true })
        }
      })
    },
    '$route': function (prev, next) {
      this.recipientId = this.$route.params.recipient_id
      this.startFetching()
    },
    windowHeight () {
      this.handleResize({ expand: true })
    }
  },
  methods: {
    onStatusHover ({ state, sequenceId }) {
      this.hoveredSequenceId = state ? sequenceId : undefined
    },
    onPosted (data) {
      this.$store.dispatch('addChatMessages', { chatId: this.currentChat.id, messages: [data] }).then(() => {
        this.$nextTick(() => {
          this.updateSize()
          this.scrollDown({ forceRead: true })
        })
      })
    },
    onFilesDropped () {
      this.$nextTick(() => {
        this.updateSize()
      })
    },
    handleVisibilityChange () {
      this.$store.commit('setChatFocused', !document.hidden)
    },
    handleLayoutChange () {
      this.updateSize()
      let mobileLayout = this.isMobileLayout
      if (this.mobileLayout !== mobileLayout) {
        if (this.mobileLayout === false && mobileLayout === true) {
          this.setMobileChatLayout()
        }
        if (this.mobileLayout === true && mobileLayout === false) {
          this.unsetMobileChatLayout()
        }
        this.mobileLayout = this.isMobileLayout
        this.$nextTick(() => {
          this.updateSize()
          this.scrollDown()
        })
      }
    },
    handleResize (opts) {
      this.$nextTick(() => {
        this.updateSize()

        let prevOffsetHeight
        if (this.lastPosition) {
          prevOffsetHeight = this.lastPosition.offsetHeight
        }

        this.lastPosition = {
          scrollTop: this.$refs.scrollable.scrollTop,
          totalHeight: this.$refs.scrollable.scrollHeight,
          offsetHeight: this.$refs.scrollable.offsetHeight
        }

        if (this.lastPosition) {
          const diff = this.lastPosition.offsetHeight - prevOffsetHeight
          const bottomedOut = this.bottomedOut()
          if (diff < 0 || (!bottomedOut && opts && opts.expand)) {
            this.$nextTick(() => {
              this.updateSize()
              this.$nextTick(() => {
                this.$refs.scrollable.scrollTo({
                  top: this.$refs.scrollable.scrollTop - diff,
                  left: 0
                })
              })
            })
          }
        }
      })
    },
    updateSize (newHeight, _diff) {
      let h = this.$refs.header
      let s = this.$refs.scrollable
      let f = this.$refs.footer
      if (h && s && f) {
        let height = 0
        if (this.isMobileLayout) {
          height = parseFloat(getComputedStyle(window.document.body, null).height.replace('px', ''))
          let newHeight = (height - h.clientHeight - f.clientHeight)
          s.style.height = newHeight + 'px'
        } else {
          height = parseFloat(getComputedStyle(this.$refs.inner, null).height.replace('px', ''))
          let newHeight = (height - h.clientHeight - f.clientHeight)
          s.style.height = newHeight + 'px'
        }
      }
    },
    scrollDown (options = {}) {
      let { behavior = 'auto', forceRead = false } = options
      let container = this.$refs.scrollable
      let scrollable = this.$refs.scrollable
      this.doScrollDown(scrollable, container, behavior)
      if (forceRead || this.newMessageCount > 0) {
        this.readChat()
      }
    },
    doScrollDown (scrollable, container, behavior) {
      if (!container) { return }
      this.$nextTick(() => {
        scrollable.scrollTo({ top: container.scrollHeight, left: 0, behavior })
      })
    },
    bottomedOut (offset) {
      let bottomedOut = false

      if (this.$refs.scrollable) {
        let scrollHeight = this.$refs.scrollable.scrollTop + (offset || 0)
        let totalHeight = this.$refs.scrollable.scrollHeight - this.$refs.scrollable.offsetHeight
        bottomedOut = totalHeight <= scrollHeight
      }

      return bottomedOut
    },
    getPosition () {
      let scrollHeight = this.$refs.scrollable.scrollTop
      let totalHeight = this.$refs.scrollable.scrollHeight - this.$refs.scrollable.offsetHeight
      return { scrollHeight, totalHeight }
    },
    reachedTop () {
      const scrollable = this.$refs.scrollable
      return scrollable && scrollable.scrollTop <= 0
    },
    handleScroll: _.throttle(function () {
      if (!this.currentChat) { return }

      if (this.reachedTop()) {
        this.fetchChat(false, this.currentChat.id, {
          maxId: this.currentChatMessageService.minId
        })
      } else if (this.bottomedOut(150)) {
        this.jumpToBottomButtonVisible = false
        if (this.newMessageCount > 0) {
          this.readChat()
        }
      } else {
        this.jumpToBottomButtonVisible = true
      }
    }, 100),
    goBack () {
      this.$router.push({ name: 'chats', params: { username: this.currentUser.screen_name } })
    },
    fetchChat (isFirstFetch, chatId, opts = {}) {
      let maxId = opts.maxId
      if (isFirstFetch) {
        this.scrollDown({ forceRead: true })
      }
      let positionBeforeLoading = null
      let previousScrollTop
      if (maxId) {
        this.loadingOlderMessages = true
        positionBeforeLoading = this.getPosition()
        previousScrollTop = this.$refs.scrollable.scrollTop
      }
      this.backendInteractor.chatMessages({ id: chatId, maxId })
        .then((messages) => {
          let bottomedOut = this.bottomedOut()
          this.loadingOlderMessages = false
          this.$store.dispatch('addChatMessages', { chatId, messages }).then(() => {
            if (positionBeforeLoading) {
              this.$nextTick(() => {
                let positionAfterLoading = this.getPosition()
                let scrollable = this.$refs.scrollable
                scrollable.scrollTo({
                  top: previousScrollTop + (positionAfterLoading.totalHeight - positionBeforeLoading.totalHeight),
                  left: 0
                })
              })
            }

            if (isFirstFetch) {
              this.$nextTick(() => {
                this.updateSize()
              })
            } else if (bottomedOut) {
              this.scrollDown()
            }
            setTimeout(() => {
              this.loadingMessages = false
            }, 1000)
          })
        })
    },
    readChat () {
      if (!(this.currentChat && this.currentChat.id)) { return }
      this.$store.dispatch('readChat', { id: this.currentChat.id })
    },
    async startFetching () {
      let chat = this.findOpenedChatByRecipientId(this.recipientId)
      if (!chat) {
        chat = await this.backendInteractor.getOrCreateChat({ accountId: this.recipientId })
      }
      this.$nextTick(() => {
        this.scrollDown({ forceRead: true })
      })

      this.$store.dispatch('addOpenedChat', { chat })
      this.doStartFetching()
    },
    doStartFetching () {
      let chatId = this.currentChat.id
      this.$store.dispatch('startFetchingCurrentChat', {
        fetcher: () => setInterval(() => this.fetchChat(false, chatId), 5000)
      })
      this.fetchChat(true, chatId)
    },
    poster (opts) {
      const status = opts.status

      let params = {
        id: this.currentChat.id,
        content: status
      }

      if (opts.media && opts.media[0]) {
        params.mediaId = opts.media[0].id
      }

      return this.backendInteractor.postChatMessage(params)
    }
  }
}

export default Chat
