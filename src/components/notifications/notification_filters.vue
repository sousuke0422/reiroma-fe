<template>
  <Popover
    trigger="click"
    class="NotificationFilters"
    placement="bottom"
    :bound-to="{ x: 'container' }"
  >
    <template v-slot:content>
      <div class="dropdown-menu">
        <button
          class="button-default dropdown-item"
          @click="toggleNotificationFilter('likes')"
        >
          <span
            class="menu-checkbox"
            :class="{ 'menu-checkbox-checked': filters.likes }"
          />{{ $t('settings.notification_visibility_likes') }}
        </button>
        <button
          class="button-default dropdown-item"
          @click="toggleNotificationFilter('repeats')"
        >
          <span
            class="menu-checkbox"
            :class="{ 'menu-checkbox-checked': filters.repeats }"
          />{{ $t('settings.notification_visibility_repeats') }}
        </button>
        <button
          class="button-default dropdown-item"
          @click="toggleNotificationFilter('follows')"
        >
          <span
            class="menu-checkbox"
            :class="{ 'menu-checkbox-checked': filters.follows }"
          />{{ $t('settings.notification_visibility_follows') }}
        </button>
        <button
          class="button-default dropdown-item"
          @click="toggleNotificationFilter('mentions')"
        >
          <span
            class="menu-checkbox"
            :class="{ 'menu-checkbox-checked': filters.mentions }"
          />{{ $t('settings.notification_visibility_mentions') }}
        </button>
        <button
          class="button-default dropdown-item"
          @click="toggleNotificationFilter('emojiReactions')"
        >
          <span
            class="menu-checkbox"
            :class="{ 'menu-checkbox-checked': filters.emojiReactions }"
          />{{ $t('settings.notification_visibility_emoji_reactions') }}
        </button>
        <button
          class="button-default dropdown-item"
          @click="toggleNotificationFilter('moves')"
        >
          <span
            class="menu-checkbox"
            :class="{ 'menu-checkbox-checked': filters.moves }"
          />{{ $t('settings.notification_visibility_moves') }}
        </button>
      </div>
    </template>
    <template v-slot:trigger>
      <button class="button-unstyled">
        <FAIcon icon="filter" />
      </button>
    </template>
  </Popover>
</template>

<script>
import Popover from '../popover/popover.vue'
import { library } from '@fortawesome/fontawesome-svg-core'
import { faFilter } from '@fortawesome/free-solid-svg-icons'

library.add(
  faFilter
)

export default {
  components: { Popover },
  computed: {
    filters () {
      return this.$store.getters.mergedConfig.notificationVisibility
    }
  },
  methods: {
    toggleNotificationFilter (type) {
      this.$store.dispatch('setOption', {
        name: 'notificationVisibility',
        value: {
          ...this.filters,
          [type]: !this.filters[type]
        }
      })
    }
  }
}
</script>

<style lang="scss">

.NotificationFilters {
  align-self: stretch;

  > button {
    font-size: 1.2em;
    padding-left: 0.7em;
    padding-right: 0.2em;
    line-height: 100%;
    height: 100%;
  }

  .dropdown-item {
    margin: 0;
  }
}

</style>
