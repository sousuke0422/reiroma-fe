import Notifications from '../notifications/notifications.vue'

const tabModeDict = {
  mentions: ['mention'],
  'likes+repeats': ['repeat', 'like'],
  follows: ['follow'],
  moves: ['pleroma:move'],
  emoji_reactions: ['pleroma:emoji_reaction']
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
