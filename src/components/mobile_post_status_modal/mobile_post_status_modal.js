import PostStatusForm from '../post_status_form/post_status_form.vue'
import { throttle } from 'lodash'

const MobilePostStatusModal = {
  components: {
    PostStatusForm
  },
  data () {
    return {
      hidden: false,
      postFormOpen: false,
      scrollingDown: false,
      oldScrollPos: 0,
      amountScrolled: 0
    }
  },
  created () {
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  computed: {
    currentUser () {
      return this.$store.state.users.currentUser
    }
  },
  methods: {
    openPostForm () {
      this.postFormOpen = true
      this.hidden = true

      const el = this.$el.querySelector('textarea')
      this.$nextTick(function () {
        el.focus()
      })
    },
    closePostForm () {
      this.postFormOpen = false
      this.hidden = false
    },
    handleScroll: throttle(function () {
      const scrollAmount = window.scrollY - this.oldScrollPos
      const scrollingDown = scrollAmount > 0

      if (scrollingDown !== this.scrollingDown) {
        this.amountScrolled = 0
        this.scrollingDown = scrollingDown
        if (!scrollingDown) {
          this.hidden = false
        }
      } else if (scrollingDown) {
        this.amountScrolled += scrollAmount
        if (this.amountScrolled > 100 && !this.hidden) {
          this.hidden = true
        }
      }

      this.oldScrollPos = window.scrollY
      this.scrollingDown = scrollingDown
    }, 100)
  }
}

export default MobilePostStatusModal
