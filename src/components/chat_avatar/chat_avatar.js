import StillImage from '../still-image/still-image.vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import { mapState } from 'vuex'

const ChatAvatar = {
  props: ['users', 'fallbackUser', 'width', 'height'],
  components: {
    StillImage
  },
  methods: {
    getUserProfileLink (user) {
      return generateProfileLink(user.id, user.screen_name)
    }
  },
  computed: {
    firstUser () {
      return this.users[0] || this.fallbackUser
    },
    secondUser () {
      return this.users[1]
    },
    thirdUser () {
      return this.users[2]
    },
    fourthUser () {
      return this.users[3]
    },
    ...mapState({
      betterShadow: state => state.interface.browserSupport.cssFilter
    })
  }
}

export default ChatAvatar
