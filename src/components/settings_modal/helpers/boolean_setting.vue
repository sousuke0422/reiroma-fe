<template>
  <label
    class="BooleanSetting"
  >
    <Checkbox
      :checked="state"
      @change="update"
      :disabled="disabled"
    >
      <span
        v-if="!!$slots.default"
        class="label"
        >
        <slot />
      </span>
      <ModifiedIndicator :changed="isChanged" />
    </Checkbox>
  </label>
</template>

<script>
import { get, set } from 'lodash'
import Checkbox from 'src/components/checkbox/checkbox.vue'
import ModifiedIndicator from './modified_indicator.vue'
export default {
  props: [
    'path',
    'disabled'
  ],
  components: {
    Checkbox,
    ModifiedIndicator
  },
  computed: {
    pathDefault () {
      const [firstSegment, ...rest] = this.path.split('.')
      return [firstSegment + 'DefaultValue', ...rest].join('.')
    },
    state () {
      return get(this.$parent, this.path)
    },
    isChanged () {
      return get(this.$parent, this.path) !== get(this.$parent, this.pathDefault)
    }
  },
  methods: {
    update (e) {
      set(this.$parent, this.path, e)
    }
  }
}
</script>

<style lang="scss">
.BooleanSetting {
}
</style>
