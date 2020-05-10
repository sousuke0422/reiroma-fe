<template>
  <div class="direct-conversation-view">
    <div class="direct-conversation-view-inner">
      <div
        id="nav"
        ref="inner"
        class="panel-default panel direct-conversation-view-body"
      >
        <div
          ref="header"
          class="panel-heading direct-conversation-view-heading mobile-hidden"
        >
          <a
            class="go-back-button"
            @click="goBack"
          >
            <i class="button-icon icon-left-open" />
          </a>
          <div class="title text-center">
            <ChatTitle
              :users="chatParticipants"
              :fallback-user="currentUser"
            />
          </div>
          <div style="visibility: hidden">
            <ChatAvatar
              :users="chatParticipants"
              :fallback-user="currentUser"
              width="23px"
              height="23px"
            />
          </div>
        </div>
        <template>
          <div
            ref="scrollable"
            class="scrollable"
            @scroll="handleScroll"
          >
            <ChatMessage
              v-for="chatViewItem in chatViewItems"
              :key="chatViewItem.id"
              :chat-view-item="chatViewItem"
              :sequence-hovered="chatViewItem.sequenceId === hoveredSequenceId"
              @hover="onStatusHover"
            />
          </div>
          <div
            ref="footer"
            class="panel-body footer"
          >
            <div
              class="jump-to-bottom-button"
              :class="{ 'visible': !loadingMessages && jumpToBottomButtonVisible }"
              @click="scrollDown({ behavior: 'smooth' })"
            >
              <i class="icon-down-open">
                <div
                  v-if="newMessageCount"
                  class="new-messages-alert-dot"
                >
                  {{ newMessageCount }}
                </div>
              </i>
            </div>
            <PostStatusForm
              :disabled="loadingChat"
              :disable-subject="true"
              :disable-scope-selector="true"
              :disable-notice="true"
              :disable-attachments="true"
              :disable-polls="true"
              :poster="poster"
              :preserve-focus="true"
              :polls-available="false"
              :auto-focus="true"
              :placeholder="formPlaceholder"
              max-height="160"
              @resize="handleResize"
              @posted="onPosted"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<script src="./chat.js"></script>
<style lang="scss">
@import '../../_variables.scss';
@import './chat.scss';
</style>
