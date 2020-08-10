import { mapState, mapGetters } from 'vuex'
import UserCard from '../user_card/user_card.vue'
import { unseenNotificationsFromStore } from '../../services/notification_utils/notification_utils'
import GestureService from '../../services/gesture_service/gesture_service'

const SideDrawer = {
  props: [ 'logout' ],
  data: () => ({
    closed: true,
    closeGesture: undefined
  }),
  created () {
    this.closeGesture = GestureService.swipeGesture(GestureService.DIRECTION_LEFT, this.toggleDrawer)

    if (this.currentUser && this.currentUser.locked) {
      this.$store.dispatch('startFetchingFollowRequests')
    }
  },
  components: { UserCard },
  computed: {
    currentUser () {
      return this.$store.state.users.currentUser
    },
    shout () { return this.$store.state.shout.channel.state === 'joined' },
    unseenNotifications () {
      return unseenNotificationsFromStore(this.$store)
    },
    unseenNotificationsCount () {
      return this.unseenNotifications.length
    },
    suggestionsEnabled () {
      return this.$store.state.instance.suggestionsEnabled
    },
    logo () {
      return this.$store.state.instance.logo
    },
    hideSitename () {
      return this.$store.state.instance.hideSitename
    },
    sitename () {
      return this.$store.state.instance.name
    },
    followRequestCount () {
      return this.$store.state.api.followRequests.length
    },
    privateMode () {
      return this.$store.state.instance.private
    },
    federating () {
      return this.$store.state.instance.federating
    },
    timelinesRoute () {
      if (this.$store.state.interface.lastTimeline) {
        return this.$store.state.interface.lastTimeline
      }
      return this.currentUser ? 'friends' : 'public-timeline'
    },
    ...mapState({
      pleromaChatMessagesAvailable: state => state.instance.pleromaChatMessagesAvailable
    }),
    ...mapGetters(['unreadChatCount'])
  },
  methods: {
    toggleDrawer () {
      this.closed = !this.closed
    },
    doLogout () {
      this.logout()
      this.toggleDrawer()
    },
    touchStart (e) {
      GestureService.beginSwipe(e, this.closeGesture)
    },
    touchMove (e) {
      GestureService.updateSwipe(e, this.closeGesture)
    },
    openSettingsModal () {
      this.$store.dispatch('openSettingsModal')
    }
  }
}

export default SideDrawer
