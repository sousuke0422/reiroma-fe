<template>
  <div
    class="user-panel"
    :class="{ compact: compactUserPanel }"
  >
    <div
      v-if="signedIn"
      key="user-panel"
      class="panel panel-default signed-in"
    >
      <UserCard
        :user-id="user.id"
        :hide-bio="true"
        rounded="top"
      />
      <PostStatusForm />
    </div>
    <auth-form
      v-else
      key="user-panel"
    />
  </div>
</template>

<script src="./user_panel.js"></script>

<style lang="scss">
.user-panel .signed-in {
  overflow: visible;
}

.user-panel.compact {
  .background-image {
    mask: unset; -webkit-mask: unset;
    background-position: center;
  }

  .user-info .Avatar { width: 24px; height: 24px; }

  .user-summary { margin-left: 1em; font-weight: bold; }

  .user-info .container { padding-top: 6px; padding-bottom: 0; }

  .bottom-line { display: none; }

  .form-group .visibility-notice { margin: 0; }
}

</style>
