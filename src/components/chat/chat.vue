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
          <div class="go-back-button-wrapper">
            <i
              class="button-icon icon-left-open go-back-button"
              @click="goBack"
            />
            <div class="title text-center">
              <ChatTitle
                :users="chatParticipants"
                :fallback-user="currentUser"
                :with-avatar="true"
              />
            </div>
          </div>
          <div style="visibility: hidden">
            <i class="button-icon icon-info-circled" />
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
              :disable-polls="true"
              :poster="poster"
              :preserve-focus="!isMobileLayout"
              :polls-available="false"
              :auto-focus="!isMobileLayout"
              :placeholder="formPlaceholder"
              :file-limit="1"
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
