<template>
  <time :datetime="time" :title="localeDateString">
    {{ $t(relativeTime.key, [relativeTime.num]) }}
  </time>
</template>

<script>
import * as DateUtils from 'src/services/date_utils/date_utils.js'

export default {
  name: 'Timeago',
  props: ['time', 'autoUpdate', 'longFormat'],
  data () {
    return {
      relativeTime: { key: 'time.now', num: 0 },
      interval: null
    }
  },
  created () {
    this.refreshRelativeTimeObject()
  },
  destroyed () {
    clearTimeout(this.interval)
  },
  computed: {
    localeDateString () {
      return typeof this.time === 'string'
        ? new Date(Date.parse(this.time)).toLocaleString()
        : this.time.toLocaleString()
    },
    relativeTimeObject () {
      return this.longFormat
        ? DateUtils.relativeTime(this.time)
        : DateUtils.relativeTimeShort(this.time)
    }
  },
  methods: {
    refreshRelativeTimeObject () {
      this.relativeTime = this.longFormat
        ? DateUtils.relativeTime(this.time)
        : DateUtils.relativeTimeShort(this.time)

      if (this.autoUpdate) {
        this.interval = setTimeout(
          this.refreshRelativeTimeObject,
          1000 * this.autoUpdate
        )
      }
    }
  }
}
</script>