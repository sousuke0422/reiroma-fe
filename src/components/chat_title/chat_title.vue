<template>
  <!-- eslint-disable vue/no-v-html -->
  <div
    class="direct-conversation-title"
    :title="title"
  >
    <ChatAvatar
      v-if="withAvatar"
      :users="otherUsers"
      :fallback-user="currentUser"
      width="23px"
      height="23px"
    />
    <span
      v-if="withAvatar"
      style="margin-right: 0.5em"
    />
    <span
      v-for="(user, index) in otherUsersTruncated"
      :key="user.id"
      class="username"
      v-html="user.name_html + (index + 1 < otherUsersTruncated.length ? ', ' : '')"
    />
  </div>
  <!-- eslint-enable vue/no-v-html -->
</template>

<script src="./chat_title.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.direct-conversation-title {
  overflow: hidden;
  text-overflow: ellipsis;

  .username {
    max-width: 100%;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline;
    word-wrap: break-word;

    img {
      width: 14px;
      height: 14px;
      vertical-align: middle;
      object-fit: contain
    }
  }
}
</style>
