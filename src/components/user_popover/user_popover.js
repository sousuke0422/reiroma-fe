
const UserPopover = {
  name: 'UserPopover',
  props: [
    'userId',
    'anchorOffset'
  ],
  data () {
    return {
      error: false,
      fetching: false
    }
  },
  computed: {
    user () {
      return this.$store.getters.findUser(this.userId)
    },
    relationshipAvailable () {
      const relationship = this.$store.getters.relationship(this.userId)
      return relationship && !relationship.loading
    }
  },
  components: {
    Popover: () => import('../popover/popover.vue'),
    UserCard: () => import('../user_card/user_card.vue')
  },
  methods: {
    enter () {
      if (!this.userId) return
      if (this.fetching) return
      const promises = []
      if (!this.user) {
        promises.push(this.$store.dispatch('fetchUser', this.userId))
      }
      if (!this.relationshipAvailable) {
        promises.push(this.$store.dispatch('fetchUserRelationship', this.userId))
      }
      if (promises.length > 0) {
        this.fetching = true
        Promise.all(promises)
          .then(data => (this.error = false))
          .catch(e => (this.error = true))
          .finally(() => (this.fetching = false))
      }
    }
  }
}

export default UserPopover
