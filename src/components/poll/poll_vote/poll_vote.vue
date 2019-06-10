<template>
  <div class="poll-vote" v-bind:class="containerClass">
    <div
      class="poll-choice"
      v-for="(option, index) in poll.options"
      :key="index"
    >
      <div v-if="showResults" :title="resultTitle(option)">
        <div class="vote-label">
          <span>{{percentageForOption(option.votes_count)}}%</span>
          <span>{{option.title}}</span>
        </div>
        <div class="fill" :style="{ 'width': `${percentageForOption(option.votes_count)}%` }"></div> 
      </div>
      <div v-else>
        <input
          v-if="poll.multiple"
          type="checkbox"
          :id="optionId(index)"
          :disabled="loading"
          :value="option.title"
          v-model="multipleChoices[index]"
        >
        <input
          v-else
          type="radio"
          :id="optionId(index)"
          :disabled="loading"
          :value="index"
          v-model="singleChoiceIndex"
        >
        <label :for="optionId(index)">
          {{option.title}}
        </label>
      </div>
    </div>
    <div class="footer">
      <button
        class="btn btn-default poll-vote-button"
        type="button"
        @click="vote"
        :disabled="isDisabled"
      >
        {{$t('polls.vote')}}
      </button>
      <Timeago :time="this.poll.expires_at" :auto-update="1"></Timeago>
    </div>
  </div>
</template>

<script>
import Timeago from '../../timeago/timeago.vue'

export default {
  name: 'PollVote',
  props: ['poll', 'statusId'],
  components: { Timeago },
  data () {
    return {
      loading: false,
      multipleChoices: [],
      singleChoiceIndex: undefined
    }
  },
  computed: {
    expired () {
      return new Date() > this.poll.expires_at
    },
    showResults () {
      return this.poll.voted || this.expired
    },
    totalVotesCount () {
      return this.poll.votes_count
    },
    timeleft () {
      const expiresAt = new Date(this.poll.expires_at)
      return expiresAt
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
      return this.multipleChoices.map((entry, index) => index).filter(value => typeof value === 'number')
    },
    isDisabled () {
      const noChoice = this.poll.multiple ? this.choiceIndices.length === 0 : this.singleChoiceIndex === undefined
      return this.loading || noChoice
    }
  },
  methods: {
    percentageForOption (count) {
      return this.totalVotesCount === 0 ? 0 : Math.round(count / this.totalVotesCount * 100)
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

.poll-vote {
  margin: 0.7em 0 0;

  &.loading * {
    cursor: progress;
  }
  .poll-choice {
    padding: 0.4em 0;
  }
  .poll-vote-button {
    margin: 1em 0 0;
  }
}
</style>
