<template>
  <div v-if="isNew">
    <ChatNew @cancel="cancelNewChat" />
  </div>
  <div
    v-else
    class="panel panel-default"
    style="min-height: calc(100vh - 67px); margin-bottom: 0; border-bottom-left-radius: 0; border-bottom-right-radius: 0;"
  >
    <div class="panel-heading truncated-text-wrapper">
      <span class="title truncated-text">
        {{ $t("chats.chats") }}
      </span>
      <span style="width: 0.75rem;">{{ ' ' }}</span>
      <button @click="newChat">
        {{ $t("chats.new") }}
      </button>
    </div>
    <div class="panel-body">
      <div class="timeline">
        <Chats>
          <template
            slot="item"
            slot-scope="{item}"
          >
            <ChatListItem
              :key="item.id"
              :compact="false"
              :chat="item"
            />
          </template>
        </Chats>
      </div>
    </div>
  </div>
</template>

<script src="./chat_list.js"></script>

<style lang="scss">
@import '../../_variables.scss';

.truncated-text-wrapper {
  overflow-x: hidden;
  display: flex;

  .truncated-text {
    flex: 1;
    overflow-x: hidden;
    word-wrap: break-word;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}

</style>
