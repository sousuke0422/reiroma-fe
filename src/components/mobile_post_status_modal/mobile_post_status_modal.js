import PostStatusForm from '../post_status_form/post_status_form.vue'
import { throttle } from 'lodash'

const MobilePostStatusModal = {
  components: {
    PostStatusForm
  },
  data () {
    return {
      shown: true,
      postFormOpen: false,
      oldScrollPos: 0,
      scrollDirection: -1,
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
      this.shown = false

      const el = this.$el.querySelector('textarea')
      this.$nextTick(function () {
        el.focus()
      })
    },
    closePostForm () {
      this.postFormOpen = false
      this.shown = true
    },
    handleScroll: throttle(function () {
      const scrollAmount = window.scrollY - this.oldScrollPos
      const direction = scrollAmount > 0 ? 1 : -1

      if (direction !== this.scrollDirection) {
        this.amountScrolled = 0
        this.scrollDirection = direction
        if (direction === -1) {
          this.shown = true
        }
      } else if (direction === 1) {
        this.amountScrolled += scrollAmount
        if (this.amountScrolled > 100 && this.shown) {
          this.shown = false
        }
      }

      this.oldScrollPos = window.scrollY
      this.scrollDirection = direction
    }, 100)
  }
}

export default MobilePostStatusModal
