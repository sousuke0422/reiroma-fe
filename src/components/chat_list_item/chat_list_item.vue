<template>
  <div
    class="chat-list-item"
    @click.capture.prevent="openChat"
  >
    <div class="chat-list-item-left">
      <ChatAvatar
        :users="[]"
        :fallback-user="chat.account"
        height="48px"
        width="48px"
      />
    </div>
    <div class="chat-list-item-center">
      <div class="heading">
        <span
          v-if="chat.account"
          class="name-and-account-name"
        >
          <ChatTitle
            :users="[]"
            :fallback-user="chat.account"
            :with-links="false"
          />
        </span>
        <span class="heading-right" />
      </div>
      <!-- eslint-disable vue/no-v-html -->
      <div class="chat-preview">
        {{ 'Last message placeholder' }}
        <div
          v-if="chat.unread > 0"
          class="alert-dot-number"
        >
          {{ chat.unread }}
        </div>
      </div>
      <!-- eslint-enable vue/no-v-html -->
    </div>
  </div>
</template>

<script src="./chat_list_item.js"></script>

<style lang="scss">
@import '../../_variables.scss';
@import './chat_list_item.scss';
</style>
