<template>
  <div class="poll-results">
    <div class="votes">
      <div
        class="poll-option"
        v-for="(pollOption, index) in poll.options"
        :key="index">
          <div class="col">{{percentageForOption(pollOption.votes_count)}}%</div>
          <div class="col">{{pollOption.title}}</div>
          <div class="col"><progress :max="totalVotesCount" :value="pollOption.votes_count"></progress></div>
      </div>
    </div>
    <footer>
      <div class="refresh">
        <a href="#" @click="fetchPoll(poll.id)">Refresh</a>&nbsp;·&nbsp;
      </div>
      <div class="total">
        {{totalVotesCount}} {{ $t("polls.votes") }}
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PollResults',
  props: ['poll'],
  created () {
    console.log(this.poll)
  },
  computed: {
    totalVotesCount () {
      return this.poll.votes_count
    }
  },
  methods: {
    percentageForOption (count) {
      return (this.totalVotesCount === 0 ? 0 : (count / this.totalVotesCount * 100)).toFixed(1)
    },
    async fetchPoll (pollID) {
      const poll = await this.$store.state.api.backendInteractor.fetchPoll(pollID)
      console.log(poll)
      this.$emit('poll-refreshed', poll)
    }
  }
}
</script>

<style lang="scss">
.poll-results {
  margin: 0.7em 0;
  .votes {
    display: table;
    width: 100%;
    margin: 0 0 0.5em;
  }
  .poll-option {
    display: table-row;
    .col {
      display: table-cell;
      padding: 0.7em 0.5em;
    }
  }
  footer {
    display: flex;
  }
}
</style>
