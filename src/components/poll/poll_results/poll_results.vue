<template>
  <div class="poll-results">
    <div class="votes">
      <div
        class="poll-option"
        v-for="(pollOption, index) in poll.votes"
        :key="index">
          <div class="col">{{percentageForOption(pollOption.count)}}%</div>
          <div class="col">{{pollOption.name}}</div>
          <div class="col"><progress :max="totalVotesCount" :value="pollOption.count"></progress></div>
      </div>
    </div>
    <footer>
      <div class="refresh">
        <a href="#">Refresh</a>&nbsp;·&nbsp;
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
  computed: {
    totalVotesCount () {
      return this.poll.votes.reduce((acc, vote) => { return acc + vote.count }, 0)
    }
  },
  methods: {
    percentageForOption: function (count) {
      return (this.totalVotesCount === 0 ? 0 : (count / this.totalVotesCount * 100)).toFixed(1)
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
