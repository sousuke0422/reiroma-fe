<template>
  <div class="poll-vote" v-bind:class="containerClass">
    <div
      class="poll-choice"
      v-for="(pollOption, index) in poll.votes"
      :key="index">
        <input
          :disabled="loading"
          type="radio"
          :id="optionID(index)"
          :value="pollOption.name"
          name="choice"
          @change="onChoice">
        <label :for="optionID(index)">{{pollOption.name}}</label>
    </div>
  </div>

</template>

<script>
export default {
  name: 'PollVote',
  props: ['poll'],
  data () {
    return {
      loading: false
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
      return `pollOption${index}`
    },
    onChoice (e) {
      this.loading = true
      console.log(e.target.value)
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
}
</style>
