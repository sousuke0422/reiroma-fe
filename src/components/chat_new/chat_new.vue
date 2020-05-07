<template>
  <div
    id="nav"
    class="panel-default panel direct-conversation-new"
  >
    <div
      ref="header"
      class="panel-heading"
    >
      <a
        class="go-back-button"
        style="cursor: pointer; margin-right: 0.7em"
        @click="goBack"
      >
        <i class="button-icon icon-left-open" />
      </a>
    </div>
    <div class="input-wrap">
      <div class="input-search">
        <i class="button-icon icon-search" />
      </div>
      <input
        ref="search"
        v-model="query"
        placeholder="Search people"
        @input="onInput"
      >
    </div>
    <div class="member-list">
      <div
        v-for="user in availableUsers"
        :key="user.id"
        class="member"
      >
        <div
          class="user-card-wrap"
          @click.capture.prevent="goToNewChat(user)"
        >
          <BasicUserCard :user="user" />
        </div>
      </div>
    </div>
  </div>
</template>

<script src="./chat_new.js"></script>
<style lang="scss">
@import '../../_variables.scss';
@import './chat_new.scss';
</style>
