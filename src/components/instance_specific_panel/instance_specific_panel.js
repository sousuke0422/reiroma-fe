const InstanceSpecificPanel = {
  props: [
    'header'
  ],
  computed: {
    instanceSpecificPanelContent () {
      return this.$store.state.instance.instanceSpecificPanelContent
    },
    sitename () {
      return this.$store.state.instance.name
    }
  }
}

export default InstanceSpecificPanel
