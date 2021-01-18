import StatusContent from '../status_content/status_content.vue'
import Timeago from '../timeago/timeago.vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'

const Report = {
  props: [
    'reportId'
  ],
  components: {
    StatusContent,
    Timeago
  },
  computed: {
    report () {
      return this.$store.state.reports.reports[this.reportId] || {}
    }
  },
  methods: {
    generateUserProfileLink (user) {
      return generateProfileLink(user.id, user.screen_name, this.$store.state.instance.restrictedNicknames)
    },
    setReportState (id, state) {
      return this.$store.dispatch('setReportState', { id, state })
    }
  }
}

export default Report
