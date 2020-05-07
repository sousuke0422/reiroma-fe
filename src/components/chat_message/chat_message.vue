<template>
  <div
    v-if="isMessage"
    class="direct-conversation-status-wrapper"
    :class="{ 'sequence-hovered': sequenceHovered }"
    @mouseover="onHover(true)"
    @mouseleave="onHover(false)"
  >
    <div
      class="direct-conversation"
      :class="[{ 'outgoing': isCurrentUser, 'incoming': !isCurrentUser }]"
    >
      <div
        v-if="!isCurrentUser"
        class="avatar-wrapper"
      >
        <router-link
          v-if="chatViewItem.isHead"
          :to="userProfileLink"
        >
          <UserAvatar
            :compact="true"
            :better-shadow="betterShadow"
            :user="author"
          />
        </router-link>
      </div>
      <div class="direct-conversation-inner">
        <div class="media status">
          <StatusContent
            :status="messageForStatusContent"
            :full-content="true">
            <span
              slot="footer"
              class="created-at"
            >
              {{ createdAt }}
            </span>
          </StatusContent>
        </div>
      </div>
    </div>
  </div>
  <div
    v-else
    class="date-separator"
  >
    <ChatMessageDate :date="chatViewItem.date" />
  </div>
</template>

<script src="./chat_message.js" ></script>
<style lang="scss">
@import './chat_message.scss';

</style>
