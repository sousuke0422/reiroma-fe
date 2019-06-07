<template>
  <div class="poll-form" v-if="visible">
    <hr>
    <div class="poll-option" v-for="(option, index) in options" :key="index">
      <div class="input-container">
        <input
          class="poll-option-input"
          type="text"
          :placeholder="$t('polls.option')"
          :maxlength="maxLength"
          v-model="options[index]"
          @change="updatePollToParent"
        >
      </div>
      <div class="icon-container" v-if="options.length > 2">
        <i class="icon-cancel" @click="deleteOption(index)"></i>
      </div>
    </div>
    <button
      class="btn btn-default add-option"
      type="button"
      @click="addOption"
    >{{ $t("polls.add_option") }}</button>
    <div class="poll-type-expiry">
      <div class="poll-type">
        <label for="poll-type-selector" class="select">
          <select id="poll-type-selector" v-model="pollType" @change="updatePollToParent">
            <option value="single">{{$t('polls.single_choice')}}</option>
            <option value="multiple">{{$t('polls.multiple_choices')}}</option>
          </select>
          <i class="icon-down-open"/>
        </label>
      </div>
      <div class="poll-expiry">
        <label for="poll-expiry-selector" class="select">
          <select id="poll-expiry-selector" v-model="pollExpiry" @change="updatePollToParent">
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
    pollExpiry: '86400',
    options: ['', '']
  }),
  computed: {
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
    addOption () {
      if (this.options.length < this.maxOptions) {
        this.options.push('')
      }
    },
    deleteOption (index, event) {
      if (this.options.length > 2) {
        this.options.splice(index, 1)
      }
    },
    updatePollToParent () {
      this.$emit('update-poll', {
        options: this.options,
        expiresIn: this.pollExpiry,
        multiple: this.pollType === 'multiple'
      })
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
