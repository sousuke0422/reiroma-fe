<template>
  <poll-results
    v-if="currentUserHasVoted"
    :poll="poll"
    :status-id="statusId"
  />
  <poll-vote
    v-else
    :poll="poll"
    :status-id="statusId"
  />
</template>

<script>
import PollResults from './poll_results/poll_results.vue'
import PollVote from './poll_vote/poll_vote.vue'

export default {
  name: 'Poll',
  props: ['poll', 'statusId'],
  components: {
    PollResults,
    PollVote
  },
  computed: {
    currentUserHasVoted () {
      return this.poll.voted
    },
    voted () {
      return this.poll.voted
    }
  },
}
</script>
