<template>
  <div class="poll-container">
    <hr />
    <div class="poll-option"
      v-for="(option, index) in options"
      :key="index">
      <div class="input-container">
        <input
          class="poll-option-input"
          type="text"
          :placeholder="$t('polls.option')"
          v-model="options[index]" />
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
  name: 'PollContainer',
  data () {
    return {
      options: ['', '']
    }
  },
  computed: {
    optionsLength: function () {
      return this.$data.options.length
    }
  },
  methods: {
    onAddOption () {
      if (this.optionsLength < maxOptions) {
        this.$data.options.push('')
      }
    },
    onDeleteOption (index) {
      if (this.optionsLength > 1) {
        this.$data.options.splice(index, 1)
      }
    }
  }
}
</script>

<style lang="scss">
.poll-container {
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
