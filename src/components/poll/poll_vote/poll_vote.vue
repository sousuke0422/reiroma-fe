<template>
  <div class="poll-vote" v-bind:class="containerClass">
    <div
      class="poll-choice"
      v-for="(pollOption, index) in poll.options"
      :key="index">
        <input
          :disabled="loading"
          type="checkbox"
          :id="optionID(index)"
          :value="pollOption.title"
          name="choice"
          v-model="checks[index]"
        >
        <label :for="optionID(index)">{{pollOption.title}}</label>
    </div>
    <button class="btn btn-default poll-vote-button" @click="onVote">{{$t('polls.vote')}}</button>
  </div>
</template>

<script>
export default {
  name: 'PollVote',
  props: ['poll'],
  data () {
    return {
      loading: false,
      checks: []
    }
  },
  computed: {
    containerClass: function () {
      return {
        loading: this.loading
      }
    }
  },
  methods: {
    optionID (index) {
      return `pollOption${this.poll.id}#${index}`
    },
    async onVote () {
      this.loading = true

      const choices = this.checks.filter(_=>_).map((entry, index) => index)
      const poll = await this.$store.state.api.backendInteractor.vote(this.poll.id, choices)

      this.loading = false
      this.$emit('user-has-voted', poll)
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
