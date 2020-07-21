
const UserPopover = {
  name: 'UserPopover',
  props: [
    'userId',
    'focusedElement'
  ],
  data () {
    return {
      error: false
    }
  },
  computed: {
    user () {
      return this.$store.getters.findUser(this.userId)
    }
  },
  components: {
    Popover: () => import('../popover/popover.vue'),
    UserCard: () => import('../user_card/user_card.vue')
  },
  methods: {
    enter () {
      if (!this.user) {
        if (!this.userId) {
          return
        }
        this.$store.dispatch('fetchUser', this.userId)
          .then(data => (this.error = false))
          .catch(e => (this.error = true))
      }
    }
  }
}

export default UserPopover
