
const UserPopover = {
  name: 'UserPopover',
  props: [
    'userId',
    'anchorOffset'
  ],
  data () {
    return {
      error: false
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
      if (!this.user) {
        this.$store.dispatch('fetchUser', this.userId)
          .then(data => (this.error = false))
          .catch(e => (this.error = true))
      }
      if (!this.relationship) {
        this.$store.dispatch('fetchUserRelationship', this.userId)
          .then(data => (this.error = false))
          .catch(e => (this.error = true))
      }
    }
  }
}

export default UserPopover
