<template>
  <div
    v-if="firstUser && secondUser"
    class="direct-conversation-multi-user-avatar"
    :style="{ 'width': width, 'height': height }"
  >
    <StillImage
      v-if="fourthUser"
      class="avatar avatar-fourth direct-conversation-avatar"
      :alt="fourthUser.screen_name"
      :title="fourthUser.screen_name"
      :src="fourthUser.profile_image_url_original"
      error-src="/images/avi.png"
      :class="{ 'better-shadow': betterShadow }"
    />
    <StillImage
      v-if="thirdUser"
      class="avatar avatar-third direct-conversation-avatar"
      :alt="thirdUser.screen_name"
      :title="thirdUser.screen_name"
      :src="thirdUser.profile_image_url_original"
      error-src="/images/avi.png"
      :class="{ 'better-shadow': betterShadow }"
    />
    <StillImage
      class="avatar avatar-second direct-conversation-avatar"
      :alt="secondUser.screen_name"
      :title="secondUser.screen_name"
      :src="secondUser.profile_image_url_original"
      error-src="/images/avi.png"
      :class="{ 'better-shadow': betterShadow }"
      :style="{ 'height': fourthUser ? '50%' : '100%' }"
    />
    <StillImage
      class="avatar avatar-first direct-conversation-avatar"
      :alt="firstUser.screen_name"
      :title="firstUser.screen_name"
      :src="firstUser.profile_image_url_original"
      error-src="/images/avi.png"
      :class="{ 'better-shadow': betterShadow }"
      :style="{ 'height': thirdUser ? '50%' : '100%' }"
    />
  </div>
  <router-link
    v-else
    :to="getUserProfileLink(firstUser)"
  >
    <StillImage
      :style="{ 'width': width, 'height': height }"
      class="avatar direct-conversation-avatar single-user"
      :alt="firstUser.screen_name"
      :title="firstUser.screen_name"
      :src="firstUser.profile_image_url_original"
      error-src="/images/avi.png"
      :class="{ 'better-shadow': betterShadow }"
    />
  </router-link>
</template>

<script src="./chat_avatar.js"></script>
<style lang="scss">
@import '../../_variables.scss';

.direct-conversation-multi-user-avatar {
  position: relative;
  cursor: pointer;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  overflow: hidden;

  .avatar.still-image {
    width: 50%;
    height: 50%;
    border-radius: 0;
    img, canvas {
      object-fit: cover;
    }

    &.avatar-first {
      float: right;
      position: absolute;
      bottom: 0;
    }

    &.avatar-second {
      float: right;
    }

    &.avatar-third {
      float: right;
      position: absolute;
    }

    &.avatar-fourth {
      float: right;
      position: absolute;
      bottom: 0;
      right: 0;
    }
  }
}

.direct-conversation-avatar {
  display: inline-block;
  vertical-align: middle;

  &.single-user {
    border-radius: $fallback--avatarAltRadius;
    border-radius: var(--avatarAltRadius, $fallback--avatarAltRadius);
  }

  .avatar.still-image {
    width: 48px;
    height: 48px;

    box-shadow: var(--avatarStatusShadow);
    border-radius: 0;

    &.better-shadow {
      box-shadow: var(--avatarStatusShadowInset);
      filter: var(--avatarStatusShadowFilter)
    }

    &.animated::before {
      display: none;
    }
  }
}
</style>
