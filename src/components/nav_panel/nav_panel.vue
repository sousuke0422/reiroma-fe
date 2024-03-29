<template>
  <div
    class="NavPanel"
    :class="{ compact: compactNavPanel }"
  >
    <div class="panel panel-default">
      <ul>
        <li v-if="currentUser || !privateMode">
          <button
            class="button-unstyled menu-item"
            @click="toggleTimelines"
          >
            <FAIcon
              fixed-width
              class="fa-scale-110"
              icon="stream"
            />{{ $t("nav.timelines") }}
            <FAIcon
              class="timelines-chevron"
              fixed-width
              :icon="showTimelines ? 'chevron-up' : 'chevron-down'"
            />
          </button>
          <div
            v-show="showTimelines"
            class="timelines-background"
          >
            <TimelineMenuContent class="timelines" />
          </div>
        </li>
        <li v-if="currentUser">
          <router-link
            class="menu-item"
            :to="{ name: 'interactions', params: { username: currentUser.screen_name } }"
          >
            <FAIcon
              fixed-width
              class="fa-scale-110"
              icon="bell"
            />{{ $t("nav.interactions") }}
          </router-link>
        </li>
        <li v-if="currentUser && pleromaChatMessagesAvailable">
          <router-link
            class="menu-item"
            :to="{ name: 'chats', params: { username: currentUser.screen_name } }"
          >
            <div
              v-if="unreadChatCount"
              class="badge badge-notification"
            >
              {{ unreadChatCount }}
            </div>
            <FAIcon
              fixed-width
              class="fa-scale-110"
              icon="comments"
            />{{ $t("nav.chats") }}
          </router-link>
        </li>
        <li v-if="currentUser && currentUser.locked">
          <router-link
            class="menu-item"
            :to="{ name: 'friend-requests' }"
          >
            <FAIcon
              fixed-width
              class="fa-scale-110"
              icon="user-plus"
            />{{ $t("nav.friend_requests") }}
            <span
              v-if="followRequestCount > 0"
              class="badge badge-notification"
            >
              {{ followRequestCount }}
            </span>
          </router-link>
        </li>
        <li>
          <router-link
            class="menu-item"
            :to="{ name: 'about' }"
          >
            <FAIcon
              fixed-width
              class="fa-scale-110"
              icon="info-circle"
            />{{ $t("nav.about") }}
          </router-link>
        </li>
      </ul>
    </div>
  </div>
</template>

<script src="./nav_panel.js" ></script>

<style lang="scss">
@import '../../_variables.scss';

.NavPanel {
  .panel {
    overflow: hidden;
    box-shadow: var(--panelShadow);
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li {
    position: relative;
    border-bottom: 1px solid;
    border-color: $fallback--border;
    border-color: var(--border, $fallback--border);
    padding: 0;

    &:first-child .menu-item {
      border-top-right-radius: $fallback--panelRadius;
      border-top-right-radius: var(--panelRadius, $fallback--panelRadius);
      border-top-left-radius: $fallback--panelRadius;
      border-top-left-radius: var(--panelRadius, $fallback--panelRadius);
    }

    &:last-child .menu-item {
      border-bottom-right-radius: $fallback--panelRadius;
      border-bottom-right-radius: var(--panelRadius, $fallback--panelRadius);
      border-bottom-left-radius: $fallback--panelRadius;
      border-bottom-left-radius: var(--panelRadius, $fallback--panelRadius);
    }
  }

  li:last-child {
    border: none;
  }

  .menu-item {
    display: block;
    box-sizing: border-box;
    height: 3.5em;
    line-height: 3.5em;
    padding: 0 1em;
    width: 100%;
    color: $fallback--link;
    color: var(--link, $fallback--link);

    &:hover {
      background-color: $fallback--lightBg;
      background-color: var(--selectedMenu, $fallback--lightBg);
      color: $fallback--link;
      color: var(--selectedMenuText, $fallback--link);
      --faint: var(--selectedMenuFaintText, $fallback--faint);
      --faintLink: var(--selectedMenuFaintLink, $fallback--faint);
      --lightText: var(--selectedMenuLightText, $fallback--lightText);
      --icon: var(--selectedMenuIcon, $fallback--icon);
    }

    &.router-link-active {
      font-weight: bolder;
      background-color: $fallback--lightBg;
      background-color: var(--selectedMenu, $fallback--lightBg);
      color: $fallback--text;
      color: var(--selectedMenuText, $fallback--text);
      --faint: var(--selectedMenuFaintText, $fallback--faint);
      --faintLink: var(--selectedMenuFaintLink, $fallback--faint);
      --lightText: var(--selectedMenuLightText, $fallback--lightText);
      --icon: var(--selectedMenuIcon, $fallback--icon);

      &:hover {
        text-decoration: underline;
      }
    }
  }

  .timelines-chevron {
    margin-left: 0.8em;
    font-size: 1.1em;
  }

  .timelines-background {
    padding: 0 0 0 0.6em;
    background-color: $fallback--lightBg;
    background-color: var(--selectedMenu, $fallback--lightBg);
    border-top: 1px solid;
    border-color: $fallback--border;
    border-color: var(--border, $fallback--border);
  }

  .timelines {
    background-color: $fallback--bg;
    background-color: var(--bg, $fallback--bg);
  }

  .fa-scale-110 {
    margin-right: 0.8em;
  }

  .badge {
    position: absolute;
    right: 0.6rem;
    top: 1.25em;
  }

  &.compact {
    .panel {
      overflow: visible;

      ul > li:hover > a:not(.router-link-active) > .button-icon {
        color: var(--selectedMenuText,#b9b9ba);
      }

      ul > li > .router-link-active > .button-icon {
        color: var(--selectedMenuLightText);
      }

      ul {
        display: flex;
        height: 100%;
        padding: 0;
      }

      li {
        width: -moz-available;
        width: -webkit-fill-available;
        border-bottom: none;

        a {
          border-radius: 0 !important;
        }
      }

      .timelines-chevron {
        display: none;
      }

      .timelines-background {
        position: absolute;
        z-index: 10000;
      }

      a, button {
        font-size: 0;
        height: 100%;
        display: flex;
        position: relative;
        padding-top: 7px;
        padding-bottom: 7px;
      }

      .button-icon, svg.svg-inline--fa {
        margin: auto;
        font-size: 20px;
        color: var(--link,#d8a070);
      }

      .badge {
        position: absolute;
        right: 0;
        background-color: red;
        background-color: var(--badgeNotification,red);
        color: #fff;
        color: var(--badgeNotificationText,#fff);

        // remove layout
        padding: 0;
        margin: 0;
        box-shadow: black 0 1px 5px;
        display: inline-block;
        border-radius: 99px;
        min-width: 22px;
        line-height: 22px;
        min-height: 22px;
        max-height: 22px;
        font-size: 14px;
        font-weight: normal;
        font-style: normal;
        font-family: inherit;
      }
    }
  }
}
</style>
