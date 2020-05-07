import { mapState } from 'vuex'
import ChatListItem from '../chat_list_item/chat_list_item.vue'
import ChatNew from '../chat_new/chat_new.vue'
import List from '../list/list.vue'
import withLoadMore from '../../hocs/with_load_more/with_load_more'

const Chats = withLoadMore({
  fetch: (props, $store) => $store.dispatch('fetchChats'),
  select: (props, $store) => $store.state.chats.chatList.data,
  destroy: (props, $store) => undefined,
  childPropName: 'items'
})(List)

const ChatList = {
  components: {
    ChatListItem,
    Chats,
    ChatNew
  },
  computed: {
    ...mapState({
      currentUser: state => state.users.currentUser
    })
  },
  data () {
    return {
      isNew: false
    }
  },
  created () {
    this.$store.dispatch('fetchChats', { reset: true })
  },
  methods: {
    cancelNewChat () {
      this.isNew = false
      this.$store.dispatch('fetchChats', { reset: true })
    },
    newChat () {
      this.isNew = true
    }
  }
}

export default ChatList
