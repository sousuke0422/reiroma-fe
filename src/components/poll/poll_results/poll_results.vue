<template>
  <div class="poll-results">
    <div class="votes">
      <div
        class="poll-option"
        v-for="(option, index) in poll.options"
        :key="index"
        :title="`${option.votes_count}/${totalVotesCount} ${$t('polls.votes')}`"
      >
        <div class="vote-label">
          <span>{{percentageForOption(option.votes_count)}}%</span>
          <span>{{option.title}}</span>
        </div>
        <div class="fill" :style="{ 'width': `${percentageForOption(option.votes_count)}%` }"></div>
        
      </div>
    </div>
    <footer>
      <div class="total">
        {{totalVotesCount}} {{ $t("polls.votes") }}&nbsp;·&nbsp;
      </div>
      <div class="refresh">
        <a href="#" @click.stop.prevent="fetchPoll(poll.id)">Refresh</a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'PollResults',
  props: ['poll', 'statusId'],
  computed: {
    totalVotesCount () {
      return this.poll.votes_count
    }
  },
  methods: {
    percentageForOption (count) {
      return this.totalVotesCount === 0 ? 0 : Math.round(count / this.totalVotesCount * 100)
    },
    fetchPoll () {
      this.$store.dispatch('refreshPoll', { id: this.statusId, pollId: this.poll.id })
    }
  }
}
</script>

<style lang="scss">
@import '../../../_variables.scss';

.poll-results {
  .votes {
    display: flex;
    flex-direction: column;
    margin: 0 0 0.5em;
  }
  .poll-option {
    position: relative;
    display: flex;
    flex-direction: row;
    margin-top: 0.25em;
    margin-bottom: 0.25em;
  }
  .fill {
    height: 100%;
    position: absolute;
    background-color: $fallback--lightBg;
    background-color: var(--faintLink, $fallback--lightBg);
    border-radius: $fallback--panelRadius;
    border-radius: var(--panelRadius, $fallback--panelRadius);
    top: 0;
    left: 0;
    transition: width 0.5s;
  }
  .vote-label {
    display: flex;
    align-items: center;
    padding: 0.1em 0.25em;
    z-index: 1;
    span {
      margin-right: 0.5em;
    }
  }
  footer {
    display: flex;
  }
}
</style>
