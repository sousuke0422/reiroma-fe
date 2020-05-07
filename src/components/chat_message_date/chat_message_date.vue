<template>
  <time>
    {{ displayDate }}
  </time>
</template>

<script>
export default {
  name: 'Timeago',
  props: ['date'],
  computed: {
    displayDate () {
      let today = new Date()
      today.setHours(0, 0, 0, 0)
      if (this.date.getTime() === today.getTime()) {
        return this.$t('display_date.today')
      } else {
        const lang = this.$store.getters.mergedConfig.interfaceLanguage
        return this.date.toLocaleDateString(lang, { day: 'numeric', month: 'long' })
      }
    }
  }
}
</script>
