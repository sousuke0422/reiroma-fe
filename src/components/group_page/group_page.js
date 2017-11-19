import GroupCardContent from '../group_card_content/group_card_content.vue'
import Timeline from '../timeline/timeline.vue'

const GroupPage = {
  created () {
    const name = this.$route.params.name
    this.$store.commit('clearTimeline', { timeline: 'group' })
    this.$store.dispatch('startFetching', { 'identifier': name })
    this.$store.dispatch('fetchGroup', { 'groupName': name })
    this.$store.dispatch('fetchIsMember', { 'groupName': name, 'id': this.$store.state.users.currentUser.id })
  },
  destroyed () {
    this.$store.dispatch('stopFetching', 'group')
  },
  computed: {
    timeline () { return this.$store.state.statuses.timelines.group },
    groupName () {
      return this.$route.params.name
    },
    group () {
      return this.$store.state.groups.groupsObject[this.groupName] || false
    }
  },
  watch: {
    groupName () {
      this.$store.dispatch('fetchGroup', { 'groupName': this.groupName })
      this.$store.dispatch('fetchIsMember', { 'groupName': this.groupName, 'id': this.$store.state.users.currentUser.id })
      this.$store.commit('clearTimeline', { timeline: 'group' })
      // this.$store.dispatch('startFetching', { 'identifier': this.groupName })
    }
  },
  components: {
    GroupCardContent,
    Timeline
  }
}

export default GroupPage
