<template>
  <label
    class="media-upload"
    :class="{ disabled: disabled }"
    :title="$t('tool_tip.media_upload')"
  >
    <FAIcon
      v-if="uploading"
      class="progress-icon"
      icon="circle-notch"
      spin
    />
    <FAIcon
      v-if="!uploading"
      class="new-icon"
      icon="upload"
    />
    <input
      v-if="uploadReady"
      :disabled="disabled"
      type="file"
      style="position: fixed; top: -100em"
      multiple="true"
      @change="change"
    >
  </label>
</template>

<script src="./media_upload.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.media-upload {
  &.disabled {
    .new-icon {
      cursor: not-allowed;
    }

    &:hover {
      i, label {
        color: $fallback--faint;
        color: var(--faint, $fallback--faint);
      }
    }
  }

  .label {
    display: inline-block;
  }

  .new-icon {
    cursor: pointer;
  }
}
 </style>
