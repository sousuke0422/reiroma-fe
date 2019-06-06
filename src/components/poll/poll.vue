<template>
  <poll-results
    v-if="currentUserHasVoted"
    :poll="poll"
    :status-id="statusId"
    v-on:poll-refreshed="handlePollUpdate"
  />
  <poll-vote
    v-else
    :poll="poll"
    :status-id="statusId"
    v-on:user-has-voted="handlePollUpdate"
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
      console.log('currentUserHasVoted poll', this.poll)
      return this.poll.voted
    },
    voted () {
      return this.poll.voted
    }
  },
  methods: {
    handlePollUpdate (poll) {
      // this.poll = poll
    }
  }
}
</script>
