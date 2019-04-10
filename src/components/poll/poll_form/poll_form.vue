<template>
  <div class="poll-form" v-if="visible">
    <hr />
    <div class="poll-option"
      v-for="(option, index) in options"
      :key="index">
      <div class="input-container">
        <input
          class="poll-option-input"
          type="text"
          :placeholder="$t('polls.option')"
          @input="onUpdateOption($event, index)"
          :value="option" />
      </div>
      <div class="icon-container">
        <i class="icon-cancel" @click="onDeleteOption(index)"></i>
      </div>
    </div>
    <button
      class="btn btn-default add-option"
      type="button"
      @click="onAddOption">{{ $t("polls.add_option") }}
    </button>
  </div>
</template>

<script>
// TODO: Make this configurable
const maxOptions = 10

export default {
  name: 'PollForm',
  props: ['visible'],
  computed: {
    optionsLength: function () {
      return this.$store.state.poll.pollOptions.length
    },
    options: function () {
      return this.$store.state.poll.pollOptions
    }
  },
  methods: {
    onAddOption () {
      if (this.optionsLength < maxOptions) {
        this.$store.dispatch('addPollOption', { option: '' })
      }
    },
    onDeleteOption (index) {
      if (this.optionsLength > 1) {
        this.$store.dispatch('deletePollOption', { index })
      }
    },
    onUpdateOption (e, index) {
      this.$store.dispatch('updatePollOption', { index, option: e.target.value })
    }
  }
}
</script>

<style lang="scss">
.poll-form {
  padding: 0 0.5em 0.6em;
  hr {
    margin: 0 0 0.8em;
    border: solid 1px #1c2735;
  }
  .add-option {
    margin: 0.8em 0 0;
    width: 94%;
  }
  .poll-option {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
  }
  .input-container {
    width: 94%;
    input {
      width: 100%;
    }
  }
  .icon-container {
    width: 5%;
  }
}
</style>
