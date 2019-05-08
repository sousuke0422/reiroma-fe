<template>
  <div class="poll-form" v-if="visible">
    <hr>
    <div class="poll-option" v-for="(option, index) in options" :key="index">
      <div class="input-container">
        <input
          class="poll-option-input"
          type="text"
          :placeholder="$t('polls.option')"
          @input="onUpdateOption($event, index)"
          :value="option"
          :maxlength="maxLength"
        >
      </div>
      <div class="icon-container">
        <i class="icon-cancel" @click="onDeleteOption(index)"></i>
      </div>
    </div>
    <button
      class="btn btn-default add-option"
      type="button"
      @click="onAddOption"
    >{{ $t("polls.add_option") }}</button>
    <div class="poll-type-expiry">
      <div class="poll-type">
        <label for="poll-type-selector" class="select">
          <select id="poll-type-selector" v-model="pollType" @change="onTypeChange">
            <option value="single">{{$t('polls.single_choice')}}</option>
            <option value="multiple">{{$t('polls.multiple_choices')}}</option>
          </select>
          <i class="icon-down-open"/>
        </label>
      </div>
      <div class="poll-expiry">
        <label for="poll-expiry-selector" class="select">
          <select id="poll-expiry-selector" v-model="pollExpiry" @change="onExpiryChange">
            <option v-for="(value, key) in expiryOptions" :value="key" v-bind:key="key">
              {{ value }}
            </option>
          </select>
          <i class="icon-down-open"/>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import { pickBy } from 'lodash'

export default {
  name: 'PollForm',
  props: ['visible'],
  data: () => ({
    pollType: 'single',
    pollExpiry: '86400'
  }),
  computed: {
    optionsLength () {
      return this.$store.state.poll.options.length
    },
    options () {
      return this.$store.state.poll.options
    },
    pollLimits () {
      return this.$store.state.instance.pollLimits
    },
    maxOptions () {
      return this.pollLimits.max_options
    },
    maxLength () {
      return this.pollLimits.max_option_chars
    },
    expiryOptions () {
      const minExpiration = this.pollLimits.min_expiration
      const maxExpiration = this.pollLimits.max_expiration
      const expiryOptions = this.$t('polls.expiry_options')

      return pickBy(expiryOptions, (_value, key) => {
        if (key === 'custom') {
          return true
        }

        const parsedKey = parseInt(key)

        return (parsedKey >= minExpiration && parsedKey <= maxExpiration)
      })
    }
  },
  methods: {
    onAddOption () {
      if (this.optionsLength < this.maxOptions) {
        this.$store.dispatch('addPollOption', { option: '' })
      }
    },
    onDeleteOption (index) {
      if (this.optionsLength > 1) {
        this.$store.dispatch('deletePollOption', { index })
      }
    },
    onUpdateOption (e, index) {
      this.$store.dispatch('updatePollOption', {
        index,
        option: e.target.value
      })
    },
    onTypeChange (e) {
      const multiple = e.target.value === 'multiple'

      this.$store.dispatch('setMultiple', { multiple })
    },
    onExpiryChange (e) {
      this.$store.dispatch('setExpiresIn', { expiresIn: e.target.value })
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
    margin: 0.8em 0 0.8em;
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
  .poll-type-expiry {
    display: flex;
    justify-content: space-between;
    margin: 0 0 0.6em;
  }
  .poll-expiry-custom {
    display: none;
    input {
      width: 100%;
    }
  }
}
</style>
