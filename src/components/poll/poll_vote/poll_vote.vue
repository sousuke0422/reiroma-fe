<template>
  <form class="poll-vote" v-bind:class="containerClass">
    <div
      class="poll-choice"
      v-for="(option, index) in poll.options"
      :key="index"
    >
      <input
        v-if="poll.multiple"
        type="checkbox"
        name="choice"
        :id="index"
        :disabled="loading"
        :value="option.title"
        v-model="multipleChoices[index]"
      >
      <input
        v-else
        type="radio"
        name="choice"
        :id="index"
        :disabled="loading"
        :value="index"
        v-model="singleChoiceIndex"
      >
      <label :for="index">
        {{option.title}}
      </label>
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
  </form>
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
