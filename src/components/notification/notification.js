import StatusContent from '../status_content/status_content.vue'
import Status from '../status/status.vue'
import UserAvatar from '../user_avatar/user_avatar.vue'
import UserCard from '../user_card/user_card.vue'
import Timeago from '../timeago/timeago.vue'
import { isStatusNotification } from '../../services/notification_utils/notification_utils.js'
import { highlightClass, highlightStyle } from '../../services/user_highlighter/user_highlighter.js'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'

const Notification = {
  data () {
    return {
      userExpanded: false,
      betterShadow: this.$store.state.interface.browserSupport.cssFilter,
      unmuted: false
    }
  },
  props: [ 'notification' ],
  components: {
    StatusContent,
    UserAvatar,
    UserCard,
    Timeago,
    Status
  },
  methods: {
    toggleUserExpanded () {
      this.userExpanded = !this.userExpanded
    },
    generateUserProfileLink (user) {
      return generateProfileLink(user.id, user.screen_name, this.$store.state.instance.restrictedNicknames)
    },
    getUser (notification) {
      return this.$store.state.users.usersObject[notification.redux.account.id]
    },
    toggleMute () {
      this.unmuted = !this.unmuted
    },
    approveUser () {
      this.$store.state.api.backendInteractor.approveUser({ id: this.user.id })
      this.$store.dispatch('removeFollowRequest', this.user)
      this.$store.dispatch('markSingleNotificationAsSeen', { id: this.notification.redux.id })
      this.$store.dispatch('updateNotification', {
        id: this.notification.redux.id,
        updater: notification => {
          notification.redux.type = 'follow'
        }
      })
    },
    denyUser () {
      this.$store.state.api.backendInteractor.denyUser({ id: this.user.id })
        .then(() => {
          this.$store.dispatch('dismissNotificationLocal', { id: this.notification.redux.id })
          this.$store.dispatch('removeFollowRequest', this.user)
        })
    }
  },
  computed: {
    userClass () {
      return highlightClass(this.notification.redux.account)
    },
    userStyle () {
      const highlight = this.$store.getters.mergedConfig.highlight
      const user = this.notification.redux.account
      return highlightStyle(highlight[user.screen_name])
    },
    user () {
      return this.$store.getters.findUser(this.notification.redux.account.id)
    },
    userProfileLink () {
      return this.generateUserProfileLink(this.user)
    },
    targetUser () {
      return this.$store.getters.findUser(this.notification.redux.target.id)
    },
    targetUserProfileLink () {
      return this.generateUserProfileLink(this.targetUser)
    },
    needMute () {
      return this.$store.getters.relationship(this.user.id).muting
    },
    isStatusNotification () {
      return (this.notification.redux.type)
    }
  }
}

export default Notification
