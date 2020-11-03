<template>
  <div
    id="app"
    :style="bgAppStyle"
  >
    <div
      id="app_bg_wrapper"
      class="app-bg-wrapper"
      :style="bgStyle"
    />
    <MobileNav v-if="isMobileLayout" />
    <DesktopNav v-else />
    <div class="app-bg-wrapper app-container-wrapper" />
    <div
      id="content"
      class="main-layout underlay"
    >
      <div class="sidebar">
        <user-panel />
        <div v-if="!isMobileLayout">
          <nav-panel />
          <instance-specific-panel v-if="showInstanceSpecificPanel" />
          <features-panel v-if="!currentUser && showFeaturesPanel" />
          <who-to-follow-panel v-if="currentUser && suggestionsEnabled" />
          <portal to="notifications-3rd-column" :disabled="!is3ColumnLayout">
            <keep-alive>
              <notifications v-if="currentUser"/>
            </keep-alive>
          </portal>
        </div>
      </div>
      <portal-target class="column-3" name="notifications-3rd-column" />
      <div
        v-if="!currentUser"
        class="login-hint panel panel-default"
      >
        <router-link
          :to="{ name: 'login' }"
          class="panel-body"
        >
          {{ $t("login.hint") }}
        </router-link>
      </div>
      <router-view class="content" />
    </div>
    <chat-panel
      v-if="currentUser && chat"
      :floating="true"
      class="floating-chat mobile-hidden"
    />
    <MobilePostStatusButton />
    <UserReportingModal />
    <PostStatusModal />
    <SettingsModal />
    <media-modal />
    <portal-target name="modal" />
    <GlobalNoticeList />
  </div>
</template>

<script src="./App.js"></script>
<style lang="scss" src="./App.scss"></style>
