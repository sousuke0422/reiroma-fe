<template>
  <div :label="$t('settings.filtering')">
    <div class="setting-item">
      <div>
        {{ $t('settings.replies_in_timeline') }}
        <label
          for="replyVisibility"
          class="select"
        >
          <select
            id="replyVisibility"
            v-model="replyVisibility"
          >
            <option
              value="all"
              selected
            >{{ $t('settings.reply_visibility_all') }}</option>
            <option value="following">{{ $t('settings.reply_visibility_following') }}</option>
            <option value="self">{{ $t('settings.reply_visibility_self') }}</option>
          </select>
          <i class="icon-down-open" />
        </label>
      </div>
      <div>
        <Checkbox v-model="hidePostStats">
          {{ $t('settings.hide_post_stats') }} {{ $t('settings.instance_default', { value: hidePostStatsLocalizedValue }) }}
        </Checkbox>
      </div>
      <div>
        <Checkbox v-model="hideUserStats">
          {{ $t('settings.hide_user_stats') }} {{ $t('settings.instance_default', { value: hideUserStatsLocalizedValue }) }}
        </Checkbox>
      </div>
    </div>
    <div class="setting-item">
      <div>
        <p>{{ $t('settings.filtering_explanation') }}</p>
        <textarea
          id="muteWords"
          v-model="muteWordsString"
        />
      </div>
      <div>
        <Checkbox v-model="hideFilteredStatuses">
          {{ $t('settings.hide_filtered_statuses') }} {{ $t('settings.instance_default', { value: hideFilteredStatusesLocalizedValue }) }}
        </Checkbox>
      </div>
    </div>
  </div>
</template>
<script src="./filtering_tab.js"></script>
