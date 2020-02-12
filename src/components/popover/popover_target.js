const PopoverTarget = {
  name: 'PopoverTarget',
  computed: {
    ids () {
      const popovers = this.$store.state.popover.popovers
      return Object.keys(popovers)
    },
    styles () {
      return this.ids.reduce((acc, id) => {
        const el = this.$store.state.popover.popovers[id]
        const box = el.getBoundingClientRect()
        acc[id] = {
          top: `${box.y}px`,
          left: `${box.x}px`
        }
        console.log(acc)
        return acc
      }, {})
    }
  }
}

export default PopoverTarget
