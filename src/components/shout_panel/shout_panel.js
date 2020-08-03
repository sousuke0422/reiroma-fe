import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'

const shoutPanel = {
  props: [ 'floating' ],
  data () {
    return {
      currentMessage: '',
      channel: null,
      collapsed: true
    }
  },
  computed: {
    messages () {
      return this.$store.state.shout.messages
    }
  },
  methods: {
    submit (message) {
      this.$store.state.shout.channel.push('new_msg', { text: message }, 10000)
      this.currentMessage = ''
    },
    togglePanel () {
      this.collapsed = !this.collapsed
    },
    userProfileLink (user) {
      return generateProfileLink(user.id, user.username, this.$store.state.instance.restrictedNicknames)
    }
  }
}

export default shoutPanel
