
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
      styles: { opacity: 0 },
      oldSize: { width: 0, height: 0 }
    }
  },
  computed: {
    display () {
      return !this.hidden
    }
  },
  methods: {
    updateStyles () {
      if (this.hidden) return { opacity: 0 }

      // Popover will be anchored around this element
      const anchorEl = this.$refs.trigger || this.$el
      const screenBox = anchorEl.getBoundingClientRect()
      // Screen position of the origin point for popover
      const origin = { x: screenBox.left + screenBox.width * 0.5, y: screenBox.top }
      const content = this.$refs.content
      // Minor optimization, don't call a slow reflow call if we don't have to
      const parentBounds =
        (this.boundTo.x === 'container' || this.boundTo.y === 'container') &&
        this.$el.offsetParent.getBoundingClientRect()
      const padding = this.padding || {}

      // What are the screen bounds for the popover? Viewport vs container
      // when using viewport, using default padding values to dodge the navbar
      const xBounds = this.boundTo.x === 'container' ? {
        min: parentBounds.left + (padding.left || 0),
        max: parentBounds.right - (padding.right || 0)
      } : {
        min: 0 + (padding.left || 10),
        max: window.innerWidth - (padding.right || 10)
      }

      const yBounds = this.boundTo.y === 'container' ? {
        min: parentBounds.top + (padding.top || 0),
        max: parentBounds.bottom - (padding.bottom || 0)
      } : {
        min: 0 + (padding.top || 50),
        max: window.innerHeight - (padding.bottom || 5)
      }

      let horizOffset = 0

      // If overflowing from left, move it so that it doesn't
      if ((origin.x - content.offsetWidth * 0.5) < xBounds.min) {
        horizOffset = -(origin.x - content.offsetWidth * 0.5) + xBounds.min
      }

      // If overflowing from right, move it so that it doesn't
      if ((origin.x + horizOffset + content.offsetWidth * 0.5) > xBounds.max) {
        horizOffset -= (origin.x + horizOffset + content.offsetWidth * 0.5) - xBounds.max
      }

      // Default to whatever user wished with placement prop
      let usingTop = this.placement !== 'bottom'

      // Handle special cases, first force to displaying on top if there's not space on bottom,
      // regardless of what placement value was. Then check if there's not space on top, and
      // force to bottom, again regardless of what placement value was.
      if (origin.y + content.offsetHeight > yBounds.max) usingTop = true
      if (origin.y - content.offsetHeight < yBounds.min) usingTop = false

      const yOffset = (this.offset && this.offset.y) || 0
      const translateY = usingTop
        ? -anchorEl.offsetHeight - yOffset - content.offsetHeight
        : yOffset + yOffset

      const xOffset = (this.offset && this.offset.x) || 0
      const translateX = (+anchorEl.offsetWidth * 0.5) - content.offsetWidth * 0.5 + horizOffset + xOffset

      this.styles = {
        opacity: 1,
        transform: `translate(${Math.floor(translateX)}px, ${Math.floor(translateY)}px)`
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
  updated () {
    // Monitor changes to content size, update styles only when content sizes have changed,
    // that should be the only time we need to move the popover box if we don't care about scroll
    // or resize
    const content = this.$refs.content
    if (!content) return
    if (this.oldSize.width !== content.offsetWidth || this.oldSize.height !== content.offsetHeight) {
      this.updateStyles()
      this.oldSize = { width: content.offsetWidth, height: content.offsetHeight }
    }
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
