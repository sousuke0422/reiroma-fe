<template>
  <form class="poll-vote" v-bind:class="containerClass">
    <div
      class="poll-choice"
      v-for="(pollOption, index) in poll.options"
      :key="index"
    >
      <input
        type="checkbox"
        name="choice"
        :id="index"
        :disabled="loading"
        :value="pollOption.title"
        v-model="checks[index]"
      >
      <label :for="index">
        {{pollOption.title}}
      </label>
    </div>
    <button class="btn btn-default poll-vote-button" type="button" @click="vote">{{$t('polls.vote')}}</button>
  </form>
</template>

<script>
export default {
  name: 'PollVote',
  props: ['poll', 'statusId'],
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
    vote () {
      this.loading = true

      const choices = this.checks.map((entry, index) => index).filter(value => typeof value === 'number')
      this.$store.dispatch('votePoll', { id: this.statusId, pollId: this.poll.id, choices }).then(poll => {
        this.loading = false
      })
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
