import Notifications from '../notifications/notifications.vue'

const tabModeDict = {
  mentions: ['mention'],
  'likes+repeats': ['repeat', 'like'],
  follows: ['follow'],
  reactions: ['pleroma:emoji_reaction'],
  reports: ['pleroma:report'],
  moves: ['move']
}

const Interactions = {
  data () {
    return {
      allowFollowingMove: this.$store.state.users.currentUser.allow_following_move,
      filterMode: tabModeDict['mentions']
    }
  },
  methods: {
    onModeSwitch (key) {
      this.filterMode = tabModeDict[key]
    }
  },
  components: {
    Notifications
  }
}

export default Interactions
