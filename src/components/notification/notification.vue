<template>
  <status
    v-if="notification.redux.type === 'mention'"
    :compact="true"
    :statusoid="notification.redux.status"
  />
  <div v-else>
    <div
      v-if="needMute && !unmuted"
      class="container muted"
    >
      <small>
        <router-link :to="userProfileLink">
          {{ notification.redux.account.redux.acct }}
        </router-link>
      </small>
      <a
        href="#"
        class="unmute"
        @click.prevent="toggleMute"
      ><i class="button-icon icon-eye-off" /></a>
    </div>
    <div
      v-else
      class="non-mention"
      :class="[userClass, { highlighted: userStyle }]"
      :style="[ userStyle ]"
    >
      <a
        class="avatar-container"
        :href="notification.redux.account.redux.url"
        @click.stop.prevent.capture="toggleUserExpanded"
      >
        <UserAvatar
          :compact="true"
          :better-shadow="betterShadow"
          :user="notification.redux.account"
        />
      </a>
      <div class="notification-right">
        <UserCard
          v-if="userExpanded"
          :user-id="getUser(notification).id"
          :rounded="true"
          :bordered="true"
        />
        <span class="notification-details">
          <div class="name-and-action">
            <!-- eslint-disable vue/no-v-html -->
            <bdi
              v-if="!!notification.redux.account.name_html"
              class="username"
              :title="'@'+notification.redux.account.screen_name"
              v-html="notification.redux.account.name_html"
            />
            <!-- eslint-enable vue/no-v-html -->
            <span
              v-else
              class="username"
              :title="'@'+notification.redux.account.redux.acct"
            >{{ notification.redux.account.display_name }}</span>
            <span v-if="notification.redux.type === 'favourite'">
              <i class="fa icon-star lit" />
              <small>{{ $t('notifications.favorited_you') }}</small>
            </span>
            <span v-if="notification.redux.type === 'reblog'">
              <i
                class="fa icon-retweet lit"
                :title="$t('tool_tip.repeat')"
              />
              <small>{{ $t('notifications.repeated_you') }}</small>
            </span>
            <span v-if="notification.redux.type === 'follow'">
              <i class="fa icon-user-plus lit" />
              <small>{{ $t('notifications.followed_you') }}</small>
            </span>
            <span v-if="notification.redux.type === 'follow_request'">
              <i class="fa icon-user lit" />
              <small>{{ $t('notifications.follow_request') }}</small>
            </span>
            <span v-if="notification.redux.type === 'move'">
              <i class="fa icon-arrow-curved lit" />
              <small>{{ $t('notifications.migrated_to') }}</small>
            </span>
            <span v-if="notification.redux.type === 'pleroma:emoji_reaction'">
              <small>
                <i18n path="notifications.reacted_with">
                  <span class="emoji-reaction-emoji">{{ notification.redux.emoji }}</span>
                </i18n>
              </small>
            </span>
          </div>
          <div
            v-if="isStatusNotification"
            class="timeago"
          >
            <router-link
              v-if="notification.redux.status"
              :to="{ name: 'conversation', params: { id: notification.redux.status.id } }"
              class="faint-link"
            >
              <Timeago
                :time="notification.redux.created_at"
                :auto-update="240"
              />
            </router-link>
          </div>
          <div
            v-else
            class="timeago"
          >
            <span class="faint">
              <Timeago
                :time="notification.redux.created_at"
                :auto-update="240"
              />
            </span>
          </div>
          <a
            v-if="needMute"
            href="#"
            @click.prevent="toggleMute"
          ><i class="button-icon icon-eye-off" /></a>
        </span>
        <div
          v-if="notification.redux.type === 'follow' || notification.redux.type === 'follow_request'"
          class="follow-text"
        >
          <router-link
            :to="userProfileLink"
            class="follow-name"
          >
            @{{ notification.redux.account.redux.acct }}
          </router-link>
          <div
            v-if="notification.redux.type === 'follow_request'"
            style="white-space: nowrap;"
          >
            <i
              class="icon-ok button-icon follow-request-accept"
              :title="$t('tool_tip.accept_follow_request')"
              @click="approveUser()"
            />
            <i
              class="icon-cancel button-icon follow-request-reject"
              :title="$t('tool_tip.reject_follow_request')"
              @click="denyUser()"
            />
          </div>
        </div>
        <div
          v-else-if="notification.redux.type === 'move'"
          class="move-text"
        >
          <router-link :to="targetUserProfileLink">
            @{{ notification.redux.target.redux.acct }}
          </router-link>
        </div>
        <template v-else>
          <status-content
            class="faint"
            :status="notification.redux.status"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<script src="./notification.js"></script>
