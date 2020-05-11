import { mapState, mapGetters } from 'vuex'
import Attachment from '../attachment/attachment.vue'
import UserAvatar from '../user_avatar/user_avatar.vue'
import Gallery from '../gallery/gallery.vue'
import LinkPreview from '../link-preview/link-preview.vue'
import StatusContent from '../status_content/status_content.vue'
import ChatMessageDate from '../chat_message_date/chat_message_date.vue'
import generateProfileLink from 'src/services/user_profile_link_generator/user_profile_link_generator'

const ChatMessage = {
  name: 'ChatMessage',
  props: [
    'edited',
    'noHeading',
    'chatViewItem',
    'sequenceHovered'
  ],
  components: {
    Attachment,
    StatusContent,
    UserAvatar,
    Gallery,
    LinkPreview,
    ChatMessageDate
  },
  computed: {
    // Returns HH:MM (hours and minutes) in local time.
    createdAt () {
      const time = this.chatViewItem.data.created_at
      const lang = this.mergedConfig.interfaceLanguage
      return time.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', hour12: false })
    },
    isCurrentUser () {
      return this.message.account_id === this.currentUser.id
    },
    author () {
      return this.findUser(this.message.account_id)
    },
    message () {
      return this.chatViewItem.data
    },
    userProfileLink () {
      return generateProfileLink(this.author.id, this.author.screen_name, this.$store.state.instance.restrictedNicknames)
    },
    isMessage () {
      return this.chatViewItem.type === 'message'
    },
    messageForStatusContent () {
      let result = {
        summary: '',
        statusnet_html: this.message.content,
        text: this.message.content
      }

      if (this.message.attachment) {
        result.attachments = [this.message.attachment]
      } else {
        result.attachments = []
      }

      return result
    },
    ...mapState({
      betterShadow: state => state.interface.browserSupport.cssFilter,
      currentUser: state => state.users.currentUser,
      restrictedNicknames: state => state.instance.restrictedNicknames
    }),
    ...mapGetters(['mergedConfig', 'findUser'])
  },
  methods: {
    onHover (bool) {
      this.$emit('hover', { state: bool, sequenceId: this.chatViewItem.sequenceId })
    }
  }
}

export default ChatMessage
