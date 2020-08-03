import { mapState, mapGetters } from 'vuex'

const NavPanel = {
  created () {
    if (this.currentUser && this.currentUser.locked) {
      this.$store.dispatch('startFetchingFollowRequests')
    }
  },
  computed: {
    ...mapState({
      currentUser: state => state.users.currentUser,
      shout: state => state.shout.channel,
      followRequestCount: state => state.api.followRequests.length,
      privateMode: state => state.instance.private,
      federating: state => state.instance.federating,
      pleromaChatMessagesAvailable: state => state.instance.pleromaChatMessagesAvailable
    }),
    ...mapGetters(['unreadChatCount'])
  }
}

export default NavPanel
