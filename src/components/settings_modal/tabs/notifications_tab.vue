<template>
  <div :label="$t('settings.notifications')">
    <div class="setting-item">
      <h2>{{ $t('settings.notification_setting_filters') }}</h2>
      <div class="select-multiple">
        <span class="label">{{ $t('settings.notification_visibility') }}</span>
        <ul class="option-list">
          <li>
            <Checkbox v-model="notificationVisibility.likes">
              {{ $t('settings.notification_visibility_likes') }}
            </Checkbox>
          </li>
          <li>
            <Checkbox v-model="notificationVisibility.repeats">
              {{ $t('settings.notification_visibility_repeats') }}
            </Checkbox>
          </li>
          <li>
            <Checkbox v-model="notificationVisibility.follows">
              {{ $t('settings.notification_visibility_follows') }}
            </Checkbox>
          </li>
          <li>
            <Checkbox v-model="notificationVisibility.mentions">
              {{ $t('settings.notification_visibility_mentions') }}
            </Checkbox>
          </li>
          <li>
            <Checkbox v-model="notificationVisibility.moves">
              {{ $t('settings.notification_visibility_moves') }}
            </Checkbox>
          </li>
          <li>
            <Checkbox v-model="notificationVisibility.emojiReactions">
              {{ $t('settings.notification_visibility_emoji_reactions') }}
            </Checkbox>
          </li>
        </ul>
      </div>
      <p>
        <Checkbox v-model="notificationSettings.block_from_strangers">
          {{ $t('settings.notification_setting_block_from_strangers') }}
        </Checkbox>
      </p>
    </div>

    <div class="setting-item">
      <h2>{{ $t('settings.notifications_advanced') }}</h2>
      <p>
        <Checkbox v-model="webPushNotifications">
          {{ $t('settings.enable_web_push_notifications') }}
        </Checkbox>
      </p>
      <p>{{ $t('settings.notification_browser') }}</p>
    </div>

    <div class="setting-item">
      <h2>{{ $t('settings.notification_setting_privacy') }}</h2>
      <p>
        <Checkbox v-model="notificationSettings.hide_notification_contents">
          {{ $t('settings.notification_setting_hide_notification_contents') }}
        </Checkbox>
      </p>
    </div>
    <div class="setting-item">
      <p>{{ $t('settings.notification_mutes') }}</p>
      <p>{{ $t('settings.notification_blocks') }}</p>
      <button
        class="btn btn-default"
        @click="updateNotificationSettings"
      >
        {{ $t('general.submit') }}
      </button>
    </div>
  </div>
</template>

<script src="./notifications_tab.js"></script>
<!-- <style lang="scss" src="./profile.scss"></style> -->
