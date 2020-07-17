import { mapState } from 'vuex'
import ProgressButton from '../progress_button/progress_button.vue'
import Popover from '../popover/popover.vue'
import ModerationTools from '../moderation_tools/moderation_tools.vue'

const AccountActions = {
  props: [
    'user', 'relationship'
  ],
  data () {
    return { }
  },
  components: {
    ProgressButton,
    Popover,
    ModerationTools
  },
  methods: {
    showRepeats () {
      this.$store.dispatch('showReblogs', this.user.id)
    },
    hideRepeats () {
      this.$store.dispatch('hideReblogs', this.user.id)
    },
    muteUser () {
      this.$store.dispatch('muteUser', this.user.id)
    },
    unmuteUser () {
      this.$store.dispatch('unmuteUser', this.user.id)
    },
    blockUser () {
      this.$store.dispatch('blockUser', this.user.id)
    },
    unblockUser () {
      this.$store.dispatch('unblockUser', this.user.id)
    },
    reportUser () {
      this.$store.dispatch('openUserReportingModal', this.user.id)
    },
    openChat () {
      this.$router.push({
        name: 'chat',
        params: { recipient_id: this.user.id }
      })
    },
    mentionUser () {
      this.$store.dispatch('openPostStatusModal', { replyTo: true, repliedUser: this.user })
    }
  },
  computed: {
    loggedIn () {
      return this.$store.state.users.currentUser
    },
    ...mapState({
      pleromaChatMessagesAvailable: state => state.instance.pleromaChatMessagesAvailable
    })
  }
}

export default AccountActions
