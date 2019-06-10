import Timeago from '../timeago/timeago.vue'

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
        .map((entry, index) => index)
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
      return this.totalVotesCount === 0 ? 0 : Math.round((count + 5) / (this.totalVotesCount + 10) * 100)
    },
    resultTitle (option) {
      return `${option.votes_count}/${this.totalVotesCount} ${this.$t('polls.votes')}`
    },
    fetchPoll () {
      this.$store.dispatch('refreshPoll', { id: this.statusId, pollId: this.poll.id })
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