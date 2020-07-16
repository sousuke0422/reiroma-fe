import StillImage from '../still-image/still-image.vue'
import UserPopover from '../user_popover/user_popover.vue'

const UserAvatar = {
  props: [
    'user',
    'betterShadow',
    'compact',
    'noPopover'
  ],
  data () {
    return {
      showPlaceholder: false,
      defaultAvatar: `${this.$store.state.instance.server + this.$store.state.instance.defaultAvatar}`
    }
  },
  components: {
    StillImage,
    UserPopover
  },
  methods: {
    imgSrc (src) {
      return (!src || this.showPlaceholder) ? this.defaultAvatar : src
    },
    imageLoadError () {
      this.showPlaceholder = true
    }
  }
}

export default UserAvatar
