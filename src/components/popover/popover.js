const Popover = {
  name: 'Popover',
  props: {
    // Action to trigger popover: either 'hover' or 'click'
    trigger: String,
    // Either 'top' or 'bottom'
    placement: String,
    // Takes object with properties 'x' and 'y', values of these can be
    // 'container' for using offsetParent as boundaries for either axis
    // or 'viewport'
    boundTo: Object,
    // Takes a selector to use as a replacement for the parent container
    // for getting boundaries for x an y axis
    boundToSelector: String,
    // Takes a top/bottom/left/right object, how much space to leave
    // between boundary and popover element
    margin: Object,
    // Takes a x/y object and tells how many pixels to offset from
    // anchor point on either axis
    offset: Object,
    // Takes a x/y/h object and tells how much to offset the anchor point
    anchorOffset: Object,
    // Additional styles you may want for the popover container
    popoverClass: String,
    // Time in milliseconds until the popup appears, default is 100ms
    delay: Number,
    // If disabled, don't show popover even when trigger conditions met
    disabled: Boolean
  },
  data () {
    return {
      hidden: true,
      styles: { opacity: 0 },
      oldSize: { width: 0, height: 0 },
      timeout: null
    }
  },
  computed: {
    isMobileLayout () {
      return this.$store.state.interface.mobileLayout
    }
  },
  watch: {
    disabled (newValue, oldValue) {
      if (newValue === true) {
        this.hidePopover()
      }
    }
  },
  methods: {
    containerBoundingClientRect () {
      const container = this.boundToSelector ? this.$el.closest(this.boundToSelector) : this.$el.offsetParent
      return container.getBoundingClientRect()
    },
    updateStyles () {
      if (this.hidden || !(this.$el && this.$el.offsetParent)) {
        this.hidePopover()
        return
      }

      // Popover will be anchored around this element, trigger ref is the container, so
      // its children are what are inside the slot. Expect only one slot="trigger".
      const anchorEl = (this.$refs.trigger && this.$refs.trigger.children[0]) || this.$el
      const screenBox = anchorEl.getBoundingClientRect()
      // Screen position of the origin point for popover
      const anchorOffset = {
        x: (this.anchorOffset && this.anchorOffset.x) || 0,
        y: (this.anchorOffset && this.anchorOffset.y) || 0,
        h: (this.anchorOffset && this.anchorOffset.h) || 0
      }
      const origin = {
        x: screenBox.left + screenBox.width * 0.5 + anchorOffset.x,
        y: screenBox.top + anchorOffset.y
      }
      const content = this.$refs.content
      // Minor optimization, don't call a slow reflow call if we don't have to
      const parentBounds = this.boundTo &&
        (this.boundTo.x === 'container' || this.boundTo.y === 'container') &&
        this.containerBoundingClientRect()

      const margin = this.margin || {}

      // What are the screen bounds for the popover? Viewport vs container
      // when using viewport, using default margin values to dodge the navbar
      const xBounds = this.boundTo && this.boundTo.x === 'container' ? {
        min: parentBounds.left + (margin.left || 0),
        max: parentBounds.right - (margin.right || 0)
      } : {
        min: 0 + (margin.left || 10),
        max: window.innerWidth - (margin.right || 10)
      }

      const yBounds = this.boundTo && this.boundTo.y === 'container' ? {
        min: parentBounds.top + (margin.top || 0),
        max: parentBounds.bottom - (margin.bottom || 0)
      } : {
        min: 0 + (margin.top || 50),
        max: window.innerHeight - (margin.bottom || 5)
      }

      let horizOffset = 0

      // If overflowing from left, move it so that it doesn't
      if ((origin.x - content.offsetWidth * 0.5) < xBounds.min) {
        horizOffset += -(origin.x - content.offsetWidth * 0.5) + xBounds.min
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
      const anchorHeight = anchorOffset.h || anchorEl.offsetHeight
      const translateY = usingTop
        ? -anchorEl.offsetHeight - yOffset - content.offsetHeight + anchorOffset.y
        : -anchorEl.offsetHeight + anchorHeight + yOffset + anchorOffset.y

      const xOffset = (this.offset && this.offset.x) || 0
      const translateX = (anchorEl.offsetWidth * 0.5) - content.offsetWidth * 0.5 + horizOffset + xOffset + anchorOffset.x

      // Note, separate translateX and translateY avoids blurry text on chromium,
      // single translate or translate3d resulted in blurry text.
      this.styles = {
        opacity: 1,
        transform: `translateX(${Math.round(translateX)}px) translateY(${Math.round(translateY)}px)`
      }
    },
    showPopover () {
      if (this.disabled) return
      if (this.hidden) {
        this.$emit('show')
        document.addEventListener('click', this.onClickOutside, true)
      }
      this.hidden = false
      this.$nextTick(this.updateStyles)
    },
    hidePopover () {
      if (!this.hidden) {
        this.$emit('close')
        document.removeEventListener('click', this.onClickOutside, true)
      }
      if (this.timeout) {
        clearTimeout(this.timeout)
        this.timeout = null
      }
      this.hidden = true
      this.styles = { opacity: 0 }
    },
    onMouseenter (e) {
      if (this.trigger === 'hover') {
        this.$emit('enter')
        this.timeout = setTimeout(this.showPopover, this.delay || 100)
      }
    },
    onMouseleave (e) {
      if (this.trigger === 'hover') {
        this.hidePopover()
      }
    },
    onClick (e) {
      if (this.trigger === 'click') {
        if (this.hidden) {
          this.showPopover()
        } else {
          this.hidePopover()
        }
      } else if ((this.trigger === 'hover') && this.isMobileLayout) {
        // This is to enable using hover stuff with mobile:
        // on first touch it opens the popover, when touching the trigger
        // again it will do the click action. Can't use touch events as
        // we can't stop/prevent the actual click which will be handled
        // first.
        if (this.hidden) {
          this.$emit('enter')
          this.showPopover()
          e.preventDefault()
        }
      }
    },
    onClickOutside (e) {
      console.log('onClickOutside')
      if (this.hidden) return
      if (this.$el.contains(e.target)) return
      this.hidePopover()
      e.preventDefault()
      e.stopPropagation()
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
  destroyed () {
    this.hidePopover()
  }
}

export default Popover
