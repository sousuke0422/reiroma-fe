import Timeago from '../timeago/timeago.vue'
import { forEach } from 'lodash'

export default {
  name: 'Poll',
  props: ['poll', 'statusId'],
  components: { Timeago },
  data () {
    return {
      loading: false,
      multipleChoices: [],
      singleChoiceIndex: null,
      refreshInterval: null
    }
  },
  created () {
    this.refreshInterval = setTimeout(this.refreshPoll, 30 * 1000)
    this.multipleChoices = this.poll.options.map(_ => false)
  },
  destroyed () {
    clearTimeout(this.refreshInterval)
  },
  computed: {
    expired () {
      return Date.now() > Date.parse(this.poll.expires_at)
    },
    showResults () {
      return this.poll.voted || this.expired
    },
    totalVotesCount () {
      return this.poll.votes_count
    },
    expiresAt () {
      return Date.parse(this.poll.expires_at).toLocaleString()
    },
    containerClass () {
      return {
        loading: this.loading
      }
    },
    choiceIndices () {
      return this.multipleChoices
        .map((entry, index) => entry && index)
        .filter(value => typeof value === 'number')
    },
    isDisabled () {
      const noChoice = this.poll.multiple
        ? this.choiceIndices.length === 0
        : this.singleChoiceIndex === undefined
      return this.loading || noChoice
    }
  },
  methods: {
    refreshPoll () {
      if (this.expired) return
      this.fetchPoll()
      this.refreshInterval = setTimeout(this.refreshPoll, 30 * 1000)
    },
    percentageForOption (count) {
      return this.totalVotesCount === 0 ? 0 : Math.round(count / this.totalVotesCount * 100)
    },
    resultTitle (option) {
      return `${option.votes_count}/${this.totalVotesCount} ${this.$t('polls.votes')}`
    },
    fetchPoll () {
      this.$store.dispatch('refreshPoll', { id: this.statusId, pollId: this.poll.id })
    },
    activateOption (index) {
      // forgive me father: doing checking the radio/checkboxes
      // in code because of customized input elements need either
      // a) an extra element for the actual graphic, or b) use a
      // pseudo element for the label. We use b) which mandates
      // using "for" and "id" matching which isn't nice when the
      // same poll appears multiple times on the site (notifs and
      // timeline for example). With code we can make sure it just
      // works without altering the pseudo element implementation.
      const clickedElement = this.$el.querySelector(`input[value="${index}"]`)
      if (this.poll.multiple) {
        // Checkboxes
        const wasChecked = this.multipleChoices[index]
        clickedElement.checked = !wasChecked
        this.$set(this.multipleChoices, index, !wasChecked)
      } else {
        // Radio button
        const allElements = this.$el.querySelectorAll('input')
        forEach(allElements, element => {
          element.checked = false
        })
        clickedElement.checked = true
        this.singleChoiceIndex = index
      }
    },
    optionId (index) {
      return `poll${this.poll.id}-${index}`
    },
    vote () {
      this.loading = true
      if (this.poll.multiple) {
        if (this.choiceIndices.length === 0) return
        this.$store.dispatch(
          'votePoll',
          { id: this.statusId, pollId: this.poll.id, choices: this.choiceIndices }
        ).then(poll => {
          this.loading = false
        })
      } else {
        if (this.singleChoiceIndex === undefined) return
        this.$store.dispatch(
          'votePoll',
          { id: this.statusId, pollId: this.poll.id, choices: [this.singleChoiceIndex] }
        ).then(poll => {
          this.loading = false
        })
      }
    }
  }
}