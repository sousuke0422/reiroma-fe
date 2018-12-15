import Vue from 'vue'

import './tab_switcher.scss'

export default Vue.component('tab-switcher', {
  name: 'TabSwitcher',
  data () {
    return {
      active: 0,
      scrollLeft: 0,
      scrollWidth: 0,
      clientWidth: 0
    }
  },
  methods: {
    activateTab(index) {
      return () => this.active = index;
    },
    scrollToLeft() {
      this.$refs.handles.scrollLeft -= 40
      this.scrollLeft = this.$refs.handles.scrollLeft
    },
    scrollToRight() {
      this.$refs.handles.scrollLeft += 40
      this.scrollLeft = this.$refs.handles.scrollLeft
    },
    onResize() {
      this.scrollLeft = this.$refs.handles.scrollLeft
      this.scrollWidth = this.$refs.handles.scrollWidth
      this.clientWidth = this.$refs.handles.clientWidth
      console.log(this.scrollWidth, this.clientWidth)
    },
    onScroll() {
      this.scrollLeft = this.$refs.handles.scrollLeft
    }
  },
  computed: {
    showScroll () {
      return this.scrollWidth > this.clientWidth
    },
    maxScrollLeft () {
      return this.scrollWidth - this.clientWidth
    },
    scrollRightPossible () {
      return this.scrollLeft < this.maxScrollLeft;
    },
    scrollLeftPossible () {
      return this.scrollLeft > 0;
    }
  },
  mounted () {
    window.addEventListener('resize', this.onResize)
    this.onResize();
  },
  destroyed () {
    window.removeEventListener('resize', this.onResize)
  },
  render(h) {
    const tabs = this.$slots.default
          .filter(slot => slot.data)
          .map((slot, index) => {
            const classes = ['tab']

            if (index === this.active) {
              classes.push('active')
            }
            return (
              <div class="tab-handle-wrapper">
                <button onClick={this.activateTab(index)} class={ classes.join(' ') }>
                  {slot.data.attrs.label}
                </button>
              </div>)
          });
    const contents = this.$slots.default.filter(_=>_.data).map(( slot, index ) => {
      const active = index === this.active
      return (
        <div class={active ? 'active' : 'hidden'}>
          {slot}
        </div>
      )
    });
    console.log(this.showScroll)
    return (
      <div class="tab-switcher">
        <div class="tabs">
          <div class="tab-handles" onScroll={this.onScroll} ref="handles">
            {tabs}
          </div>
          <div class="scroll-buttons" class={{ 'scroll-buttons': true, display: this.showScroll}}>
            <div class="left" onClick={this.scrollToLeft}>
              <i class="icon-left-open"></i>
            </div>
            <div class="right" onClick={this.scrollToRight}>
              <i class="icon-right-open"></i>
            </div>
          </div>
        </div>
        <div class="contents">
          {contents}
        </div>
      </div>
    )
  }
})
