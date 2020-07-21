<template>
  <Popover
    v-if="userId"
    class="user-popover-container"
    trigger="hover"
    popover-class="user-popover"
    :bound-to="{ x: 'container' }"
    :delay="200"
    :anchor-offset="anchorOffset"
    @show="enter"
  >
    <template slot="trigger">
      <slot />
    </template>
    <div
      slot="content"
      @click.stop.prevent=""
    >
      <span v-if="user">
        <UserCard
          :user-id="userId"
          hide-bio="true"
        />
      </span>
      <div
        v-else-if="error"
        class="user-preview-no-content faint"
      >
        {{ $t('status.status_unavailable') }}
      </div>
      <div
        v-else
        class="status-preview-no-content"
      >
        <i class="icon-spin4 animate-spin" />
      </div>
    </div>
  </Popover>
  <div
    v-else
    class="user-popover-container"
  >
    <slot />
  </div>
</template>

<script src="./user_popover.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.user-popover-container {
  max-width: 100%;
  min-width: 0;
  &:first-child {
    max-width: 100%;
  }
}

.user-popover {
  font-size: 1rem;
  width: 30em;
  max-width: 95%;
  cursor: default;
  box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
  box-shadow: var(--popupShadow);

  .user-preview-no-content {
    padding: 1em;
    text-align: center;

    i {
      font-size: 2em;
    }
  }
}

</style>
