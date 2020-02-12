
const Popover = {
  name: 'Popover',
  props: [
    'trigger',
    'placement',
    'show'
  ],
  data () {
    return {
      hidden: true,
      styles: { opacity: 0 }
    }
  },
  computed: {
    display () {
      return !this.hidden
    }
  },
  methods: {
    /*
    registerPopover (e) {
      if (!this.targetId) {
        this.$store.dispatch('registerPopover', e.target).then(id => this.targetId = id)
      }
    },
    unregisterPopover () {
      if (this.targetId) {
        this.$store.dispatch('unregisterPopover', this.targetId)
        this.targetId = null
      }
    },
    */
    showPopover () {
      this.hidden = false
      this.$nextTick(function () {
        if (this.hidden) return { opacity: 0 }

        const anchorEl = this.$refs.trigger || this.$el
        console.log(anchorEl)
        const screenBox = anchorEl.getBoundingClientRect()
        const origin = { x: screenBox.left + screenBox.width * 0.5, y: screenBox.top}
        const content = this.$refs.content
        let horizOffset = 0

        if ((origin.x - content.offsetWidth * 0.5) < 25) {
          horizOffset += -(origin.x - content.offsetWidth * 0.5) + 25
        }

        console.log((origin.x + content.offsetWidth * 0.5), (window.innerWidth - 25))
        if ((origin.x + content.offsetWidth * 0.5) > window.innerWidth - 25) {
          horizOffset -= (origin.x + content.offsetWidth * 0.5) - (window.innerWidth - 25)
        }
        // Default to whatever user wished with placement prop
        let usingTop = this.placement !== 'bottom'

        // Handle special cases, first force to displaying on top if there's not space on bottom,
        // regardless of what placement value was. Then check if there's not space on top, and
        // force to bottom, again regardless of what placement value was.
        if (origin.y + content.offsetHeight > (window.innerHeight - 25)) usingTop = true
        if (origin.y - content.offsetHeight < 50) usingTop = false

        const vertAlign = usingTop ?
          {
            bottom: `${anchorEl.offsetHeight}px`
          } :
          {
            top: `${anchorEl.offsetHeight}px`
          }
        this.styles = {
          opacity: '100%',
          left: `${(anchorEl.offsetLeft + anchorEl.offsetWidth * 0.5) - content.offsetWidth * 0.5 + horizOffset}px`,
          ...vertAlign
        }
      })
    },
    hidePopover () {
      this.hidden = true
      this.styles = { opacity: 0 }
    },
    onMouseenter (e) {
      console.log(this.trigger)
      if (this.trigger === 'hover') this.showPopover()
    },
    onMouseleave (e) {
      if (this.trigger === 'hover') this.hidePopover()
    },
    onClick (e) {
      if (this.trigger === 'click') {
        if (this.hidden) {
          this.showPopover()
        } else {
          this.hidePopover()
        }
      }
    },
    onClickOutside (e) {
      if (this.hidden) return
      if (this.$el.contains(e.target)) return
      console.log(e.target)
      this.hidePopover()
    }
  },
  created () {
    document.addEventListener("click", this.onClickOutside)
  },
  destroyed () {
    document.removeEventListener("click", this.onClickOutside)
    this.hidePopover()
  }
}

export default Popover
