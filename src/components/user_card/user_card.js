import UserAvatar from '../user_avatar/user_avatar.vue'
import RemoteFollow from '../remote_follow/remote_follow.vue'
import ProgressButton from '../progress_button/progress_button.vue'
import FollowButton from '../follow_button/follow_button.vue'
import ModerationTools from '../moderation_tools/moderation_tools.vue'
import AccountActions from '../account_actions/account_actions.vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'
import { mapGetters } from 'vuex'

export default {
  props: [
    'userId', 'switcher', 'selected', 'hideBio', 'rounded', 'bordered', 'allowZoomingAvatar'
  ],
  data () {
    return {
      followRequestInProgress: false,
      betterShadow: this.$store.state.interface.browserSupport.cssFilter
    }
  },
  created () {
    this.$store.dispatch('fetchUserRelationship', this.user.redux.id)
  },
  computed: {
    user () {
      return this.$store.getters.findUser(this.userId)
    },
    relationship () {
      return this.$store.getters.relationship(this.userId)
    },
    classes () {
      return [{
        'user-card-rounded-t': this.rounded === 'top', // set border-top-left-radius and border-top-right-radius
        'user-card-rounded': this.rounded === true, // set border-radius for all sides
        'user-card-bordered': this.bordered === true // set border for all sides
      }]
    },
    style () {
      return {
        backgroundImage: [
          `linear-gradient(to bottom, var(--profileTint), var(--profileTint))`,
          `url(${this.user.redux.header})`
        ].join(', ')
      }
    },
    isOtherUser () {
      return this.user.redux.id !== this.$store.state.users.currentUser.id
    },
    subscribeUrl () {
      // eslint-disable-next-line no-undef
      const serverUrl = new URL(this.user.redux.url)
      return `${serverUrl.protocol}//${serverUrl.host}/main/ostatus`
    },
    loggedIn () {
      return this.$store.state.users.currentUser
    },
    dailyAvg () {
      const days = Math.ceil((new Date() - new Date(this.user.redux.created_at)) / (60 * 60 * 24 * 1000))
      return Math.round(this.user.redux.statuses_count / days)
    },
    userHighlightType: {
      get () {
        const data = this.$store.getters.mergedConfig.highlight[this.user.redux.acct]
        return (data && data.type) || 'disabled'
      },
      set (type) {
        const data = this.$store.getters.mergedConfig.highlight[this.user.redux.acct]
        if (type !== 'disabled') {
          this.$store.dispatch('setHighlight', { user: this.user.redux.acct, color: (data && data.color) || '#FFFFFF', type })
        } else {
          this.$store.dispatch('setHighlight', { user: this.user.redux.acct, color: undefined })
        }
      },
      ...mapGetters(['mergedConfig'])
    },
    userHighlightColor: {
      get () {
        const data = this.$store.getters.mergedConfig.highlight[this.user.redux.acct]
        return data && data.color
      },
      set (color) {
        this.$store.dispatch('setHighlight', { user: this.user.redux.acct, color })
      }
    },
    visibleRole () {
      const rights = this.user.redux.pleroma
      if (!rights) { return }
      const validRole = rights.is_admin || rights.is_moderator
      const roleTitle = rights.is_admin ? 'admin' : 'moderator'
      return validRole && roleTitle
    },
    hideFollowsCount () {
      return this.isOtherUser && this.user.redux.hide_follows_count
    },
    hideFollowersCount () {
      return this.isOtherUser && this.user.redux.hide_followers_count
    },
    ...mapGetters(['mergedConfig'])
  },
  components: {
    UserAvatar,
    RemoteFollow,
    ModerationTools,
    AccountActions,
    ProgressButton,
    FollowButton
  },
  methods: {
    muteUser () {
      this.$store.dispatch('muteUser', this.user.redux.id)
    },
    unmuteUser () {
      this.$store.dispatch('unmuteUser', this.user.redux.id)
    },
    subscribeUser () {
      return this.$store.dispatch('subscribeUser', this.user.redux.id)
    },
    unsubscribeUser () {
      return this.$store.dispatch('unsubscribeUser', this.user.redux.id)
    },
    setProfileView (v) {
      if (this.switcher) {
        const store = this.$store
        store.commit('setProfileView', { v })
      }
    },
    linkClicked ({ target }) {
      if (target.tagName === 'SPAN') {
        target = target.parentNode
      }
      if (target.tagName === 'A') {
        window.open(target.href, '_blank')
      }
    },
    userProfileLink (user) {
      return generateProfileLink(
        user.redux.id, user.redux.acct,
        this.$store.state.instance.restrictedNicknames
      )
    },
    zoomAvatar () {
      const attachment = {
        url: this.user.redux.avatar,
        pleroma: {
          mime_type: 'image'
        }
      }
      this.$store.dispatch('setMedia', [attachment])
      this.$store.dispatch('setCurrent', attachment)
    },
    mentionUser () {
      this.$store.dispatch('openPostStatusModal', { replyTo: true, repliedUser: this.user })
    }
  }
}
