<template>
  <div class="poll-form" v-if="visible">
    <div class="poll-option" v-for="(option, index) in options" :key="index">
      <div class="input-container">
        <input
          class="poll-option-input"
          type="text"
          :placeholder="$t('polls.option')"
          :maxlength="maxLength"
          :id="`poll-${index}`"
          v-model="options[index]"
          @change="updatePollToParent"
          @keydown.enter.stop.prevent="nextOption(index)"
        >
      </div>
      <div class="icon-container" v-if="options.length > 2">
        <i class="icon-cancel" @click="deleteOption(index)"></i>
      </div>
    </div>
    <a
      v-if="options.length < maxOptions"
      class="add-option"
      @click="addOption"
    >
      <i class="icon-plus" />
      {{ $t("polls.add_option") }}
    </a>
    <div class="poll-type-expiry">
      <div class="poll-type">
        <label for="poll-type-selector" class="select">
          <select class="select" v-model="pollType" @change="updatePollToParent">
            <option value="single">{{$t('polls.single_choice')}}</option>
            <option value="multiple">{{$t('polls.multiple_choices')}}</option>
          </select>
          <i class="icon-down-open"/>
        </label>
      </div>
      <div class="poll-expiry">
        <input 
          type="number"
          class="expiry-amount hide-number-spinner"
          min="1"
          max="120"
          v-model="expiryAmount"
          @change="expiryAmountChange"
        >
        <label class="expiry-unit select">
          <select v-model="expiryUnit" @change="updatePollToParent">
            <option v-for="unit in expiryUnits" :value="unit">
              {{ $t(`time.${unit}_short`, ['']) }}
            </option>
          </select>
          <i class="icon-down-open"/>
        </label>
      </div>
    </div>
  </div>
</template>

<script>
import * as DateUtils from 'src/services/date_utils/date_utils'

export default {
  name: 'PollForm',
  props: ['visible'],
  data: () => ({
    pollType: 'single',
    options: ['', ''],
    expiryAmount: 2,
    expiryUnit: 'hours',
    expiryUnits: ['minutes', 'hours', 'days']
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
    }
  },
  methods: {
    clear () {
      this.pollType = 'single'
      this.options = ['', '']
      this.expiryAmount = 1
      this.expiryUnit = 'minutes'
    },
    nextOption (index) {
      const element = this.$el.querySelector(`#poll-${index+1}`)
      if (element) {
        element.focus()
      } else {
        // Try adding an option and try focusing on it
        const addedOption = this.addOption()
        if (addedOption) {
          this.$nextTick(function () {
            this.nextOption(index)
          })
        }
      }
    },
    addOption () {
      if (this.options.length < this.maxOptions) {
        this.options.push('')
        return true
      }
      return false
    },
    deleteOption (index, event) {
      if (this.options.length > 2) {
        this.options.splice(index, 1)
      }
    },
    expiryAmountChange () {
      this.expiryAmount = Math.max(1, this.expiryAmount)
      this.expiryAmount = Math.min(120, this.expiryAmount)
      this.updatePollToParent()
    },
    updatePollToParent () {
      const unitMultiplier = this.expiryUnit === 'minutes' ? 60
        : this.expiryUnit === 'hours' ? 60 * 60
        : 60 * 60 * 24

      const expiresIn = this.expiryAmount * unitMultiplier

      this.$emit('update-poll', {
        options: this.options,
        multiple: this.pollType === 'multiple',
        expiresIn
      })
    }
  }
}
</script>

<style lang="scss">
@import '../../../_variables.scss';

.poll-form {
  display: flex;
  flex-direction: column;
  padding: 0 0.5em 0.5em;

  .add-option {
    align-self: flex-start;
    padding-top: 0.25em;
    cursor: pointer;
    color: $fallback--faint;
    color: var(--faint, $fallback--faint);
  }

  .poll-option {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 0.25em;
  }

  .input-container {
    width: 100%;
    input {
      width: 100%;
    }
  }

  .icon-container {
    // Move the icon over the input box
    width: 2em;
    margin-left: -2em;
    z-index: 1;
  }

  .poll-type-expiry {
    margin-top: 0.5em;
    display: flex;
    width: 100%;
  }

  .poll-type {
    margin-right: 0.75em;
    flex: 1 1 60%;
    .select {
      border: none;
      box-shadow: none;
      background-color: transparent;
    }
  }

  .poll-expiry {
    display: flex;

    .expiry-amount {
      width: 3em;
    }

    .expiry-unit {
      border: none;
      box-shadow: none;
      background-color: transparent;
    }
  }
}
</style>
