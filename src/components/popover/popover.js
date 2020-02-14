
const Popover = {
  name: 'Popover',
  props: [
    'trigger',
    'placement',
    'boundTo',
    'padding',
    'offset',
    'popoverClass'
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
    updateStyles () {
      if (this.hidden) return { opacity: 0 }

      // Popover will be anchored around this element
      const anchorEl = this.$refs.trigger || this.$el
      const screenBox = anchorEl.getBoundingClientRect()
      // Screen position of the origin point for popover
      const origin = { x: screenBox.left + screenBox.width * 0.5, y: screenBox.top }
      const content = this.$refs.content
      const parentBounds = this.boundTo === 'container' && this.$el.offsetParent.getBoundingClientRect()
      const padding = this.padding || {}
      const bounds = this.boundTo === 'container'
        ? {
          xMin: parentBounds.left + (padding.left || 0),
          xMax: parentBounds.right - (padding.right || 0),
          yMin: 0 + (padding.top || 50),
          yMax: window.innerHeight - (padding.bottom || 5)
        } : {
          xMin: 0 + (padding.left || 10),
          xMax: window.innerWidth - (padding.right || 10),
          yMin: 0 + (padding.top || 50),
          yMax: window.innerHeight - (padding.bottom || 5)
        }
      let horizOffset = 0

      console.log(bounds, content.offsetWidth)

      // If overflowing from left, move it
      if ((origin.x - content.offsetWidth * 0.5) < bounds.xMin) {
        horizOffset = -(origin.x - content.offsetWidth * 0.5) + bounds.xMin
      }

      // If overflowing from right, move it
      if ((origin.x + horizOffset + content.offsetWidth * 0.5) > bounds.xMax) {
        horizOffset -= (origin.x + horizOffset + content.offsetWidth * 0.5) - bounds.xMax
      }

      // Default to whatever user wished with placement prop
      let usingTop = this.placement !== 'bottom'

      // Handle special cases, first force to displaying on top if there's not space on bottom,
      // regardless of what placement value was. Then check if there's not space on top, and
      // force to bottom, again regardless of what placement value was.
      if (origin.y + content.offsetHeight > bounds.yMax) usingTop = true
      if (origin.y - content.offsetHeight < bounds.yMin) usingTop = false

      const yOffset = (this.offset && this.offset.y) || 0
      const vertAlign = usingTop
        ? {
          bottom: `${anchorEl.offsetHeight + yOffset}px`
        }
        : {
          top: `${anchorEl.offsetHeight + yOffset}px`
        }
      this.styles = {
        opacity: '100%',
        left: `${(anchorEl.offsetLeft + anchorEl.offsetWidth * 0.5) - content.offsetWidth * 0.5 + horizOffset}px`,
        ...vertAlign
      }
    },
    showPopover () {
      if (this.hidden) this.$emit('show')
      this.hidden = false
      this.$nextTick(this.updateStyles)
    },
    hidePopover () {
      if (!this.hidden) this.$emit('close')
      this.hidden = true
      this.styles = { opacity: 0 }
    },
    onMouseenter (e) {
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
      this.hidePopover()
    }
  },
  beforeUpdate () {
    console.log('beforeupdate')
    // if (!this.hidden) this.$nextTick(this.updateStyles)
  },
  created () {
    document.addEventListener('click', this.onClickOutside)
  },
  destroyed () {
    document.removeEventListener('click', this.onClickOutside)
    this.hidePopover()
  }
}

export default Popover
