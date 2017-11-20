import GroupCardContent from '../group_card_content/group_card_content.vue'
import Timeline from '../timeline/timeline.vue'

const GroupPage = {
  created () {
    this.$store.dispatch('startFetching', { 'timeline': 'group', 'identifier': this.groupName })
  },
  destroyed () {
    this.$store.commit('clearTimeline', { timeline: 'group' })
    this.$store.dispatch('stopFetching', 'group')
  },
  computed: {
    timeline () { return this.$store.state.statuses.timelines.group },
    groupName () {
      return this.$route.params.name
    },
    group () {
      return this.$store.state.groups.groupsObject[this.groupName]
    },
    isMember () {
      return this.$store.state.groups.groupMemberships[this.groupName]
    }
  },
  watch: {
    groupName () {
      this.$store.commit('clearTimeline', { timeline: 'group' })
      this.$store.dispatch('startFetching', { 'timeline': 'group', 'identifier': this.groupName })
    }
  },
  components: {
    GroupCardContent,
    Timeline
  }
}

export default GroupPage
