<template>
  <poll-results v-if="currentUserHasVoted" :poll="poll" />
  <poll-vote v-else :poll="poll" />
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
      return false
    }
  }
}
</script>
