import { mapState } from 'vuex'
import ChatAvatar from '../chat_avatar/chat_avatar.vue'
import AvatarList from '../avatar_list/avatar_list.vue'
import Timeago from '../timeago/timeago.vue'
import ChatTitle from '../chat_title/chat_title.vue'

const ChatListItem = {
  name: 'ChatListItem',
  props: [
    'chat'
  ],
  components: {
    ChatAvatar,
    AvatarList,
    Timeago,
    ChatTitle
  },
  computed: {
    ...mapState({
      currentUser: state => state.users.currentUser
    })
  },
  methods: {
    openChat (_e) {
      if (this.chat.id) {
        this.$router.push({
          name: 'chat',
          params: {
            username: this.currentUser.screen_name,
            recipient_id: this.chat.account.id
          }
        })
      }
    }
  }
}

export default ChatListItem
