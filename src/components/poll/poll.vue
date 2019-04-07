<template>
  <poll-results v-if="currentUserHasVoted" :poll="poll" />
  <poll-vote
    v-else
    :poll="poll"
    v-on:user-has-voted="onUserVote" />
</template>

<script>
import PollResults from './poll_results/poll_results.vue'
import PollVote from './poll_vote/poll_vote.vue'

export default {
  name: 'Poll',
  props: ['poll'],
  components: {
    PollResults,
    PollVote
  },
  computed: {
    currentUserHasVoted () {
      return this.poll.user_voted
    }
  },
  methods: {
    onUserVote (poll) {
      this.poll = poll
    }
  }
}
</script>
