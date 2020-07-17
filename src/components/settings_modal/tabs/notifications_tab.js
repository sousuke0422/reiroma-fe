import Checkbox from 'src/components/checkbox/checkbox.vue'

import SharedComputedObject from '../helpers/shared_computed_object.js'

const NotificationsTab = {
  data () {
    return {
      activeTab: 'profile',
      notificationSettings: this.$store.state.users.currentUser.notification_settings,
      newDomainToMute: ''
    }
  },
  components: {
    Checkbox
  },
  computed: {
    ...SharedComputedObject(),
    user () {
      return this.$store.state.users.currentUser
    }
  },
  methods: {
    updateNotificationSettings () {
      this.$store.state.api.backendInteractor
        .updateNotificationSettings({ settings: this.notificationSettings })
    }
  },
  watch: {
    notificationVisibility: {
      handler (value) {
        this.$store.dispatch('setOption', {
          name: 'notificationVisibility',
          value: this.$store.getters.mergedConfig.notificationVisibility
        })
      },
      deep: true
    }
  }
}

export default NotificationsTab
