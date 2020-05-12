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
        <div
          class="status-body"
          :style="{ 'min-width': message.attachment ? '80%' : '' }"
        >
          <div
            class="media status"
            style="position: relative"
            @mouseenter="hovered = true"
            @mouseleave="hovered = false"
          >
            <div
              v-if="isCurrentUser"
              class="chat-message-menu"
              style="position: absolute; right: 5px; top: -10px"
              :style="wrapperStyle"
            >
              <Popover
                trigger="click"
                placement="top"
                :bound-to="{ x: 'container' }"
                @show="menuOpened = true"
                @close="menuOpened = false"
              >
                <div
                  slot="content"
                  slot-scope=""
                >
                  <div class="dropdown-menu">
                    <button
                      class="dropdown-item dropdown-item-icon"
                      @click="deleteMessage"
                    >
                      <i class="icon-cancel" /> {{ $t("chats.delete") }}
                    </button>
                  </div>
                </div>
                <button
                  slot="trigger"
                  :title="$t('chats.more')"
                >
                  <i class="icon-dot-3" />
                </button>
              </Popover>
            </div>
            <StatusContent
              :status="messageForStatusContent"
              :full-content="true"
            >
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
