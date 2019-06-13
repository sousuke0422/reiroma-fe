export default {
  name: 'PollForm',
  props: ['visible'],
  data: () => ({
    pollType: 'single',
    options: ['', ''],
    expiryAmount: 2,
    expiryUnit: 'hours',
    expiryUnits: ['minutes', 'hours', 'days']
  }),
  computed: {
    pollLimits () {
      return this.$store.state.instance.pollLimits
    },
    maxOptions () {
      return this.pollLimits.max_options
    },
    maxLength () {
      return this.pollLimits.max_option_chars
    }
  },
  methods: {
    clear () {
      this.pollType = 'single'
      this.options = ['', '']
      this.expiryAmount = 1
      this.expiryUnit = 'minutes'
    },
    nextOption (index) {
      const element = this.$el.querySelector(`#poll-${index+1}`)
      if (element) {
        element.focus()
      } else {
        // Try adding an option and try focusing on it
        const addedOption = this.addOption()
        if (addedOption) {
          this.$nextTick(function () {
            this.nextOption(index)
          })
        }
      }
    },
    addOption () {
      if (this.options.length < this.maxOptions) {
        this.options.push('')
        return true
      }
      return false
    },
    deleteOption (index, event) {
      if (this.options.length > 2) {
        this.options.splice(index, 1)
      }
    },
    expiryAmountChange () {
      this.expiryAmount = Math.max(1, this.expiryAmount)
      this.expiryAmount = Math.min(120, this.expiryAmount)
      this.updatePollToParent()
    },
    updatePollToParent () {
      const unitMultiplier = this.expiryUnit === 'minutes' ? 60
        : this.expiryUnit === 'hours' ? 60 * 60
          : 60 * 60 * 24

      const expiresIn = this.expiryAmount * unitMultiplier

      this.$emit('update-poll', {
        options: this.options,
        multiple: this.pollType === 'multiple',
        expiresIn
      })
    }
  }
}
