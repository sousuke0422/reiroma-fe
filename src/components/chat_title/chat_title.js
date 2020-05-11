import Vue from 'vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import ChatAvatar from '../chat_avatar/chat_avatar.vue'
import { mapState } from 'vuex'

const USER_LIMIT = 10

export default Vue.component('direct-conversation-title', {
  name: 'ChatTitle',
  components: {
    ChatAvatar
  },
  props: [
    'users', 'fallbackUser', 'withAvatar'
  ],
  computed: {
    ...mapState({
      currentUser: state => state.users.currentUser
    }),
    otherUsersTruncated () {
      return this.otherUsers.slice(0, USER_LIMIT)
    },
    otherUsers () {
      let otherUsers = this.users.filter(recipient => recipient.id !== this.currentUser.id)
      if (otherUsers.length === 0) {
        return [this.fallbackUser]
      } else {
        return otherUsers
      }
    },
    restCount () {
      return this.otherUsers.length - USER_LIMIT
    },
    title () {
      return this.otherUsers.map(u => u.screen_name).join(', ')
    }
  },
  methods: {
    getUserProfileLink (user) {
      return generateProfileLink(user.id, user.screen_name)
    }
  }
})
