import { each, map, concat, last, get } from 'lodash'
import { parseStatus, parseUser, parseNotification, parseAttachment, parseChat, parseLinkHeaderPagination } from '../entity_normalizer/entity_normalizer.service.js'
import { RegistrationError, StatusCodeError } from '../errors/errors'

/* eslint-env browser */
const MUTES_IMPORT_URL = '/api/pleroma/mutes_import'
const BLOCKS_IMPORT_URL = '/api/pleroma/blocks_import'
const FOLLOW_IMPORT_URL = '/api/pleroma/follow_import'
const DELETE_ACCOUNT_URL = '/api/pleroma/delete_account'
const CHANGE_EMAIL_URL = '/api/pleroma/change_email'
const CHANGE_PASSWORD_URL = '/api/pleroma/change_password'
const TAG_USER_URL = '/api/pleroma/admin/users/tag'
const PERMISSION_GROUP_URL = (screenName, right) => `/api/pleroma/admin/users/${screenName}/permission_group/${right}`
const ACTIVATE_USER_URL = '/api/pleroma/admin/users/activate'
const DEACTIVATE_USER_URL = '/api/pleroma/admin/users/deactivate'
const ADMIN_USERS_URL = '/api/pleroma/admin/users'
const SUGGESTIONS_URL = '/api/v1/suggestions'
const NOTIFICATION_SETTINGS_URL = '/api/pleroma/notification_settings'
const NOTIFICATION_READ_URL = '/api/v1/pleroma/notifications/read'

const MFA_SETTINGS_URL = '/api/pleroma/accounts/mfa'
const MFA_BACKUP_CODES_URL = '/api/pleroma/accounts/mfa/backup_codes'

const MFA_SETUP_OTP_URL = '/api/pleroma/accounts/mfa/setup/totp'
const MFA_CONFIRM_OTP_URL = '/api/pleroma/accounts/mfa/confirm/totp'
const MFA_DISABLE_OTP_URL = '/api/pleroma/accounts/mfa/totp'

const MASTODON_LOGIN_URL = '/api/v1/accounts/verify_credentials'
const MASTODON_REGISTRATION_URL = '/api/v1/accounts'
const MASTODON_USER_FAVORITES_TIMELINE_URL = '/api/v1/favourites'
const MASTODON_USER_NOTIFICATIONS_URL = '/api/v1/notifications'
const MASTODON_DISMISS_NOTIFICATION_URL = id => `/api/v1/notifications/${id}/dismiss`
const MASTODON_FAVORITE_URL = id => `/api/v1/statuses/${id}/favourite`
const MASTODON_UNFAVORITE_URL = id => `/api/v1/statuses/${id}/unfavourite`
const MASTODON_RETWEET_URL = id => `/api/v1/statuses/${id}/reblog`
const MASTODON_UNRETWEET_URL = id => `/api/v1/statuses/${id}/unreblog`
const MASTODON_DELETE_URL = id => `/api/v1/statuses/${id}`
const MASTODON_FOLLOW_URL = id => `/api/v1/accounts/${id}/follow`
const MASTODON_UNFOLLOW_URL = id => `/api/v1/accounts/${id}/unfollow`
const MASTODON_FOLLOWING_URL = id => `/api/v1/accounts/${id}/following`
const MASTODON_FOLLOWERS_URL = id => `/api/v1/accounts/${id}/followers`
const MASTODON_FOLLOW_REQUESTS_URL = '/api/v1/follow_requests'
const MASTODON_APPROVE_USER_URL = id => `/api/v1/follow_requests/${id}/authorize`
const MASTODON_DENY_USER_URL = id => `/api/v1/follow_requests/${id}/reject`
const MASTODON_DIRECT_MESSAGES_TIMELINE_URL = '/api/v1/timelines/direct'
const MASTODON_PUBLIC_TIMELINE = '/api/v1/timelines/public'
const MASTODON_USER_HOME_TIMELINE_URL = '/api/v1/timelines/home'
const MASTODON_STATUS_URL = id => `/api/v1/statuses/${id}`
const MASTODON_STATUS_CONTEXT_URL = id => `/api/v1/statuses/${id}/context`
const MASTODON_USER_URL = '/api/v1/accounts'
const MASTODON_USER_RELATIONSHIPS_URL = '/api/v1/accounts/relationships'
const MASTODON_USER_TIMELINE_URL = id => `/api/v1/accounts/${id}/statuses`
const MASTODON_TAG_TIMELINE_URL = tag => `/api/v1/timelines/tag/${tag}`
const MASTODON_BOOKMARK_TIMELINE_URL = '/api/v1/bookmarks'
const MASTODON_USER_BLOCKS_URL = '/api/v1/blocks/'
const MASTODON_USER_MUTES_URL = '/api/v1/mutes/'
const MASTODON_BLOCK_USER_URL = id => `/api/v1/accounts/${id}/block`
const MASTODON_UNBLOCK_USER_URL = id => `/api/v1/accounts/${id}/unblock`
const MASTODON_MUTE_USER_URL = id => `/api/v1/accounts/${id}/mute`
const MASTODON_UNMUTE_USER_URL = id => `/api/v1/accounts/${id}/unmute`
const MASTODON_SUBSCRIBE_USER = id => `/api/v1/pleroma/accounts/${id}/subscribe`
const MASTODON_UNSUBSCRIBE_USER = id => `/api/v1/pleroma/accounts/${id}/unsubscribe`
const MASTODON_BOOKMARK_STATUS_URL = id => `/api/v1/statuses/${id}/bookmark`
const MASTODON_UNBOOKMARK_STATUS_URL = id => `/api/v1/statuses/${id}/unbookmark`
const MASTODON_POST_STATUS_URL = '/api/v1/statuses'
const MASTODON_MEDIA_UPLOAD_URL = '/api/v1/media'
const MASTODON_VOTE_URL = id => `/api/v1/polls/${id}/votes`
const MASTODON_POLL_URL = id => `/api/v1/polls/${id}`
const MASTODON_STATUS_FAVORITEDBY_URL = id => `/api/v1/statuses/${id}/favourited_by`
const MASTODON_STATUS_REBLOGGEDBY_URL = id => `/api/v1/statuses/${id}/reblogged_by`
const MASTODON_PROFILE_UPDATE_URL = '/api/v1/accounts/update_credentials'
const MASTODON_REPORT_USER_URL = '/api/v1/reports'
const MASTODON_PIN_OWN_STATUS = id => `/api/v1/statuses/${id}/pin`
const MASTODON_UNPIN_OWN_STATUS = id => `/api/v1/statuses/${id}/unpin`
const MASTODON_MUTE_CONVERSATION = id => `/api/v1/statuses/${id}/mute`
const MASTODON_UNMUTE_CONVERSATION = id => `/api/v1/statuses/${id}/unmute`
const MASTODON_SEARCH_2 = `/api/v2/search`
const MASTODON_USER_SEARCH_URL = '/api/v1/accounts/search'
const MASTODON_DOMAIN_BLOCKS_URL = '/api/v1/domain_blocks'
const MASTODON_STREAMING = '/api/v1/streaming'
const MASTODON_KNOWN_DOMAIN_LIST_URL = '/api/v1/instance/peers'
const PLEROMA_EMOJI_REACTIONS_URL = id => `/api/v1/pleroma/statuses/${id}/reactions`
const PLEROMA_EMOJI_REACT_URL = (id, emoji) => `/api/v1/pleroma/statuses/${id}/reactions/${emoji}`
const PLEROMA_EMOJI_UNREACT_URL = (id, emoji) => `/api/v1/pleroma/statuses/${id}/reactions/${emoji}`
const PLEROMA_CHATS_URL = `/api/v1/pleroma/chats`
const PLEROMA_CHAT_URL = id => `/api/v1/pleroma/chats/by-account-id/${id}`
const PLEROMA_CHAT_MESSAGES_URL = id => `/api/v1/pleroma/chats/${id}/messages`
const PLEROMA_CHAT_READ_URL = id => `/api/v1/pleroma/chats/${id}/read`
const PLEROMA_DELETE_CHAT_MESSAGE_URL = (chatId, messageId) => `/api/v1/pleroma/chats/${chatId}/messages/${messageId}`
const PLEROMA_ADMIN_REPORTS = '/api/pleroma/admin/reports'

const oldfetch = window.fetch

let fetch = (url, options) => {
  options = options || {}
  const baseUrl = ''
  const fullUrl = baseUrl + url
  options.credentials = 'same-origin'
  return oldfetch(fullUrl, options)
}

const promisedRequest = ({ method, url, params, payload, credentials, headers = {} }) => {
  const options = {
    method,
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...headers
    }
  }
  if (params) {
    url += '?' + Object.entries(params)
      .map(([key, value]) => encodeURIComponent(key) + '=' + encodeURIComponent(value))
      .join('&')
  }
  if (payload) {
    options.body = JSON.stringify(payload)
  }
  if (credentials) {
    options.headers = {
      ...options.headers,
      ...authHeaders(credentials)
    }
  }
  return fetch(url, options)
    .then((response) => {
      return new Promise((resolve, reject) => response.json()
        .then((json) => {
          if (!response.ok) {
            return reject(new StatusCodeError(response.status, json, { url, options }, response))
          }
          return resolve(json)
        })
        .catch((error) => {
          return reject(new StatusCodeError(response.status, error, { url, options }, response))
        })
      )
    })
}

const updateNotificationSettings = ({ credentials, settings }) => {
  const form = new FormData()

  each(settings, (value, key) => {
    form.append(key, value)
  })

  return fetch(NOTIFICATION_SETTINGS_URL, {
    headers: authHeaders(credentials),
    method: 'PUT',
    body: form
  }).then((data) => data.json())
}

const updateProfileImages = ({ credentials, avatar = null, banner = null, background = null }) => {
  const form = new FormData()
  if (avatar !== null) form.append('avatar', avatar)
  if (banner !== null) form.append('header', banner)
  if (background !== null) form.append('pleroma_background_image', background)
  return fetch(MASTODON_PROFILE_UPDATE_URL, {
    headers: authHeaders(credentials),
    method: 'PATCH',
    body: form
  })
    .then((data) => data.json())
    .then((data) => {
      if (data.error) {
        throw new Error(data.error)
      }
      return parseUser(data)
    })
}

const updateProfile = ({ credentials, params }) => {
  return promisedRequest({
    url: MASTODON_PROFILE_UPDATE_URL,
    method: 'PATCH',
    payload: params,
    credentials
  }).then((data) => parseUser(data))
}

// Params needed:
// nickname
// email
// fullname
// password
// password_confirm
//
// Optional
// bio
// homepage
// location
// token
const register = ({ params, credentials }) => {
  const { nickname, ...rest } = params
  return fetch(MASTODON_REGISTRATION_URL, {
    method: 'POST',
    headers: {
      ...authHeaders(credentials),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nickname,
      locale: 'en_US',
      agreement: true,
      ...rest
    })
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        return response.json().then((error) => { throw new RegistrationError(error) })
      }
    })
}

const getCaptcha = () => fetch('/api/pleroma/captcha').then(resp => resp.json())

const authHeaders = (accessToken) => {
  if (accessToken) {
    return { 'Authorization': `Bearer ${accessToken}` }
  } else {
    return { }
  }
}

const followUser = ({ id, credentials, ...options }) => {
  let url = MASTODON_FOLLOW_URL(id)
  const form = {}
  if (options.reblogs !== undefined) { form['reblogs'] = options.reblogs }
  return fetch(url, {
    body: JSON.stringify(form),
    headers: {
      ...authHeaders(credentials),
      'Content-Type': 'application/json'
    },
    method: 'POST'
  }).then((data) => data.json())
}

const unfollowUser = ({ id, credentials }) => {
  let url = MASTODON_UNFOLLOW_URL(id)
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const pinOwnStatus = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_PIN_OWN_STATUS(id), credentials, method: 'POST' })
    .then((data) => parseStatus(data))
}

const unpinOwnStatus = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_UNPIN_OWN_STATUS(id), credentials, method: 'POST' })
    .then((data) => parseStatus(data))
}

const muteConversation = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_MUTE_CONVERSATION(id), credentials, method: 'POST' })
    .then((data) => parseStatus(data))
}

const unmuteConversation = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_UNMUTE_CONVERSATION(id), credentials, method: 'POST' })
    .then((data) => parseStatus(data))
}

const blockUser = ({ id, credentials }) => {
  return fetch(MASTODON_BLOCK_USER_URL(id), {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const unblockUser = ({ id, credentials }) => {
  return fetch(MASTODON_UNBLOCK_USER_URL(id), {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const approveUser = ({ id, credentials }) => {
  let url = MASTODON_APPROVE_USER_URL(id)
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const denyUser = ({ id, credentials }) => {
  let url = MASTODON_DENY_USER_URL(id)
  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const fetchUser = ({ id, credentials }) => {
  let url = `${MASTODON_USER_URL}/${id}`
  return promisedRequest({ url, credentials })
    .then((data) => parseUser(data))
}

const fetchUserRelationship = ({ id, credentials }) => {
  let url = `${MASTODON_USER_RELATIONSHIPS_URL}/?id=${id}`
  return fetch(url, { headers: authHeaders(credentials) })
    .then((response) => {
      return new Promise((resolve, reject) => response.json()
        .then((json) => {
          if (!response.ok) {
            return reject(new StatusCodeError(response.status, json, { url }, response))
          }
          return resolve(json)
        }))
    })
}

const fetchFriends = ({ id, maxId, sinceId, limit = 20, credentials }) => {
  let url = MASTODON_FOLLOWING_URL(id)
  const args = [
    maxId && `max_id=${maxId}`,
    sinceId && `since_id=${sinceId}`,
    limit && `limit=${limit}`,
    `with_relationships=true`
  ].filter(_ => _).join('&')

  url = url + (args ? '?' + args : '')
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
    .then((data) => data.map(parseUser))
}

const exportFriends = ({ id, credentials }) => {
  return new Promise(async (resolve, reject) => {
    try {
      let friends = []
      let more = true
      while (more) {
        const maxId = friends.length > 0 ? last(friends).id : undefined
        const users = await fetchFriends({ id, maxId, credentials })
        friends = concat(friends, users)
        if (users.length === 0) {
          more = false
        }
      }
      resolve(friends)
    } catch (err) {
      reject(err)
    }
  })
}

const fetchFollowers = ({ id, maxId, sinceId, limit = 20, credentials }) => {
  let url = MASTODON_FOLLOWERS_URL(id)
  const args = [
    maxId && `max_id=${maxId}`,
    sinceId && `since_id=${sinceId}`,
    limit && `limit=${limit}`,
    `with_relationships=true`
  ].filter(_ => _).join('&')

  url += args ? '?' + args : ''
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
    .then((data) => data.map(parseUser))
}

const fetchFollowRequests = ({ credentials }) => {
  const url = MASTODON_FOLLOW_REQUESTS_URL
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => data.json())
    .then((data) => data.map(parseUser))
}

const fetchConversation = ({ id, credentials }) => {
  let urlContext = MASTODON_STATUS_CONTEXT_URL(id)
  return fetch(urlContext, { headers: authHeaders(credentials) })
    .then((data) => {
      if (data.ok) {
        return data
      }
      throw new Error('Error fetching timeline', data)
    })
    .then((data) => data.json())
    .then(({ ancestors, descendants }) => ({
      ancestors: ancestors.map(parseStatus),
      descendants: descendants.map(parseStatus)
    }))
}

const fetchStatus = ({ id, credentials }) => {
  let url = MASTODON_STATUS_URL(id)
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => {
      if (data.ok) {
        return data
      }
      throw new Error('Error fetching timeline', data)
    })
    .then((data) => data.json())
    .then((data) => parseStatus(data))
}

const tagUser = ({ tag, credentials, user }) => {
  const screenName = user.screen_name
  const form = {
    nicknames: [screenName],
    tags: [tag]
  }

  const headers = authHeaders(credentials)
  headers['Content-Type'] = 'application/json'

  return fetch(TAG_USER_URL, {
    method: 'PUT',
    headers: headers,
    body: JSON.stringify(form)
  })
}

const untagUser = ({ tag, credentials, user }) => {
  const screenName = user.screen_name
  const body = {
    nicknames: [screenName],
    tags: [tag]
  }

  const headers = authHeaders(credentials)
  headers['Content-Type'] = 'application/json'

  return fetch(TAG_USER_URL, {
    method: 'DELETE',
    headers: headers,
    body: JSON.stringify(body)
  })
}

const addRight = ({ right, credentials, user }) => {
  const screenName = user.screen_name

  return fetch(PERMISSION_GROUP_URL(screenName, right), {
    method: 'POST',
    headers: authHeaders(credentials),
    body: {}
  })
}

const deleteRight = ({ right, credentials, user }) => {
  const screenName = user.screen_name

  return fetch(PERMISSION_GROUP_URL(screenName, right), {
    method: 'DELETE',
    headers: authHeaders(credentials),
    body: {}
  })
}

const activateUser = ({ credentials, user: { screen_name: nickname } }) => {
  return promisedRequest({
    url: ACTIVATE_USER_URL,
    method: 'PATCH',
    credentials,
    payload: {
      nicknames: [nickname]
    }
  }).then(response => get(response, 'users.0'))
}

const deactivateUser = ({ credentials, user: { screen_name: nickname } }) => {
  return promisedRequest({
    url: DEACTIVATE_USER_URL,
    method: 'PATCH',
    credentials,
    payload: {
      nicknames: [nickname]
    }
  }).then(response => get(response, 'users.0'))
}

const deleteUser = ({ credentials, user }) => {
  const screenName = user.screen_name
  const headers = authHeaders(credentials)

  return fetch(`${ADMIN_USERS_URL}?nickname=${screenName}`, {
    method: 'DELETE',
    headers: headers
  })
}
/* eslint-disable */
const mockStatus = {
  "account": {
    "acct": "reported_account",
    "avatar": "https://develop.ilja.space/images/avi.png",
    "avatar_static": "https://develop.ilja.space/images/avi.png",
    "bot": false,
    "created_at": "2020-09-03T14:18:21.000Z",
    "display_name": "Reported Account",
    "emojis": [],
    "fields": [],
    "followers_count": 0,
    "following_count": 0,
    "header": "https://develop.ilja.space/images/banner.png",
    "header_static": "https://develop.ilja.space/images/banner.png",
    "id": "A2xvLMMFLmqUQiZSqG",
    "locked": false,
    "note": "I&#39;m an account made for an example report notification. I&#39;m the one that will be reported.",
    "pleroma": {
      "accepts_chat_messages": true,
      "ap_id": "https://develop.ilja.space/users/reported_account",
      "background_image": null,
      "confirmation_pending": false,
      "favicon": null,
      "hide_favorites": true,
      "hide_followers": false,
      "hide_followers_count": false,
      "hide_follows": false,
      "hide_follows_count": false,
      "is_admin": false,
      "is_moderator": false,
      "relationship": {},
      "skip_thread_containment": false,
      "tags": []
    },
    "source": {
      "fields": [],
      "note": "",
      "pleroma": {
        "actor_type": "Person",
        "discoverable": false
      },
      "sensitive": false
    },
    "statuses_count": 1,
    "url": "https://develop.ilja.space/users/reported_account",
    "username": "reported_account"
  },
  "application": {
    "name": "Web",
    "website": null
  },
  "bookmarked": false,
  "card": null,
  "content": "A post I made that will be included in the report",
  "created_at": "2020-09-03T14:18:51.000Z",
  "emojis": [],
  "favourited": false,
  "favourites_count": 0,
  "id": "A2xvLMMFLmqUQiZSqG",
  "in_reply_to_account_id": null,
  "in_reply_to_id": null,
  "language": null,
  "media_attachments": [],
  "mentions": [],
  "muted": false,
  "pinned": false,
  "pleroma": {
    "content": {
      "text/plain": "A post I made that will be included in the report"
    },
    "conversation_id": 7,
    "direct_conversation_id": null,
    "emoji_reactions": [],
    "expires_at": null,
    "in_reply_to_account_acct": null,
    "local": true,
    "parent_visible": false,
    "spoiler_text": {
      "text/plain": ""
    },
    "thread_muted": false
  },
  "poll": null,
  "reblog": null,
  "reblogged": false,
  "reblogs_count": 0,
  "replies_count": 0,
  "sensitive": false,
  "spoiler_text": "",
  "tags": [],
  "text": null,
  "uri": "https://develop.ilja.space/objects/8fe7611a-07e7-403a-ae08-f74580b6cc53",
  "url": "https://develop.ilja.space/notice/9ymgJaQxAbTzDDZMJs",
  "visibility": "public"
}

const report = {
  "account": {
    "acct": "reporting_account",
    "avatar": "https://develop.ilja.space/images/avi.png",
    "avatar_static": "https://develop.ilja.space/images/avi.png",
    "bot": false,
    "created_at": "2020-09-03T14:17:00.000Z",
    "display_name": "Reporting Account",
    "emojis": [],
    "fields": [],
    "followers_count": 0,
    "following_count": 0,
    "header": "https://develop.ilja.space/images/banner.png",
    "header_static": "https://develop.ilja.space/images/banner.png",
    "id": "9ymg9LnKk74wuk9lXk",
    "locked": false,
    "note": "I&#39;m an account made for an example report notification. I&#39;m the one that will do the reporting.",
    "pleroma": {
      "accepts_chat_messages": true,
      "ap_id": "https://develop.ilja.space/users/reporting_account",
      "background_image": null,
      "confirmation_pending": false,
      "deactivated": false,
      "favicon": null,
      "hide_favorites": true,
      "hide_followers": false,
      "hide_followers_count": false,
      "hide_follows": false,
      "hide_follows_count": false,
      "is_admin": false,
      "is_moderator": false,
      "relationship": {},
      "skip_thread_containment": false,
      "tags": []
    },
    "source": {
      "fields": [],
      "note": "",
      "pleroma": {
        "actor_type": "Person",
        "discoverable": false
      },
      "sensitive": false
    },
    "statuses_count": 0,
    "url": "https://develop.ilja.space/users/reporting_account",
    "username": "reporting_account"
  },
  "created_at": "2020-09-03T14:22:59.000Z",
  "id": "5",
  "pleroma": {
    "is_muted": false,
    "is_seen": false
  },
  "report": {
    "account": {
      "local": true,
      "locked": false,
      "acct": "reported_account",
      "followers_count": 0,
      "fields": [],
      "avatar": "https://develop.ilja.space/images/avi.png",
      "actor_type": "Person",
      "url": "https://develop.ilja.space/users/reported_account",
      "deactivated": false,
      "id": "9ymgGklmHjZ2OpxVLM",
      "bot": false,
      "roles": {
        "admin": false,
        "moderator": false
      },
      "statuses_count": 1,
      "nickname": "reported_account",
      "display_name": "Reported Account",
      "source": {
        "fields": [],
        "note": "",
        "pleroma": {
          "actor_type": "Person",
          "discoverable": false
        },
        "sensitive": false
      },
      "pleroma": {
        "accepts_chat_messages": true,
        "ap_id": "https://develop.ilja.space/users/reported_account",
        "background_image": null,
        "confirmation_pending": false,
        "favicon": null,
        "hide_favorites": true,
        "hide_followers": false,
        "hide_followers_count": false,
        "hide_follows": false,
        "hide_follows_count": false,
        "is_admin": false,
        "is_moderator": false,
        "relationship": {},
        "skip_thread_containment": false,
        "tags": []
      },
      "emojis": [],
      "created_at": "2020-09-03T14:18:21.000Z",
      "username": "reported_account",
      "note": "I&#39;m an account made for an example report notification. I&#39;m the one that will be reported.",
      "approval_pending": false,
      "avatar_static": "https://develop.ilja.space/images/avi.png",
      "header": "https://develop.ilja.space/images/banner.png",
      "registration_reason": null,
      "confirmation_pending": false,
      "header_static": "https://develop.ilja.space/images/banner.png",
      "following_count": 0,
      "tags": []
    },
    "actor": {
      "local": true,
      "locked": false,
      "acct": "reporting_account",
      "followers_count": 0,
      "fields": [],
      "avatar": "https://develop.ilja.space/images/avi.png",
      "actor_type": "Person",
      "url": "https://develop.ilja.space/users/reporting_account",
      "deactivated": false,
      "id": "9ymg9LnKk74wuk9lXk",
      "bot": false,
      "roles": {
        "admin": false,
        "moderator": false
      },
      "statuses_count": 0,
      "nickname": "reporting_account",
      "display_name": "Reporting Account",
      "source": {
        "fields": [],
        "note": "",
        "pleroma": {
          "actor_type": "Person",
          "discoverable": false
        },
        "sensitive": false
      },
      "pleroma": {
        "accepts_chat_messages": true,
        "ap_id": "https://develop.ilja.space/users/reporting_account",
        "background_image": null,
        "confirmation_pending": false,
        "favicon": null,
        "hide_favorites": true,
        "hide_followers": false,
        "hide_followers_count": false,
        "hide_follows": false,
        "hide_follows_count": false,
        "is_admin": false,
        "is_moderator": false,
        "relationship": {},
        "skip_thread_containment": false,
        "tags": []
      },
      "emojis": [],
      "created_at": "2020-09-03T14:17:00.000Z",
      "username": "reporting_account",
      "note": "I&#39;m an account made for an example report notification. I&#39;m the one that will do the reporting.",
      "approval_pending": false,
      "avatar_static": "https://develop.ilja.space/images/avi.png",
      "header": "https://develop.ilja.space/images/banner.png",
      "registration_reason": null,
      "confirmation_pending": false,
      "header_static": "https://develop.ilja.space/images/banner.png",
      "following_count": 0,
      "tags": []
    },
    "content": "This is the report created by &quot;reporting_account&quot;. It reports &quot;reported_account&quot;.",
    "created_at": "2020-09-03T14:22:59.000Z",
    "id": "9ymggNcUyfIW8Cq1zM",
    "notes": [
      {
        "content": "Some note left here.",
        "created_at": "2020-09-03T14:22:59.000Z",
        "id": "1"
      },
      {
        "content": "Some other note that is much much much longer than the previous note left here.",
        "created_at": "2020-09-03T14:23:59.000Z",
        "id": "2"
      }
    ],
    "state": "open",
    "statuses": [
      {
        ...mockStatus,
      },
      {
        ...mockStatus,
        content: 'This is another status that I created to be included in the report to test multiple statuses.',
        id: '123'
      }
    ]
  },
  "type": "pleroma:report"
}

const notifs2 = [{"account":{"acct":"shpuld@shpposter.club","avatar":"https://stereophonic.space/proxy/mCyl0lPWgFshoU9vTcm7vvEOSpM/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS82MmUyYTZiNzM1MzZmODBlZmVjOWJjOWY0MDRkMjdhYjMyOTQ2NzkzMDUyZjFiZmRiYjY1Mzc0ZWZlYzc0NWMyLnBuZz9uYW1lPWhhbmRfZHJhd25fZG9yZW15X2ZpLnBuZw/62e2a6b73536f80efec9bc9f404d27ab32946793052f1bfdbb65374efec745c2.png","avatar_static":"https://stereophonic.space/proxy/mCyl0lPWgFshoU9vTcm7vvEOSpM/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS82MmUyYTZiNzM1MzZmODBlZmVjOWJjOWY0MDRkMjdhYjMyOTQ2NzkzMDUyZjFiZmRiYjY1Mzc0ZWZlYzc0NWMyLnBuZz9uYW1lPWhhbmRfZHJhd25fZG9yZW15X2ZpLnBuZw/62e2a6b73536f80efec9bc9f404d27ab32946793052f1bfdbb65374efec745c2.png","bot":false,"created_at":"2019-04-19T05:37:58.000Z","display_name":"shp :blobshp: ","emojis":[{"shortcode":"blobshp","static_url":"https://stereophonic.space/proxy/99gLk4HErQqqLs-IWocZPiUWKVU/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9lbW9qaS9jdXN0b20vYmxvYnNocC5wbmc/blobshp.png","url":"https://stereophonic.space/proxy/99gLk4HErQqqLs-IWocZPiUWKVU/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9lbW9qaS9jdXN0b20vYmxvYnNocC5wbmc/blobshp.png","visible_in_picker":false}],"fields":[],"followers_count":825,"following_count":172,"header":"https://stereophonic.space/proxy/wqWHtbwjIXRc2V8EJjkS_vWQvzs/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS9mNWIxNzUyMC03YzcwLTQ2MGQtODcxZi03MGUzNjIxY2RkYzYvMDRhNGUwN2Q3ZDg4MGFjYjA0MmQ3MzNmZGQ5ODk2OGQ5OTE2ZjNiY2EwZWYwYzdhYTMxYWFjYTM1ZjZiMTNhNC5wbmc/04a4e07d7d880acb042d733fdd98968d9916f3bca0ef0c7aa31aaca35f6b13a4.png","header_static":"https://stereophonic.space/proxy/wqWHtbwjIXRc2V8EJjkS_vWQvzs/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS9mNWIxNzUyMC03YzcwLTQ2MGQtODcxZi03MGUzNjIxY2RkYzYvMDRhNGUwN2Q3ZDg4MGFjYjA0MmQ3MzNmZGQ5ODk2OGQ5OTE2ZjNiY2EwZWYwYzdhYTMxYWFjYTM1ZjZiMTNhNC5wbmc/04a4e07d7d880acb042d733fdd98968d9916f3bca0ef0c7aa31aaca35f6b13a4.png","id":"9hxJNZ8sR2bG7zLS3E","locked":false,"note":"","pleroma":{"accepts_chat_messages":true,"ap_id":"https://shpposter.club/users/shpuld","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":true,"hide_followers_count":false,"hide_follows":true,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":62787,"url":"https://shpposter.club/users/shpuld","username":"shpuld"},"created_at":"2021-01-16T11:13:48.000Z","id":"326692","pleroma":{"is_muted":false,"is_seen":false},"status":{"account":{"acct":"shpuld@shpposter.club","avatar":"https://stereophonic.space/proxy/mCyl0lPWgFshoU9vTcm7vvEOSpM/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS82MmUyYTZiNzM1MzZmODBlZmVjOWJjOWY0MDRkMjdhYjMyOTQ2NzkzMDUyZjFiZmRiYjY1Mzc0ZWZlYzc0NWMyLnBuZz9uYW1lPWhhbmRfZHJhd25fZG9yZW15X2ZpLnBuZw/62e2a6b73536f80efec9bc9f404d27ab32946793052f1bfdbb65374efec745c2.png","avatar_static":"https://stereophonic.space/proxy/mCyl0lPWgFshoU9vTcm7vvEOSpM/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS82MmUyYTZiNzM1MzZmODBlZmVjOWJjOWY0MDRkMjdhYjMyOTQ2NzkzMDUyZjFiZmRiYjY1Mzc0ZWZlYzc0NWMyLnBuZz9uYW1lPWhhbmRfZHJhd25fZG9yZW15X2ZpLnBuZw/62e2a6b73536f80efec9bc9f404d27ab32946793052f1bfdbb65374efec745c2.png","bot":false,"created_at":"2019-04-19T05:37:58.000Z","display_name":"shp :blobshp: ","emojis":[{"shortcode":"blobshp","static_url":"https://stereophonic.space/proxy/99gLk4HErQqqLs-IWocZPiUWKVU/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9lbW9qaS9jdXN0b20vYmxvYnNocC5wbmc/blobshp.png","url":"https://stereophonic.space/proxy/99gLk4HErQqqLs-IWocZPiUWKVU/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9lbW9qaS9jdXN0b20vYmxvYnNocC5wbmc/blobshp.png","visible_in_picker":false}],"fields":[],"followers_count":825,"following_count":172,"header":"https://stereophonic.space/proxy/wqWHtbwjIXRc2V8EJjkS_vWQvzs/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS9mNWIxNzUyMC03YzcwLTQ2MGQtODcxZi03MGUzNjIxY2RkYzYvMDRhNGUwN2Q3ZDg4MGFjYjA0MmQ3MzNmZGQ5ODk2OGQ5OTE2ZjNiY2EwZWYwYzdhYTMxYWFjYTM1ZjZiMTNhNC5wbmc/04a4e07d7d880acb042d733fdd98968d9916f3bca0ef0c7aa31aaca35f6b13a4.png","header_static":"https://stereophonic.space/proxy/wqWHtbwjIXRc2V8EJjkS_vWQvzs/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS9mNWIxNzUyMC03YzcwLTQ2MGQtODcxZi03MGUzNjIxY2RkYzYvMDRhNGUwN2Q3ZDg4MGFjYjA0MmQ3MzNmZGQ5ODk2OGQ5OTE2ZjNiY2EwZWYwYzdhYTMxYWFjYTM1ZjZiMTNhNC5wbmc/04a4e07d7d880acb042d733fdd98968d9916f3bca0ef0c7aa31aaca35f6b13a4.png","id":"9hxJNZ8sR2bG7zLS3E","locked":false,"note":"","pleroma":{"accepts_chat_messages":true,"ap_id":"https://shpposter.club/users/shpuld","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":true,"hide_followers_count":false,"hide_follows":true,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":62787,"url":"https://shpposter.club/users/shpuld","username":"shpuld"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"<span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9rZ3QjHZi07Ty8NV68\" href=\"https://stereophonic.space/users/newt\">@<span>newt</span></a></span> check from network tab what it&#39;s actually returning from BE when it does this","created_at":"2021-01-16T11:13:45.000Z","emojis":[],"favourited":false,"favourites_count":0,"id":"A3IFAFmm75qdDrUcWe","in_reply_to_account_id":"9rZ2STPb7FA7JnMRii","in_reply_to_id":"A3IF5X1AcKGdDeyTmi","language":null,"media_attachments":[],"mentions":[{"acct":"newt","id":"9rZ2STPb7FA7JnMRii","url":"https://stereophonic.space/users/newt","username":"newt"}],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"@newt check from network tab what it's actually returning from BE when it does this"},"conversation_id":20796406,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":"newt","local":false,"parent_visible":true,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":0,"replies_count":1,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://shpposter.club/objects/2a1d1647-d08a-4fed-81ca-5cdd525fc848","url":"https://shpposter.club/objects/2a1d1647-d08a-4fed-81ca-5cdd525fc848","visibility":"public"},"type":"mention"},{"account":{"acct":"shpuld@shpposter.club","avatar":"https://stereophonic.space/proxy/mCyl0lPWgFshoU9vTcm7vvEOSpM/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS82MmUyYTZiNzM1MzZmODBlZmVjOWJjOWY0MDRkMjdhYjMyOTQ2NzkzMDUyZjFiZmRiYjY1Mzc0ZWZlYzc0NWMyLnBuZz9uYW1lPWhhbmRfZHJhd25fZG9yZW15X2ZpLnBuZw/62e2a6b73536f80efec9bc9f404d27ab32946793052f1bfdbb65374efec745c2.png","avatar_static":"https://stereophonic.space/proxy/mCyl0lPWgFshoU9vTcm7vvEOSpM/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS82MmUyYTZiNzM1MzZmODBlZmVjOWJjOWY0MDRkMjdhYjMyOTQ2NzkzMDUyZjFiZmRiYjY1Mzc0ZWZlYzc0NWMyLnBuZz9uYW1lPWhhbmRfZHJhd25fZG9yZW15X2ZpLnBuZw/62e2a6b73536f80efec9bc9f404d27ab32946793052f1bfdbb65374efec745c2.png","bot":false,"created_at":"2019-04-19T05:37:58.000Z","display_name":"shp :blobshp: ","emojis":[{"shortcode":"blobshp","static_url":"https://stereophonic.space/proxy/99gLk4HErQqqLs-IWocZPiUWKVU/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9lbW9qaS9jdXN0b20vYmxvYnNocC5wbmc/blobshp.png","url":"https://stereophonic.space/proxy/99gLk4HErQqqLs-IWocZPiUWKVU/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9lbW9qaS9jdXN0b20vYmxvYnNocC5wbmc/blobshp.png","visible_in_picker":false}],"fields":[],"followers_count":825,"following_count":172,"header":"https://stereophonic.space/proxy/wqWHtbwjIXRc2V8EJjkS_vWQvzs/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS9mNWIxNzUyMC03YzcwLTQ2MGQtODcxZi03MGUzNjIxY2RkYzYvMDRhNGUwN2Q3ZDg4MGFjYjA0MmQ3MzNmZGQ5ODk2OGQ5OTE2ZjNiY2EwZWYwYzdhYTMxYWFjYTM1ZjZiMTNhNC5wbmc/04a4e07d7d880acb042d733fdd98968d9916f3bca0ef0c7aa31aaca35f6b13a4.png","header_static":"https://stereophonic.space/proxy/wqWHtbwjIXRc2V8EJjkS_vWQvzs/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS9mNWIxNzUyMC03YzcwLTQ2MGQtODcxZi03MGUzNjIxY2RkYzYvMDRhNGUwN2Q3ZDg4MGFjYjA0MmQ3MzNmZGQ5ODk2OGQ5OTE2ZjNiY2EwZWYwYzdhYTMxYWFjYTM1ZjZiMTNhNC5wbmc/04a4e07d7d880acb042d733fdd98968d9916f3bca0ef0c7aa31aaca35f6b13a4.png","id":"9hxJNZ8sR2bG7zLS3E","locked":false,"note":"","pleroma":{"accepts_chat_messages":true,"ap_id":"https://shpposter.club/users/shpuld","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":true,"hide_followers_count":false,"hide_follows":true,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":62787,"url":"https://shpposter.club/users/shpuld","username":"shpuld"},"created_at":"2021-01-16T11:12:32.000Z","id":"326691","pleroma":{"is_muted":false,"is_seen":false},"status":{"account":{"acct":"shpuld@shpposter.club","avatar":"https://stereophonic.space/proxy/mCyl0lPWgFshoU9vTcm7vvEOSpM/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS82MmUyYTZiNzM1MzZmODBlZmVjOWJjOWY0MDRkMjdhYjMyOTQ2NzkzMDUyZjFiZmRiYjY1Mzc0ZWZlYzc0NWMyLnBuZz9uYW1lPWhhbmRfZHJhd25fZG9yZW15X2ZpLnBuZw/62e2a6b73536f80efec9bc9f404d27ab32946793052f1bfdbb65374efec745c2.png","avatar_static":"https://stereophonic.space/proxy/mCyl0lPWgFshoU9vTcm7vvEOSpM/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS82MmUyYTZiNzM1MzZmODBlZmVjOWJjOWY0MDRkMjdhYjMyOTQ2NzkzMDUyZjFiZmRiYjY1Mzc0ZWZlYzc0NWMyLnBuZz9uYW1lPWhhbmRfZHJhd25fZG9yZW15X2ZpLnBuZw/62e2a6b73536f80efec9bc9f404d27ab32946793052f1bfdbb65374efec745c2.png","bot":false,"created_at":"2019-04-19T05:37:58.000Z","display_name":"shp :blobshp: ","emojis":[{"shortcode":"blobshp","static_url":"https://stereophonic.space/proxy/99gLk4HErQqqLs-IWocZPiUWKVU/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9lbW9qaS9jdXN0b20vYmxvYnNocC5wbmc/blobshp.png","url":"https://stereophonic.space/proxy/99gLk4HErQqqLs-IWocZPiUWKVU/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9lbW9qaS9jdXN0b20vYmxvYnNocC5wbmc/blobshp.png","visible_in_picker":false}],"fields":[],"followers_count":825,"following_count":172,"header":"https://stereophonic.space/proxy/wqWHtbwjIXRc2V8EJjkS_vWQvzs/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS9mNWIxNzUyMC03YzcwLTQ2MGQtODcxZi03MGUzNjIxY2RkYzYvMDRhNGUwN2Q3ZDg4MGFjYjA0MmQ3MzNmZGQ5ODk2OGQ5OTE2ZjNiY2EwZWYwYzdhYTMxYWFjYTM1ZjZiMTNhNC5wbmc/04a4e07d7d880acb042d733fdd98968d9916f3bca0ef0c7aa31aaca35f6b13a4.png","header_static":"https://stereophonic.space/proxy/wqWHtbwjIXRc2V8EJjkS_vWQvzs/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS9mNWIxNzUyMC03YzcwLTQ2MGQtODcxZi03MGUzNjIxY2RkYzYvMDRhNGUwN2Q3ZDg4MGFjYjA0MmQ3MzNmZGQ5ODk2OGQ5OTE2ZjNiY2EwZWYwYzdhYTMxYWFjYTM1ZjZiMTNhNC5wbmc/04a4e07d7d880acb042d733fdd98968d9916f3bca0ef0c7aa31aaca35f6b13a4.png","id":"9hxJNZ8sR2bG7zLS3E","locked":false,"note":"","pleroma":{"accepts_chat_messages":true,"ap_id":"https://shpposter.club/users/shpuld","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":true,"hide_followers_count":false,"hide_follows":true,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":62787,"url":"https://shpposter.club/users/shpuld","username":"shpuld"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"<span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9rZ3QjHZi07Ty8NV68\" href=\"https://stereophonic.space/users/newt\">@<span>newt</span></a></span> it&#39;s probably just lacking error handling for some unusual response","created_at":"2021-01-16T11:12:28.000Z","emojis":[],"favourited":false,"favourites_count":0,"id":"A3IF3EhljWNFqMnypU","in_reply_to_account_id":"9rZ2STPb7FA7JnMRii","in_reply_to_id":"A3IEyJ71v2lE46Gpii","language":null,"media_attachments":[],"mentions":[{"acct":"newt","id":"9rZ2STPb7FA7JnMRii","url":"https://stereophonic.space/users/newt","username":"newt"}],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"@newt it's probably just lacking error handling for some unusual response"},"conversation_id":20796406,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":"newt","local":false,"parent_visible":true,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":0,"replies_count":1,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://shpposter.club/objects/c70f92c2-3d11-4a35-8998-f86ca4eb3da7","url":"https://shpposter.club/objects/c70f92c2-3d11-4a35-8998-f86ca4eb3da7","visibility":"public"},"type":"mention"},{"account":{"acct":"shpuld@shpposter.club","avatar":"https://stereophonic.space/proxy/mCyl0lPWgFshoU9vTcm7vvEOSpM/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS82MmUyYTZiNzM1MzZmODBlZmVjOWJjOWY0MDRkMjdhYjMyOTQ2NzkzMDUyZjFiZmRiYjY1Mzc0ZWZlYzc0NWMyLnBuZz9uYW1lPWhhbmRfZHJhd25fZG9yZW15X2ZpLnBuZw/62e2a6b73536f80efec9bc9f404d27ab32946793052f1bfdbb65374efec745c2.png","avatar_static":"https://stereophonic.space/proxy/mCyl0lPWgFshoU9vTcm7vvEOSpM/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS82MmUyYTZiNzM1MzZmODBlZmVjOWJjOWY0MDRkMjdhYjMyOTQ2NzkzMDUyZjFiZmRiYjY1Mzc0ZWZlYzc0NWMyLnBuZz9uYW1lPWhhbmRfZHJhd25fZG9yZW15X2ZpLnBuZw/62e2a6b73536f80efec9bc9f404d27ab32946793052f1bfdbb65374efec745c2.png","bot":false,"created_at":"2019-04-19T05:37:58.000Z","display_name":"shp :blobshp: ","emojis":[{"shortcode":"blobshp","static_url":"https://stereophonic.space/proxy/99gLk4HErQqqLs-IWocZPiUWKVU/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9lbW9qaS9jdXN0b20vYmxvYnNocC5wbmc/blobshp.png","url":"https://stereophonic.space/proxy/99gLk4HErQqqLs-IWocZPiUWKVU/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9lbW9qaS9jdXN0b20vYmxvYnNocC5wbmc/blobshp.png","visible_in_picker":false}],"fields":[],"followers_count":825,"following_count":172,"header":"https://stereophonic.space/proxy/wqWHtbwjIXRc2V8EJjkS_vWQvzs/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS9mNWIxNzUyMC03YzcwLTQ2MGQtODcxZi03MGUzNjIxY2RkYzYvMDRhNGUwN2Q3ZDg4MGFjYjA0MmQ3MzNmZGQ5ODk2OGQ5OTE2ZjNiY2EwZWYwYzdhYTMxYWFjYTM1ZjZiMTNhNC5wbmc/04a4e07d7d880acb042d733fdd98968d9916f3bca0ef0c7aa31aaca35f6b13a4.png","header_static":"https://stereophonic.space/proxy/wqWHtbwjIXRc2V8EJjkS_vWQvzs/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS9mNWIxNzUyMC03YzcwLTQ2MGQtODcxZi03MGUzNjIxY2RkYzYvMDRhNGUwN2Q3ZDg4MGFjYjA0MmQ3MzNmZGQ5ODk2OGQ5OTE2ZjNiY2EwZWYwYzdhYTMxYWFjYTM1ZjZiMTNhNC5wbmc/04a4e07d7d880acb042d733fdd98968d9916f3bca0ef0c7aa31aaca35f6b13a4.png","id":"9hxJNZ8sR2bG7zLS3E","locked":false,"note":"","pleroma":{"accepts_chat_messages":true,"ap_id":"https://shpposter.club/users/shpuld","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":true,"hide_followers_count":false,"hide_follows":true,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":62787,"url":"https://shpposter.club/users/shpuld","username":"shpuld"},"created_at":"2021-01-16T11:11:10.000Z","id":"326690","pleroma":{"is_muted":false,"is_seen":false},"status":{"account":{"acct":"shpuld@shpposter.club","avatar":"https://stereophonic.space/proxy/mCyl0lPWgFshoU9vTcm7vvEOSpM/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS82MmUyYTZiNzM1MzZmODBlZmVjOWJjOWY0MDRkMjdhYjMyOTQ2NzkzMDUyZjFiZmRiYjY1Mzc0ZWZlYzc0NWMyLnBuZz9uYW1lPWhhbmRfZHJhd25fZG9yZW15X2ZpLnBuZw/62e2a6b73536f80efec9bc9f404d27ab32946793052f1bfdbb65374efec745c2.png","avatar_static":"https://stereophonic.space/proxy/mCyl0lPWgFshoU9vTcm7vvEOSpM/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS82MmUyYTZiNzM1MzZmODBlZmVjOWJjOWY0MDRkMjdhYjMyOTQ2NzkzMDUyZjFiZmRiYjY1Mzc0ZWZlYzc0NWMyLnBuZz9uYW1lPWhhbmRfZHJhd25fZG9yZW15X2ZpLnBuZw/62e2a6b73536f80efec9bc9f404d27ab32946793052f1bfdbb65374efec745c2.png","bot":false,"created_at":"2019-04-19T05:37:58.000Z","display_name":"shp :blobshp: ","emojis":[{"shortcode":"blobshp","static_url":"https://stereophonic.space/proxy/99gLk4HErQqqLs-IWocZPiUWKVU/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9lbW9qaS9jdXN0b20vYmxvYnNocC5wbmc/blobshp.png","url":"https://stereophonic.space/proxy/99gLk4HErQqqLs-IWocZPiUWKVU/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9lbW9qaS9jdXN0b20vYmxvYnNocC5wbmc/blobshp.png","visible_in_picker":false}],"fields":[],"followers_count":825,"following_count":172,"header":"https://stereophonic.space/proxy/wqWHtbwjIXRc2V8EJjkS_vWQvzs/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS9mNWIxNzUyMC03YzcwLTQ2MGQtODcxZi03MGUzNjIxY2RkYzYvMDRhNGUwN2Q3ZDg4MGFjYjA0MmQ3MzNmZGQ5ODk2OGQ5OTE2ZjNiY2EwZWYwYzdhYTMxYWFjYTM1ZjZiMTNhNC5wbmc/04a4e07d7d880acb042d733fdd98968d9916f3bca0ef0c7aa31aaca35f6b13a4.png","header_static":"https://stereophonic.space/proxy/wqWHtbwjIXRc2V8EJjkS_vWQvzs/aHR0cHM6Ly9zaHBwb3N0ZXIuY2x1Yi9tZWRpYS9mNWIxNzUyMC03YzcwLTQ2MGQtODcxZi03MGUzNjIxY2RkYzYvMDRhNGUwN2Q3ZDg4MGFjYjA0MmQ3MzNmZGQ5ODk2OGQ5OTE2ZjNiY2EwZWYwYzdhYTMxYWFjYTM1ZjZiMTNhNC5wbmc/04a4e07d7d880acb042d733fdd98968d9916f3bca0ef0c7aa31aaca35f6b13a4.png","id":"9hxJNZ8sR2bG7zLS3E","locked":false,"note":"","pleroma":{"accepts_chat_messages":true,"ap_id":"https://shpposter.club/users/shpuld","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":true,"hide_followers_count":false,"hide_follows":true,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":62787,"url":"https://shpposter.club/users/shpuld","username":"shpuld"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"<span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9rZ3QjHZi07Ty8NV68\" href=\"https://stereophonic.space/users/newt\">@<span>newt</span></a></span> wonder how it ends up like that, must be a bug happening earlier on","created_at":"2021-01-16T11:11:07.000Z","emojis":[],"favourited":false,"favourites_count":0,"id":"A3IEvgoJLzWuh8Gb3I","in_reply_to_account_id":"9rZ2STPb7FA7JnMRii","in_reply_to_id":"A3IEMMxp9Psb0RsGpc","language":null,"media_attachments":[],"mentions":[{"acct":"newt","id":"9rZ2STPb7FA7JnMRii","url":"https://stereophonic.space/users/newt","username":"newt"}],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"@newt wonder how it ends up like that, must be a bug happening earlier on"},"conversation_id":20796406,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":"newt","local":false,"parent_visible":true,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":0,"replies_count":1,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://shpposter.club/objects/0039c5b9-38be-4285-8feb-b1c6a28d6089","url":"https://shpposter.club/objects/0039c5b9-38be-4285-8feb-b1c6a28d6089","visibility":"public"},"type":"mention"},{"account":{"acct":"Waroorc@shitposter.club","avatar":"https://stereophonic.space/images/avi.png","avatar_static":"https://stereophonic.space/images/avi.png","bot":false,"created_at":"2021-01-16T06:34:18.000Z","display_name":"Plain","emojis":[],"fields":[],"followers_count":0,"following_count":16,"header":"https://stereophonic.space/images/banner.png","header_static":"https://stereophonic.space/images/banner.png","id":"A3HqDk7iTRcpNhW4xM","locked":false,"note":"","pleroma":{"accepts_chat_messages":true,"ap_id":"https://shitposter.club/users/Waroorc","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":0,"url":"https://shitposter.club/users/Waroorc","username":"Waroorc"},"created_at":"2021-01-16T06:34:20.000Z","id":"326657","pleroma":{"is_muted":false,"is_seen":false},"type":"follow"},{"account":{"acct":"vaartis@pl.kotobank.ch","avatar":"https://stereophonic.space/proxy/0HXNgAwa0SJSeUQxMYOlw8LuVDs/aHR0cHM6Ly9wbC5rb3RvYmFuay5jaC9tZWRpYS8wMDQyYjQ5OTVkMTc5NTUyNmI3MTkxODY5ZjE3YWM4YmZlOTY2ZGFkOThmMDAxMTc0ZGQzMTNlYWU4N2Q2MzgwLnBuZz9uYW1lPWJsb2IucG5n/0042b4995d1795526b7191869f17ac8bfe966dad98f001174dd313eae87d6380.png","avatar_static":"https://stereophonic.space/proxy/0HXNgAwa0SJSeUQxMYOlw8LuVDs/aHR0cHM6Ly9wbC5rb3RvYmFuay5jaC9tZWRpYS8wMDQyYjQ5OTVkMTc5NTUyNmI3MTkxODY5ZjE3YWM4YmZlOTY2ZGFkOThmMDAxMTc0ZGQzMTNlYWU4N2Q2MzgwLnBuZz9uYW1lPWJsb2IucG5n/0042b4995d1795526b7191869f17ac8bfe966dad98f001174dd313eae87d6380.png","bot":false,"created_at":"2019-04-19T14:13:04.000Z","display_name":"vaartis von BSD-2-Clause","emojis":[],"fields":[],"followers_count":460,"following_count":25,"header":"https://stereophonic.space/proxy/is3uELq2dc3rQ97kqPSdi-uNmq4/aHR0cHM6Ly9wbC5rb3RvYmFuay5jaC9tZWRpYS81Yzk0ODAwM2E2MTk3ODYxZTg5ZmJmY2M4N2JiNDhhOGU1YzA0ZDllYzkxZTc0NjcwOGVmMzIzYzhmMDg2NTI5LnBuZw/5c948003a6197861e89fbfcc87bb48a8e5c04d9ec91e746708ef323c8f086529.png","header_static":"https://stereophonic.space/proxy/is3uELq2dc3rQ97kqPSdi-uNmq4/aHR0cHM6Ly9wbC5rb3RvYmFuay5jaC9tZWRpYS81Yzk0ODAwM2E2MTk3ODYxZTg5ZmJmY2M4N2JiNDhhOGU1YzA0ZDllYzkxZTc0NjcwOGVmMzIzYzhmMDg2NTI5LnBuZw/5c948003a6197861e89fbfcc87bb48a8e5c04d9ec91e746708ef323c8f086529.png","id":"9hy3LjY2BgKJGdssNM","locked":false,"note":"A programmer interested in functional things. Carrot mistress. No stopping till scalies are topping. Just having fun here. Let&#39;s be friends!<br/><br/>profile picture by <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"29\" href=\"https://niu.moe/@rye\">@<span>rye@niu.moe</span></a></span><br/><br/>Github: <a href=\"https://github.com/vaartis\">https://github.com/vaartis</a><br/>Thing I&#39;m working on right now:  <a href=\"https://vaartis.itch.io/someone\">https://vaartis.itch.io/someone</a><br/>liberapay apparently <a href=\"https://liberapay.com/vaartis/\">https://liberapay.com/vaartis/</a><br/>Also a &quot;blog&quot;: <a href=\"https://kotobank.ch/~vaartis/\">https://kotobank.ch/~vaartis/</a><br/><a class=\"hashtag\" data-tag=\"nobot\" href=\"https://pl.kotobank.ch/tag/nobot\">#nobot</a>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://pl.kotobank.ch/users/vaartis","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":24597,"url":"https://pl.kotobank.ch/users/vaartis","username":"vaartis"},"created_at":"2021-01-16T05:41:26.000Z","id":"326645","pleroma":{"is_muted":false,"is_seen":false},"status":{"account":{"acct":"vaartis@pl.kotobank.ch","avatar":"https://stereophonic.space/proxy/0HXNgAwa0SJSeUQxMYOlw8LuVDs/aHR0cHM6Ly9wbC5rb3RvYmFuay5jaC9tZWRpYS8wMDQyYjQ5OTVkMTc5NTUyNmI3MTkxODY5ZjE3YWM4YmZlOTY2ZGFkOThmMDAxMTc0ZGQzMTNlYWU4N2Q2MzgwLnBuZz9uYW1lPWJsb2IucG5n/0042b4995d1795526b7191869f17ac8bfe966dad98f001174dd313eae87d6380.png","avatar_static":"https://stereophonic.space/proxy/0HXNgAwa0SJSeUQxMYOlw8LuVDs/aHR0cHM6Ly9wbC5rb3RvYmFuay5jaC9tZWRpYS8wMDQyYjQ5OTVkMTc5NTUyNmI3MTkxODY5ZjE3YWM4YmZlOTY2ZGFkOThmMDAxMTc0ZGQzMTNlYWU4N2Q2MzgwLnBuZz9uYW1lPWJsb2IucG5n/0042b4995d1795526b7191869f17ac8bfe966dad98f001174dd313eae87d6380.png","bot":false,"created_at":"2019-04-19T14:13:04.000Z","display_name":"vaartis von BSD-2-Clause","emojis":[],"fields":[],"followers_count":460,"following_count":25,"header":"https://stereophonic.space/proxy/is3uELq2dc3rQ97kqPSdi-uNmq4/aHR0cHM6Ly9wbC5rb3RvYmFuay5jaC9tZWRpYS81Yzk0ODAwM2E2MTk3ODYxZTg5ZmJmY2M4N2JiNDhhOGU1YzA0ZDllYzkxZTc0NjcwOGVmMzIzYzhmMDg2NTI5LnBuZw/5c948003a6197861e89fbfcc87bb48a8e5c04d9ec91e746708ef323c8f086529.png","header_static":"https://stereophonic.space/proxy/is3uELq2dc3rQ97kqPSdi-uNmq4/aHR0cHM6Ly9wbC5rb3RvYmFuay5jaC9tZWRpYS81Yzk0ODAwM2E2MTk3ODYxZTg5ZmJmY2M4N2JiNDhhOGU1YzA0ZDllYzkxZTc0NjcwOGVmMzIzYzhmMDg2NTI5LnBuZw/5c948003a6197861e89fbfcc87bb48a8e5c04d9ec91e746708ef323c8f086529.png","id":"9hy3LjY2BgKJGdssNM","locked":false,"note":"A programmer interested in functional things. Carrot mistress. No stopping till scalies are topping. Just having fun here. Let&#39;s be friends!<br/><br/>profile picture by <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"29\" href=\"https://niu.moe/@rye\">@<span>rye@niu.moe</span></a></span><br/><br/>Github: <a href=\"https://github.com/vaartis\">https://github.com/vaartis</a><br/>Thing I&#39;m working on right now:  <a href=\"https://vaartis.itch.io/someone\">https://vaartis.itch.io/someone</a><br/>liberapay apparently <a href=\"https://liberapay.com/vaartis/\">https://liberapay.com/vaartis/</a><br/>Also a &quot;blog&quot;: <a href=\"https://kotobank.ch/~vaartis/\">https://kotobank.ch/~vaartis/</a><br/><a class=\"hashtag\" data-tag=\"nobot\" href=\"https://pl.kotobank.ch/tag/nobot\">#nobot</a>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://pl.kotobank.ch/users/vaartis","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":24597,"url":"https://pl.kotobank.ch/users/vaartis","username":"vaartis"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"<span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9qrXalMYDhWHvvVp20\" href=\"https://lain.com/users/lain\">@<span>lain</span></a></span> <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9rZ3M7j3axae1l5XFo\" href=\"https://stereophonic.space/users/newt\">@<span>newt</span></a></span> not durov that&#39;s for sure, probably not others too. he moved from russia a while ago and probably took the team with him.","created_at":"2021-01-16T05:40:00.000Z","emojis":[],"favourited":false,"favourites_count":0,"id":"A3HlVARLNor49XBc5Q","in_reply_to_account_id":"9qrXewWxfr80iavPVY","in_reply_to_id":"A3HHdH3JgWNoLvtgXY","language":null,"media_attachments":[],"mentions":[{"acct":"lain@lain.com","id":"9qrXewWxfr80iavPVY","url":"https://lain.com/users/lain","username":"lain"},{"acct":"newt","id":"9rZ2STPb7FA7JnMRii","url":"https://stereophonic.space/users/newt","username":"newt"}],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"@lain @newt not durov that's for sure, probably not others too. he moved from russia a while ago and probably took the team with him."},"conversation_id":20784105,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":"lain@lain.com","local":false,"parent_visible":true,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":0,"replies_count":0,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://pl.kotobank.ch/objects/bc8f0ce9-978d-4834-860e-c828a66d2074","url":"https://pl.kotobank.ch/objects/bc8f0ce9-978d-4834-860e-c828a66d2074","visibility":"public"},"type":"mention"},{"account":{"acct":"luka@neue.city","avatar":"https://stereophonic.space/proxy/hyI6Cu5NNjQu62uAngvPZuDkbdc/aHR0cHM6Ly9uZXVlLmNpdHkvbWVkaWEvM2Q4NWU3NjA4YmIxOWVjZTE0ZDJhNmE4ZWM2YzdiNDc0OTAxN2YwMjA0MTQ4YWZmZTMxMmU1NDhkZGE0ZDQ0Zi5ibG9iP25hbWU9YmxvYg/3d85e7608bb19ece14d2a6a8ec6c7b4749017f0204148affe312e548dda4d44f.blob","avatar_static":"https://stereophonic.space/proxy/hyI6Cu5NNjQu62uAngvPZuDkbdc/aHR0cHM6Ly9uZXVlLmNpdHkvbWVkaWEvM2Q4NWU3NjA4YmIxOWVjZTE0ZDJhNmE4ZWM2YzdiNDc0OTAxN2YwMjA0MTQ4YWZmZTMxMmU1NDhkZGE0ZDQ0Zi5ibG9iP25hbWU9YmxvYg/3d85e7608bb19ece14d2a6a8ec6c7b4749017f0204148affe312e548dda4d44f.blob","bot":false,"created_at":"2021-01-13T18:23:51.000Z","display_name":"Luke N. Arnold","emojis":[],"fields":[{"name":"Website","value":"<a href=\"http://lukalot.github.io\">lukalot.github.io</a>"},{"name":"Discord","value":"Lukalot#9396 [DM before friend rq please]"}],"followers_count":0,"following_count":0,"header":"https://stereophonic.space/proxy/yaeK5HPDQ4_HiD-Omhma3mz3DkQ/aHR0cHM6Ly9uZXVlLmNpdHkvbWVkaWEvZWUxMjgwMjc4M2FlYjFlYTY2ODA1Y2JiYmI1NDg5Nzg1OWRkYmVhNTk5NjZkN2I5YzhmZDIyNmUxNWNhYzgwYy5wbmc_bmFtZT1nYWxsZXJ5SW1hZ2UucG5n/ee12802783aeb1ea66805cbbbb54897859ddbea59966d7b9c8fd226e15cac80c.png","header_static":"https://stereophonic.space/proxy/yaeK5HPDQ4_HiD-Omhma3mz3DkQ/aHR0cHM6Ly9uZXVlLmNpdHkvbWVkaWEvZWUxMjgwMjc4M2FlYjFlYTY2ODA1Y2JiYmI1NDg5Nzg1OWRkYmVhNTk5NjZkN2I5YzhmZDIyNmUxNWNhYzgwYy5wbmc_bmFtZT1nYWxsZXJ5SW1hZ2UucG5n/ee12802783aeb1ea66805cbbbb54897859ddbea59966d7b9c8fd226e15cac80c.png","id":"A3Ce0HWnJGSPgmGHLc","locked":false,"note":"An artist and programmer. Besides those, I also love games, 1960&#39;s music, and reading (especially science fiction and horror). Feel free to message me here or on Discord.","pleroma":{"accepts_chat_messages":true,"ap_id":"https://neue.city/users/luka","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":true},"sensitive":false},"statuses_count":18,"url":"https://neue.city/users/luka","username":"luka"},"created_at":"2021-01-16T03:44:02.000Z","id":"326632","pleroma":{"is_muted":false,"is_seen":false},"status":null,"type":"favourite"},{"account":{"acct":"partridge@elves.forsale","avatar":"https://stereophonic.space/proxy/VWcL6_S5CE_pg4cMux08AcHUyeo/aHR0cHM6Ly9lbHZlcy5mb3JzYWxlL21lZGlhL2Y5OTQ3MGE4ZmExOTM2ZGY0YTMzZWIxZTgwYjg2NDFmMjNiMmYxM2Y1MjdjN2RkNjUzMTczNWMwYzRmZDhmNDEuanBnP25hbWU9YmxvYi5qcGc/f99470a8fa1936df4a33eb1e80b8641f23b2f13f527c7dd6531735c0c4fd8f41.jpg","avatar_static":"https://stereophonic.space/proxy/VWcL6_S5CE_pg4cMux08AcHUyeo/aHR0cHM6Ly9lbHZlcy5mb3JzYWxlL21lZGlhL2Y5OTQ3MGE4ZmExOTM2ZGY0YTMzZWIxZTgwYjg2NDFmMjNiMmYxM2Y1MjdjN2RkNjUzMTczNWMwYzRmZDhmNDEuanBnP25hbWU9YmxvYi5qcGc/f99470a8fa1936df4a33eb1e80b8641f23b2f13f527c7dd6531735c0c4fd8f41.jpg","bot":false,"created_at":"2019-09-18T01:59:25.000Z","display_name":"parts","emojis":[],"fields":[{"name":"xmpp","value":"this username at xmpp dot co"},{"name":"o meme finger print","value":"69711de9 177a7aa0 54b117ce b2e3a9e7 1cb043cd 14120454 6f32102f c35fbb13"}],"followers_count":186,"following_count":224,"header":"https://stereophonic.space/proxy/6U6F7vWd-KNewAY6XXa-5JbpIdM/aHR0cHM6Ly9lbHZlcy5mb3JzYWxlL21lZGlhLzNmZWMxOTJiMWJjMWEzOGFlYTcwZmM2YzAyNGVlZGYxZDQyOGVkNWRkNGFiNTZhYTI3MWJhNjRmZDBiNTY0NmMuZ2lmP25hbWU9aGlnaF9lbGZfZHJpbmsuZ2lm/3fec192b1bc1a38aea70fc6c024eedf1d428ed5dd4ab56aa271ba64fd0b5646c.gif","header_static":"https://stereophonic.space/proxy/6U6F7vWd-KNewAY6XXa-5JbpIdM/aHR0cHM6Ly9lbHZlcy5mb3JzYWxlL21lZGlhLzNmZWMxOTJiMWJjMWEzOGFlYTcwZmM2YzAyNGVlZGYxZDQyOGVkNWRkNGFiNTZhYTI3MWJhNjRmZDBiNTY0NmMuZ2lmP25hbWU9aGlnaF9lbGZfZHJpbmsuZ2lm/3fec192b1bc1a38aea70fc6c024eedf1d428ed5dd4ab56aa271ba64fd0b5646c.gif","id":"9n23ySvRj1DdWtVq64","locked":false,"note":"vibing and imbibing<br/>unapologetic meltyblood player<br/>admin of this bastard fucking instance<br/><br/>he/him 22 years mtl<br/>i post lewds but i always click the little checkbox so it&#39;s fine<br/>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://elves.forsale/users/partridge","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":true,"hide_followers_count":false,"hide_follows":true,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":3299,"url":"https://elves.forsale/users/partridge","username":"partridge"},"created_at":"2021-01-16T03:35:05.000Z","id":"326631","pleroma":{"is_muted":false,"is_seen":false},"status":{"account":{"acct":"partridge@elves.forsale","avatar":"https://stereophonic.space/proxy/VWcL6_S5CE_pg4cMux08AcHUyeo/aHR0cHM6Ly9lbHZlcy5mb3JzYWxlL21lZGlhL2Y5OTQ3MGE4ZmExOTM2ZGY0YTMzZWIxZTgwYjg2NDFmMjNiMmYxM2Y1MjdjN2RkNjUzMTczNWMwYzRmZDhmNDEuanBnP25hbWU9YmxvYi5qcGc/f99470a8fa1936df4a33eb1e80b8641f23b2f13f527c7dd6531735c0c4fd8f41.jpg","avatar_static":"https://stereophonic.space/proxy/VWcL6_S5CE_pg4cMux08AcHUyeo/aHR0cHM6Ly9lbHZlcy5mb3JzYWxlL21lZGlhL2Y5OTQ3MGE4ZmExOTM2ZGY0YTMzZWIxZTgwYjg2NDFmMjNiMmYxM2Y1MjdjN2RkNjUzMTczNWMwYzRmZDhmNDEuanBnP25hbWU9YmxvYi5qcGc/f99470a8fa1936df4a33eb1e80b8641f23b2f13f527c7dd6531735c0c4fd8f41.jpg","bot":false,"created_at":"2019-09-18T01:59:25.000Z","display_name":"parts","emojis":[],"fields":[{"name":"xmpp","value":"this username at xmpp dot co"},{"name":"o meme finger print","value":"69711de9 177a7aa0 54b117ce b2e3a9e7 1cb043cd 14120454 6f32102f c35fbb13"}],"followers_count":186,"following_count":224,"header":"https://stereophonic.space/proxy/6U6F7vWd-KNewAY6XXa-5JbpIdM/aHR0cHM6Ly9lbHZlcy5mb3JzYWxlL21lZGlhLzNmZWMxOTJiMWJjMWEzOGFlYTcwZmM2YzAyNGVlZGYxZDQyOGVkNWRkNGFiNTZhYTI3MWJhNjRmZDBiNTY0NmMuZ2lmP25hbWU9aGlnaF9lbGZfZHJpbmsuZ2lm/3fec192b1bc1a38aea70fc6c024eedf1d428ed5dd4ab56aa271ba64fd0b5646c.gif","header_static":"https://stereophonic.space/proxy/6U6F7vWd-KNewAY6XXa-5JbpIdM/aHR0cHM6Ly9lbHZlcy5mb3JzYWxlL21lZGlhLzNmZWMxOTJiMWJjMWEzOGFlYTcwZmM2YzAyNGVlZGYxZDQyOGVkNWRkNGFiNTZhYTI3MWJhNjRmZDBiNTY0NmMuZ2lmP25hbWU9aGlnaF9lbGZfZHJpbmsuZ2lm/3fec192b1bc1a38aea70fc6c024eedf1d428ed5dd4ab56aa271ba64fd0b5646c.gif","id":"9n23ySvRj1DdWtVq64","locked":false,"note":"vibing and imbibing<br/>unapologetic meltyblood player<br/>admin of this bastard fucking instance<br/><br/>he/him 22 years mtl<br/>i post lewds but i always click the little checkbox so it&#39;s fine<br/>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://elves.forsale/users/partridge","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":true,"hide_followers_count":false,"hide_follows":true,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":3299,"url":"https://elves.forsale/users/partridge","username":"partridge"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"<span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9rZ7rGwYdtPCJPWDCq\" href=\"https://stereophonic.space/users/newt\">@<span>newt</span></a></span> my favorite hn post was someone complaining about people who are always down on big companies like amazon, only to have someone point out that their previous comment said &quot;i own 500k in amazon stock&quot;","created_at":"2021-01-16T03:35:02.000Z","emojis":[],"favourited":true,"favourites_count":3,"id":"A3HaE2iHl6yJlnk5Ym","in_reply_to_account_id":null,"in_reply_to_id":null,"language":null,"media_attachments":[],"mentions":[{"acct":"newt","id":"9rZ2STPb7FA7JnMRii","url":"https://stereophonic.space/users/newt","username":"newt"}],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"@newt my favorite hn post was someone complaining about people who are always down on big companies like amazon, only to have someone point out that their previous comment said \"i own 500k in amazon stock\""},"conversation_id":17495909,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":null,"local":false,"parent_visible":false,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":0,"replies_count":0,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://elves.forsale/objects/289e8337-a4f4-40ca-813d-4d8913292bfb","url":"https://elves.forsale/objects/289e8337-a4f4-40ca-813d-4d8913292bfb","visibility":"public"},"type":"mention"},{"account":{"acct":"gaige@neue.city","avatar":"https://stereophonic.space/proxy/yFMKYiPRb7HqOOqoBvIlE48pOQ4/aHR0cHM6Ly9uZXVlLmNpdHkvbWVkaWEvMDIyZTEyZmFlNTI4NjdlMDA5NDQ2Yjc5YWI5ZjIwZWM4ZjhiOTRhNGEyZGZhNjAzODE0NThiMDFiNjBjZGIxMy5ibG9iP25hbWU9YmxvYg/022e12fae52867e009446b79ab9f20ec8f8b94a4a2dfa60381458b01b60cdb13.blob","avatar_static":"https://stereophonic.space/proxy/yFMKYiPRb7HqOOqoBvIlE48pOQ4/aHR0cHM6Ly9uZXVlLmNpdHkvbWVkaWEvMDIyZTEyZmFlNTI4NjdlMDA5NDQ2Yjc5YWI5ZjIwZWM4ZjhiOTRhNGEyZGZhNjAzODE0NThiMDFiNjBjZGIxMy5ibG9iP25hbWU9YmxvYg/022e12fae52867e009446b79ab9f20ec8f8b94a4a2dfa60381458b01b60cdb13.blob","bot":false,"created_at":"2020-03-25T21:35:16.000Z","display_name":"working vala :verifiedsabakan: ","emojis":[{"shortcode":"asukaPout","static_url":"https://stereophonic.space/proxy/zyFns5kHTDRfUxyv8bmFKpz1wko/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvYXN1a2EvYXN1a2FQb3V0LnBuZw/asukaPout.png","url":"https://stereophonic.space/proxy/zyFns5kHTDRfUxyv8bmFKpz1wko/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvYXN1a2EvYXN1a2FQb3V0LnBuZw/asukaPout.png","visible_in_picker":false},{"shortcode":"cirno_comfy","static_url":"https://stereophonic.space/proxy/WfKLe9y4M6QFIOiHG-ulR8RDuSs/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvdG91aG91L2Npcm5vX2NvbWZ5LnBuZw/cirno_comfy.png","url":"https://stereophonic.space/proxy/WfKLe9y4M6QFIOiHG-ulR8RDuSs/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvdG91aG91L2Npcm5vX2NvbWZ5LnBuZw/cirno_comfy.png","visible_in_picker":false},{"shortcode":"corndog","static_url":"https://stereophonic.space/proxy/2zCawCx7ox2BRrf3MqaSqGIpngo/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvdG91aG91L2Nvcm5kb2cucG5n/corndog.png","url":"https://stereophonic.space/proxy/2zCawCx7ox2BRrf3MqaSqGIpngo/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvdG91aG91L2Nvcm5kb2cucG5n/corndog.png","visible_in_picker":false},{"shortcode":"debian","static_url":"https://stereophonic.space/proxy/w_tO63_AjzH9E7fIZci-GhWInfY/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvZGlzdHJvcy9kZWJpYW4ucG5n/debian.png","url":"https://stereophonic.space/proxy/w_tO63_AjzH9E7fIZci-GhWInfY/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvZGlzdHJvcy9kZWJpYW4ucG5n/debian.png","visible_in_picker":false},{"shortcode":"lain","static_url":"https://stereophonic.space/proxy/d8hdGpQW9LYFeFRNhH8qAnNhzLs/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvbGFpbi9sYWluLnBuZw/lain.png","url":"https://stereophonic.space/proxy/d8hdGpQW9LYFeFRNhH8qAnNhzLs/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvbGFpbi9sYWluLnBuZw/lain.png","visible_in_picker":false},{"shortcode":"pleroma_seal","static_url":"https://stereophonic.space/proxy/CQNil1-oQ_V48yrp1rwIgUhnhpY/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvbWVtZXMvcGxlcm9tYV9zZWFsLnBuZw/pleroma_seal.png","url":"https://stereophonic.space/proxy/CQNil1-oQ_V48yrp1rwIgUhnhpY/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvbWVtZXMvcGxlcm9tYV9zZWFsLnBuZw/pleroma_seal.png","visible_in_picker":false},{"shortcode":"raveSmug","static_url":"https://stereophonic.space/proxy/bQ4W7oLEiYgF7z0_lsW2WLeCfeQ/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvY3VzdG9tL3JhdmVTbXVnLnBuZw/raveSmug.png","url":"https://stereophonic.space/proxy/bQ4W7oLEiYgF7z0_lsW2WLeCfeQ/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvY3VzdG9tL3JhdmVTbXVnLnBuZw/raveSmug.png","visible_in_picker":false},{"shortcode":"sataniaNoBulli","static_url":"https://stereophonic.space/proxy/b0DL-MeIUvqdPN0zJwkCT8KIaSc/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvYW5pbWUvc2F0YW5pYU5vQnVsbGkucG5n/sataniaNoBulli.png","url":"https://stereophonic.space/proxy/b0DL-MeIUvqdPN0zJwkCT8KIaSc/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvYW5pbWUvc2F0YW5pYU5vQnVsbGkucG5n/sataniaNoBulli.png","visible_in_picker":false},{"shortcode":"verifiedsabakan","static_url":"https://stereophonic.space/proxy/MbUaXLpXh3ZK7ehIKZqDoyZaCqU/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvbGFiZWxzL3ZlcmlmaWVkc2FiYWthbi5wbmc/verifiedsabakan.png","url":"https://stereophonic.space/proxy/MbUaXLpXh3ZK7ehIKZqDoyZaCqU/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvbGFiZWxzL3ZlcmlmaWVkc2FiYWthbi5wbmc/verifiedsabakan.png","visible_in_picker":false},{"shortcode":"welovelain","static_url":"https://stereophonic.space/proxy/hAlsiSzic1IqFo-G9w3ZWerAg6Q/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvY3VzdG9tL3dlbG92ZWxhaW4ucG5n/welovelain.png","url":"https://stereophonic.space/proxy/hAlsiSzic1IqFo-G9w3ZWerAg6Q/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvY3VzdG9tL3dlbG92ZWxhaW4ucG5n/welovelain.png","visible_in_picker":false}],"fields":[{"name":"cofe?","value":"hell yeah."},{"name":"blÃ¥haj?","value":"everyday."},{"name":"urbit","value":"~difreg-dasrys"},{"name":"alt. account","value":"<a href=\"https://lets.bemoe.online/users/vala\" rel=\"ugc\">@vala@lets.bemoe.online</a>"},{"name":"xmpp","value":"<a href=\"xmpp://vala@neue.city\">xmpp://vala@neue.city</a>"},{"name":"gacha","value":"sucker"}],"followers_count":147,"following_count":78,"header":"https://stereophonic.space/proxy/algbU9JR1QK-UVTeekBSp30CDLQ/aHR0cHM6Ly9uZXVlLmNpdHkvbWVkaWEvM2Q2YzA5MDZmZDg2ZjgyZTY3YTY1OGQ2MDAxOTc1N2EyNjIwOWIyNGNkZjkwZTgxNzBlMWI5Njg2MWQ1ZjkxOC5qcGc_bmFtZT1CMDA1NTQ4LVIxLTE1LTE0QS5qcGc/3d6c0906fd86f82e67a658d60019757a26209b24cdf90e8170e1b96861d5f918.jpg","header_static":"https://stereophonic.space/proxy/algbU9JR1QK-UVTeekBSp30CDLQ/aHR0cHM6Ly9uZXVlLmNpdHkvbWVkaWEvM2Q2YzA5MDZmZDg2ZjgyZTY3YTY1OGQ2MDAxOTc1N2EyNjIwOWIyNGNkZjkwZTgxNzBlMWI5Njg2MWQ1ZjkxOC5qcGc_bmFtZT1CMDA1NTQ4LVIxLTE1LTE0QS5qcGc/3d6c0906fd86f82e67a658d60019757a26209b24cdf90e8170e1b96861d5f918.jpg","id":"9tO7DH9HqBbxkWv3gG","locked":false,"note":"â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²<br/>gaige or vala<br/>comes from a land of ice and snow :cirno_comfy:<br/><br/>just imagine every word i ever say, in cursive comic sans<br/>i generally float around here while being a â‘¨<br/><br/>:corndog: the official server-maid in this pleroma neighbourhood of the fediverse :pleroma_seal:<br/>i cant program in anything<br/><br/>used to post at <a href=\"http://ilovela.in\">ilovela.in</a> and <a href=\"http://welovela.in\">welovela.in</a> :welovelain:<br/><br/>will judge you for your taste in cars<br/>â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²<br/>:debian: :lain: :raveSmug: :sataniaNoBulli:  :asukaPout:","pleroma":{"accepts_chat_messages":true,"ap_id":"https://neue.city/users/gaige","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":true},"sensitive":false},"statuses_count":5946,"url":"https://neue.city/users/gaige","username":"gaige"},"created_at":"2021-01-16T03:33:28.000Z","id":"326630","pleroma":{"is_muted":false,"is_seen":false},"status":null,"type":"favourite"},{"account":{"acct":"gaige@neue.city","avatar":"https://stereophonic.space/proxy/yFMKYiPRb7HqOOqoBvIlE48pOQ4/aHR0cHM6Ly9uZXVlLmNpdHkvbWVkaWEvMDIyZTEyZmFlNTI4NjdlMDA5NDQ2Yjc5YWI5ZjIwZWM4ZjhiOTRhNGEyZGZhNjAzODE0NThiMDFiNjBjZGIxMy5ibG9iP25hbWU9YmxvYg/022e12fae52867e009446b79ab9f20ec8f8b94a4a2dfa60381458b01b60cdb13.blob","avatar_static":"https://stereophonic.space/proxy/yFMKYiPRb7HqOOqoBvIlE48pOQ4/aHR0cHM6Ly9uZXVlLmNpdHkvbWVkaWEvMDIyZTEyZmFlNTI4NjdlMDA5NDQ2Yjc5YWI5ZjIwZWM4ZjhiOTRhNGEyZGZhNjAzODE0NThiMDFiNjBjZGIxMy5ibG9iP25hbWU9YmxvYg/022e12fae52867e009446b79ab9f20ec8f8b94a4a2dfa60381458b01b60cdb13.blob","bot":false,"created_at":"2020-03-25T21:35:16.000Z","display_name":"working vala :verifiedsabakan: ","emojis":[{"shortcode":"asukaPout","static_url":"https://stereophonic.space/proxy/zyFns5kHTDRfUxyv8bmFKpz1wko/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvYXN1a2EvYXN1a2FQb3V0LnBuZw/asukaPout.png","url":"https://stereophonic.space/proxy/zyFns5kHTDRfUxyv8bmFKpz1wko/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvYXN1a2EvYXN1a2FQb3V0LnBuZw/asukaPout.png","visible_in_picker":false},{"shortcode":"cirno_comfy","static_url":"https://stereophonic.space/proxy/WfKLe9y4M6QFIOiHG-ulR8RDuSs/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvdG91aG91L2Npcm5vX2NvbWZ5LnBuZw/cirno_comfy.png","url":"https://stereophonic.space/proxy/WfKLe9y4M6QFIOiHG-ulR8RDuSs/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvdG91aG91L2Npcm5vX2NvbWZ5LnBuZw/cirno_comfy.png","visible_in_picker":false},{"shortcode":"corndog","static_url":"https://stereophonic.space/proxy/2zCawCx7ox2BRrf3MqaSqGIpngo/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvdG91aG91L2Nvcm5kb2cucG5n/corndog.png","url":"https://stereophonic.space/proxy/2zCawCx7ox2BRrf3MqaSqGIpngo/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvdG91aG91L2Nvcm5kb2cucG5n/corndog.png","visible_in_picker":false},{"shortcode":"debian","static_url":"https://stereophonic.space/proxy/w_tO63_AjzH9E7fIZci-GhWInfY/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvZGlzdHJvcy9kZWJpYW4ucG5n/debian.png","url":"https://stereophonic.space/proxy/w_tO63_AjzH9E7fIZci-GhWInfY/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvZGlzdHJvcy9kZWJpYW4ucG5n/debian.png","visible_in_picker":false},{"shortcode":"lain","static_url":"https://stereophonic.space/proxy/d8hdGpQW9LYFeFRNhH8qAnNhzLs/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvbGFpbi9sYWluLnBuZw/lain.png","url":"https://stereophonic.space/proxy/d8hdGpQW9LYFeFRNhH8qAnNhzLs/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvbGFpbi9sYWluLnBuZw/lain.png","visible_in_picker":false},{"shortcode":"pleroma_seal","static_url":"https://stereophonic.space/proxy/CQNil1-oQ_V48yrp1rwIgUhnhpY/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvbWVtZXMvcGxlcm9tYV9zZWFsLnBuZw/pleroma_seal.png","url":"https://stereophonic.space/proxy/CQNil1-oQ_V48yrp1rwIgUhnhpY/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvbWVtZXMvcGxlcm9tYV9zZWFsLnBuZw/pleroma_seal.png","visible_in_picker":false},{"shortcode":"raveSmug","static_url":"https://stereophonic.space/proxy/bQ4W7oLEiYgF7z0_lsW2WLeCfeQ/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvY3VzdG9tL3JhdmVTbXVnLnBuZw/raveSmug.png","url":"https://stereophonic.space/proxy/bQ4W7oLEiYgF7z0_lsW2WLeCfeQ/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvY3VzdG9tL3JhdmVTbXVnLnBuZw/raveSmug.png","visible_in_picker":false},{"shortcode":"sataniaNoBulli","static_url":"https://stereophonic.space/proxy/b0DL-MeIUvqdPN0zJwkCT8KIaSc/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvYW5pbWUvc2F0YW5pYU5vQnVsbGkucG5n/sataniaNoBulli.png","url":"https://stereophonic.space/proxy/b0DL-MeIUvqdPN0zJwkCT8KIaSc/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvYW5pbWUvc2F0YW5pYU5vQnVsbGkucG5n/sataniaNoBulli.png","visible_in_picker":false},{"shortcode":"verifiedsabakan","static_url":"https://stereophonic.space/proxy/MbUaXLpXh3ZK7ehIKZqDoyZaCqU/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvbGFiZWxzL3ZlcmlmaWVkc2FiYWthbi5wbmc/verifiedsabakan.png","url":"https://stereophonic.space/proxy/MbUaXLpXh3ZK7ehIKZqDoyZaCqU/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvbGFiZWxzL3ZlcmlmaWVkc2FiYWthbi5wbmc/verifiedsabakan.png","visible_in_picker":false},{"shortcode":"welovelain","static_url":"https://stereophonic.space/proxy/hAlsiSzic1IqFo-G9w3ZWerAg6Q/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvY3VzdG9tL3dlbG92ZWxhaW4ucG5n/welovelain.png","url":"https://stereophonic.space/proxy/hAlsiSzic1IqFo-G9w3ZWerAg6Q/aHR0cHM6Ly9uZXVlLmNpdHkvZW1vamkvY3VzdG9tL3dlbG92ZWxhaW4ucG5n/welovelain.png","visible_in_picker":false}],"fields":[{"name":"cofe?","value":"hell yeah."},{"name":"blÃ¥haj?","value":"everyday."},{"name":"urbit","value":"~difreg-dasrys"},{"name":"alt. account","value":"<a href=\"https://lets.bemoe.online/users/vala\" rel=\"ugc\">@vala@lets.bemoe.online</a>"},{"name":"xmpp","value":"<a href=\"xmpp://vala@neue.city\">xmpp://vala@neue.city</a>"},{"name":"gacha","value":"sucker"}],"followers_count":147,"following_count":78,"header":"https://stereophonic.space/proxy/algbU9JR1QK-UVTeekBSp30CDLQ/aHR0cHM6Ly9uZXVlLmNpdHkvbWVkaWEvM2Q2YzA5MDZmZDg2ZjgyZTY3YTY1OGQ2MDAxOTc1N2EyNjIwOWIyNGNkZjkwZTgxNzBlMWI5Njg2MWQ1ZjkxOC5qcGc_bmFtZT1CMDA1NTQ4LVIxLTE1LTE0QS5qcGc/3d6c0906fd86f82e67a658d60019757a26209b24cdf90e8170e1b96861d5f918.jpg","header_static":"https://stereophonic.space/proxy/algbU9JR1QK-UVTeekBSp30CDLQ/aHR0cHM6Ly9uZXVlLmNpdHkvbWVkaWEvM2Q2YzA5MDZmZDg2ZjgyZTY3YTY1OGQ2MDAxOTc1N2EyNjIwOWIyNGNkZjkwZTgxNzBlMWI5Njg2MWQ1ZjkxOC5qcGc_bmFtZT1CMDA1NTQ4LVIxLTE1LTE0QS5qcGc/3d6c0906fd86f82e67a658d60019757a26209b24cdf90e8170e1b96861d5f918.jpg","id":"9tO7DH9HqBbxkWv3gG","locked":false,"note":"â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²<br/>gaige or vala<br/>comes from a land of ice and snow :cirno_comfy:<br/><br/>just imagine every word i ever say, in cursive comic sans<br/>i generally float around here while being a â‘¨<br/><br/>:corndog: the official server-maid in this pleroma neighbourhood of the fediverse :pleroma_seal:<br/>i cant program in anything<br/><br/>used to post at <a href=\"http://ilovela.in\">ilovela.in</a> and <a href=\"http://welovela.in\">welovela.in</a> :welovelain:<br/><br/>will judge you for your taste in cars<br/>â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²â•±â•³â•²<br/>:debian: :lain: :raveSmug: :sataniaNoBulli:  :asukaPout:","pleroma":{"accepts_chat_messages":true,"ap_id":"https://neue.city/users/gaige","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":true},"sensitive":false},"statuses_count":5946,"url":"https://neue.city/users/gaige","username":"gaige"},"created_at":"2021-01-16T03:33:28.000Z","id":"326629","pleroma":{"is_muted":false,"is_seen":false},"status":null,"type":"reblog"},{"account":{"acct":"rt@bbs.kawa-kun.com","avatar":"https://stereophonic.space/proxy/oyOufzPwKzGS3HlkB5UGWyM38TI/aHR0cHM6Ly9iYnMua2F3YS1rdW4uY29tL21lZGlhL2MwY2ZkOTFmNDJmNzFhOGM3ZWM1ZTQ1NTU4NGMxYmE1ZWI1NTNkNzcyZWE0ZmM0ZWZhNDVjYjllZTY0NzU4OTQucG5n/c0cfd91f42f71a8c7ec5e455584c1ba5eb553d772ea4fc4efa45cb9ee6475894.png","avatar_static":"https://stereophonic.space/proxy/oyOufzPwKzGS3HlkB5UGWyM38TI/aHR0cHM6Ly9iYnMua2F3YS1rdW4uY29tL21lZGlhL2MwY2ZkOTFmNDJmNzFhOGM3ZWM1ZTQ1NTU4NGMxYmE1ZWI1NTNkNzcyZWE0ZmM0ZWZhNDVjYjllZTY0NzU4OTQucG5n/c0cfd91f42f71a8c7ec5e455584c1ba5eb553d772ea4fc4efa45cb9ee6475894.png","bot":false,"created_at":"2020-05-04T15:46:30.000Z","display_name":"RT All!","emojis":[],"fields":[],"followers_count":0,"following_count":0,"header":"https://stereophonic.space/images/banner.png","header_static":"https://stereophonic.space/images/banner.png","id":"9uhvS4FjH48PRMhy4m","locked":false,"note":"RTing all public posts!<br/><br/>Only public posts with significant interaction will be RT&#39;d.  Unlisted and private posts of any sort will be ignored.<br/><br/>If you don&#39;t want me to RT your posts, just mention me with the text &quot;stop&quot; in a post.","pleroma":{"accepts_chat_messages":true,"ap_id":"https://bbs.kawa-kun.com/users/rt","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":true},"sensitive":false},"statuses_count":2,"url":"https://bbs.kawa-kun.com/users/rt","username":"rt"},"created_at":"2021-01-16T03:30:02.000Z","id":"326628","pleroma":{"is_muted":false,"is_seen":false},"status":null,"type":"reblog"},{"account":{"acct":"emilis@cdrom.tokyo","avatar":"https://stereophonic.space/proxy/8V0mOwZFa_B-_CynqAMBTct_6gY/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS9lODIxMzc0MWJjZWE5MmIzN2JhNWFmM2EzZmE5NjZjNTU2NzFkZDMxZTUyZjZiNWRmNzJmYTM0ZDk1YTI0NTdmLmpwZw/e8213741bcea92b37ba5af3a3fa966c55671dd31e52f6b5df72fa34d95a2457f.jpg","avatar_static":"https://stereophonic.space/proxy/8V0mOwZFa_B-_CynqAMBTct_6gY/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS9lODIxMzc0MWJjZWE5MmIzN2JhNWFmM2EzZmE5NjZjNTU2NzFkZDMxZTUyZjZiNWRmNzJmYTM0ZDk1YTI0NTdmLmpwZw/e8213741bcea92b37ba5af3a3fa966c55671dd31e52f6b5df72fa34d95a2457f.jpg","bot":false,"created_at":"2020-10-09T20:14:01.000Z","display_name":"romaboo :jigglypuff:","emojis":[{"shortcode":"jigglypuff","static_url":"https://stereophonic.space/proxy/bnKBn39yPRzUVLRRsLrf-6g4u04/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9jZHJvbS9qaWdnbHlwdWZmLnBuZw/jigglypuff.png","url":"https://stereophonic.space/proxy/bnKBn39yPRzUVLRRsLrf-6g4u04/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9jZHJvbS9qaWdnbHlwdWZmLnBuZw/jigglypuff.png","visible_in_picker":false}],"fields":[],"followers_count":6,"following_count":12,"header":"https://stereophonic.space/proxy/oeQXvgFN5DnvG8xvOo-NU7BBbO0/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS81NTE1MThhYzRlNGQ0YTJiZWI1M2ExNTgxOTIwYzJkNDNmYjUzMDA1ZWI2MTU4MjBiMDE2NGYxMDczMTRmMjk4LmpwZw/551518ac4e4d4a2beb53a1581920c2d43fb53005eb615820b0164f107314f298.jpg","header_static":"https://stereophonic.space/proxy/oeQXvgFN5DnvG8xvOo-NU7BBbO0/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS81NTE1MThhYzRlNGQ0YTJiZWI1M2ExNTgxOTIwYzJkNDNmYjUzMDA1ZWI2MTU4MjBiMDE2NGYxMDczMTRmMjk4LmpwZw/551518ac4e4d4a2beb53a1581920c2d43fb53005eb615820b0164f107314f298.jpg","id":"9zzoVd0oJZMuqGNzLk","locked":false,"note":"lego is based on nipples<br/><br/>In lingua latina: <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9vqY7exhRY86vqnH6m\" href=\"https://cdrom.tokyo/users/aemilivs\">@<span>aemilivs</span></a></span>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://cdrom.tokyo/users/emilis","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":true},"sensitive":false},"statuses_count":4721,"url":"https://cdrom.tokyo/users/emilis","username":"emilis"},"created_at":"2021-01-16T00:21:23.000Z","id":"326567","pleroma":{"is_muted":false,"is_seen":true},"status":{"account":{"acct":"emilis@cdrom.tokyo","avatar":"https://stereophonic.space/proxy/8V0mOwZFa_B-_CynqAMBTct_6gY/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS9lODIxMzc0MWJjZWE5MmIzN2JhNWFmM2EzZmE5NjZjNTU2NzFkZDMxZTUyZjZiNWRmNzJmYTM0ZDk1YTI0NTdmLmpwZw/e8213741bcea92b37ba5af3a3fa966c55671dd31e52f6b5df72fa34d95a2457f.jpg","avatar_static":"https://stereophonic.space/proxy/8V0mOwZFa_B-_CynqAMBTct_6gY/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS9lODIxMzc0MWJjZWE5MmIzN2JhNWFmM2EzZmE5NjZjNTU2NzFkZDMxZTUyZjZiNWRmNzJmYTM0ZDk1YTI0NTdmLmpwZw/e8213741bcea92b37ba5af3a3fa966c55671dd31e52f6b5df72fa34d95a2457f.jpg","bot":false,"created_at":"2020-10-09T20:14:01.000Z","display_name":"romaboo :jigglypuff:","emojis":[{"shortcode":"jigglypuff","static_url":"https://stereophonic.space/proxy/bnKBn39yPRzUVLRRsLrf-6g4u04/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9jZHJvbS9qaWdnbHlwdWZmLnBuZw/jigglypuff.png","url":"https://stereophonic.space/proxy/bnKBn39yPRzUVLRRsLrf-6g4u04/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9jZHJvbS9qaWdnbHlwdWZmLnBuZw/jigglypuff.png","visible_in_picker":false}],"fields":[],"followers_count":6,"following_count":12,"header":"https://stereophonic.space/proxy/oeQXvgFN5DnvG8xvOo-NU7BBbO0/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS81NTE1MThhYzRlNGQ0YTJiZWI1M2ExNTgxOTIwYzJkNDNmYjUzMDA1ZWI2MTU4MjBiMDE2NGYxMDczMTRmMjk4LmpwZw/551518ac4e4d4a2beb53a1581920c2d43fb53005eb615820b0164f107314f298.jpg","header_static":"https://stereophonic.space/proxy/oeQXvgFN5DnvG8xvOo-NU7BBbO0/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS81NTE1MThhYzRlNGQ0YTJiZWI1M2ExNTgxOTIwYzJkNDNmYjUzMDA1ZWI2MTU4MjBiMDE2NGYxMDczMTRmMjk4LmpwZw/551518ac4e4d4a2beb53a1581920c2d43fb53005eb615820b0164f107314f298.jpg","id":"9zzoVd0oJZMuqGNzLk","locked":false,"note":"lego is based on nipples<br/><br/>In lingua latina: <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9vqY7exhRY86vqnH6m\" href=\"https://cdrom.tokyo/users/aemilivs\">@<span>aemilivs</span></a></span>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://cdrom.tokyo/users/emilis","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":true},"sensitive":false},"statuses_count":4721,"url":"https://cdrom.tokyo/users/emilis","username":"emilis"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"<p><span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9vLK6FwkZYqQAO4wIS\" href=\"https://stereophonic.space/users/newt\">@<span>newt</span></a></span> <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9vJXUEhXxCI7PRhqwi\" href=\"https://lain.com/users/lain\">@<span>lain</span></a></span> funded by russian rich dude :blobthumbsup:</p>","created_at":"2021-01-16T00:21:22.000Z","emojis":[{"shortcode":"blobthumbsup","static_url":"https://stereophonic.space/proxy/TaMFl_7FPDPZrGrrADI_rUyktEo/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9zdG9sZW4vYmxvYnRodW1ic3VwLnBuZw/blobthumbsup.png","url":"https://stereophonic.space/proxy/TaMFl_7FPDPZrGrrADI_rUyktEo/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9zdG9sZW4vYmxvYnRodW1ic3VwLnBuZw/blobthumbsup.png","visible_in_picker":false}],"favourited":false,"favourites_count":0,"id":"A3HIwFvoB2leKe05QW","in_reply_to_account_id":"9rZ2STPb7FA7JnMRii","in_reply_to_id":"A3HHYP1mbbiHdirCDo","language":null,"media_attachments":[],"mentions":[{"acct":"newt","id":"9rZ2STPb7FA7JnMRii","url":"https://stereophonic.space/users/newt","username":"newt"},{"acct":"lain@lain.com","id":"9qrXewWxfr80iavPVY","url":"https://lain.com/users/lain","username":"lain"}],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"@newt @lain funded by russian rich dude :blobthumbsup:"},"conversation_id":20784105,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":"newt","local":false,"parent_visible":true,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":0,"replies_count":1,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://cdrom.tokyo/objects/9ee6edee-b483-433c-89b6-ca0a610b3e09","url":"https://cdrom.tokyo/objects/9ee6edee-b483-433c-89b6-ca0a610b3e09","visibility":"public"},"type":"mention"},{"account":{"acct":"emilis@cdrom.tokyo","avatar":"https://stereophonic.space/proxy/8V0mOwZFa_B-_CynqAMBTct_6gY/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS9lODIxMzc0MWJjZWE5MmIzN2JhNWFmM2EzZmE5NjZjNTU2NzFkZDMxZTUyZjZiNWRmNzJmYTM0ZDk1YTI0NTdmLmpwZw/e8213741bcea92b37ba5af3a3fa966c55671dd31e52f6b5df72fa34d95a2457f.jpg","avatar_static":"https://stereophonic.space/proxy/8V0mOwZFa_B-_CynqAMBTct_6gY/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS9lODIxMzc0MWJjZWE5MmIzN2JhNWFmM2EzZmE5NjZjNTU2NzFkZDMxZTUyZjZiNWRmNzJmYTM0ZDk1YTI0NTdmLmpwZw/e8213741bcea92b37ba5af3a3fa966c55671dd31e52f6b5df72fa34d95a2457f.jpg","bot":false,"created_at":"2020-10-09T20:14:01.000Z","display_name":"romaboo :jigglypuff:","emojis":[{"shortcode":"jigglypuff","static_url":"https://stereophonic.space/proxy/bnKBn39yPRzUVLRRsLrf-6g4u04/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9jZHJvbS9qaWdnbHlwdWZmLnBuZw/jigglypuff.png","url":"https://stereophonic.space/proxy/bnKBn39yPRzUVLRRsLrf-6g4u04/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9jZHJvbS9qaWdnbHlwdWZmLnBuZw/jigglypuff.png","visible_in_picker":false}],"fields":[],"followers_count":6,"following_count":12,"header":"https://stereophonic.space/proxy/oeQXvgFN5DnvG8xvOo-NU7BBbO0/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS81NTE1MThhYzRlNGQ0YTJiZWI1M2ExNTgxOTIwYzJkNDNmYjUzMDA1ZWI2MTU4MjBiMDE2NGYxMDczMTRmMjk4LmpwZw/551518ac4e4d4a2beb53a1581920c2d43fb53005eb615820b0164f107314f298.jpg","header_static":"https://stereophonic.space/proxy/oeQXvgFN5DnvG8xvOo-NU7BBbO0/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS81NTE1MThhYzRlNGQ0YTJiZWI1M2ExNTgxOTIwYzJkNDNmYjUzMDA1ZWI2MTU4MjBiMDE2NGYxMDczMTRmMjk4LmpwZw/551518ac4e4d4a2beb53a1581920c2d43fb53005eb615820b0164f107314f298.jpg","id":"9zzoVd0oJZMuqGNzLk","locked":false,"note":"lego is based on nipples<br/><br/>In lingua latina: <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9vqY7exhRY86vqnH6m\" href=\"https://cdrom.tokyo/users/aemilivs\">@<span>aemilivs</span></a></span>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://cdrom.tokyo/users/emilis","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":true},"sensitive":false},"statuses_count":4721,"url":"https://cdrom.tokyo/users/emilis","username":"emilis"},"created_at":"2021-01-16T00:21:06.000Z","id":"326566","pleroma":{"is_muted":false,"is_seen":true},"status":{"account":{"acct":"newt","avatar":"https://stereophonic.space/media/badfe007441b8daa3da9c1dfcd56a71378e3a2c0022745030cfe017057129582.blob","avatar_static":"https://stereophonic.space/media/badfe007441b8daa3da9c1dfcd56a71378e3a2c0022745030cfe017057129582.blob","bot":false,"created_at":"2020-01-31T15:16:18.000Z","display_name":"NÌ¸Ì¢Ì¡Ì¢Ì¤Ì®Ì¥Ì²ÍÍ‹Í†Î£ÌµÌ›ÌžÌ€ÌˆÌÌ†Ì“ÌÍ›Ì‹áº‚ÌµÌ¢Ì«Ì£Ì¦Ì»Ì©Í‘Ì€ÍTÌµÍ™Ì¯Ì”ÌˆÌÍÍ…","emojis":[{"shortcode":"8b_a","static_url":"https://stereophonic.space/emoji/custom/8b_a.png","url":"https://stereophonic.space/emoji/custom/8b_a.png","visible_in_picker":false},{"shortcode":"8b_c","static_url":"https://stereophonic.space/emoji/custom/8b_c.png","url":"https://stereophonic.space/emoji/custom/8b_c.png","visible_in_picker":false},{"shortcode":"8b_d","static_url":"https://stereophonic.space/emoji/custom/8b_d.png","url":"https://stereophonic.space/emoji/custom/8b_d.png","visible_in_picker":false},{"shortcode":"8b_e","static_url":"https://stereophonic.space/emoji/custom/8b_e.png","url":"https://stereophonic.space/emoji/custom/8b_e.png","visible_in_picker":false},{"shortcode":"8b_i","static_url":"https://stereophonic.space/emoji/custom/8b_i.png","url":"https://stereophonic.space/emoji/custom/8b_i.png","visible_in_picker":false},{"shortcode":"8b_l","static_url":"https://stereophonic.space/emoji/custom/8b_l.png","url":"https://stereophonic.space/emoji/custom/8b_l.png","visible_in_picker":false},{"shortcode":"8b_m","static_url":"https://stereophonic.space/emoji/custom/8b_m.png","url":"https://stereophonic.space/emoji/custom/8b_m.png","visible_in_picker":false},{"shortcode":"8b_o","static_url":"https://stereophonic.space/emoji/custom/8b_o.png","url":"https://stereophonic.space/emoji/custom/8b_o.png","visible_in_picker":false},{"shortcode":"8b_p","static_url":"https://stereophonic.space/emoji/custom/8b_p.png","url":"https://stereophonic.space/emoji/custom/8b_p.png","visible_in_picker":false},{"shortcode":"8b_r","static_url":"https://stereophonic.space/emoji/custom/8b_r.png","url":"https://stereophonic.space/emoji/custom/8b_r.png","visible_in_picker":false},{"shortcode":"8b_s","static_url":"https://stereophonic.space/emoji/custom/8b_s.png","url":"https://stereophonic.space/emoji/custom/8b_s.png","visible_in_picker":false},{"shortcode":"8b_t","static_url":"https://stereophonic.space/emoji/custom/8b_t.png","url":"https://stereophonic.space/emoji/custom/8b_t.png","visible_in_picker":false},{"shortcode":"8b_u","static_url":"https://stereophonic.space/emoji/custom/8b_u.png","url":"https://stereophonic.space/emoji/custom/8b_u.png","visible_in_picker":false},{"shortcode":"8b_v","static_url":"https://stereophonic.space/emoji/custom/8b_v.png","url":"https://stereophonic.space/emoji/custom/8b_v.png","visible_in_picker":false},{"shortcode":"8b_y","static_url":"https://stereophonic.space/emoji/custom/8b_y.png","url":"https://stereophonic.space/emoji/custom/8b_y.png","visible_in_picker":false},{"shortcode":"comfycofesmirk","static_url":"https://stereophonic.space/emoji/comfy/comfycofesmirk.png","url":"https://stereophonic.space/emoji/comfy/comfycofesmirk.png","visible_in_picker":false}],"fields":[{"name":"cofe","value":":comfycofesmirk:"}],"follow_requests_count":0,"followers_count":315,"following_count":198,"header":"https://stereophonic.space/media/e43024f466693cad7887a60ffce07861bd15b9b54dd67fee90c774534787ee4d.jpg","header_static":"https://stereophonic.space/media/e43024f466693cad7887a60ffce07861bd15b9b54dd67fee90c774534787ee4d.jpg","id":"9rZ2STPb7FA7JnMRii","locked":false,"note":"Chaos evangelist.<br/>Sometimes evil.<br/>Almost godlike.<br/>Better, even more magnificent than before.<br/>Not for the faint of heart.<br/><br/>:8b_v:<br/>:8b_e:<br/>:8b_r:<br/>:8b_t:<br/>:8b_i:<br/>:8b_c:<br/>:8b_a:<br/>:8b_l:<br/><br/>:8b_s:<br/>:8b_u:<br/>:8b_p:<br/>:8b_r:<br/>:8b_e:<br/>:8b_m:<br/>:8b_a:<br/>:8b_c:<br/>:8b_y:<br/><br/>:8b_a:<br/>:8b_d:<br/>:8b_v:<br/>:8b_o:<br/>:8b_c:<br/>:8b_a:<br/>:8b_t:<br/>:8b_e:<br/><br/><a class=\"hashtag\" data-tag=\"niu\" href=\"https://stereophonic.space/tag/niu\">#niu</a> refugee. <br/>Programming and tech talk is mostly at <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9jCuHkYZPSuOlVU6qm\" href=\"https://functional.cafe/@pureevil\">@<span>pureevil@functional.cafe</span></a></span> but occasionally leaks.<br/>I write and actively use proprietary software. <br/><br/>Duke Nukem did nothing wrong.","pleroma":{"accepts_chat_messages":true,"allow_following_move":true,"ap_id":"https://stereophonic.space/users/newt","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":true,"is_moderator":false,"notification_settings":{"block_from_strangers":false,"hide_notification_contents":false},"relationship":{},"skip_thread_containment":false,"tags":[],"unread_conversation_count":34,"unread_notifications_count":10},"source":{"fields":[{"name":"cofe","value":":comfycofesmirk:"}],"note":"Chaos evangelist.\nSometimes evil.\nAlmost godlike.\nBetter, even more magnificent than before.\nNot for the faint of heart.\n\n:8b_v:\n:8b_e:\n:8b_r:\n:8b_t:\n:8b_i:\n:8b_c:\n:8b_a:\n:8b_l:\n\n:8b_s:\n:8b_u:\n:8b_p:\n:8b_r:\n:8b_e:\n:8b_m:\n:8b_a:\n:8b_c:\n:8b_y:\n\n:8b_a:\n:8b_d:\n:8b_v:\n:8b_o:\n:8b_c:\n:8b_a:\n:8b_t:\n:8b_e:\n\n#niu refugee. \nProgramming and tech talk is mostly at @pureevil@functional.cafe but occasionally leaks.\nI write and actively use proprietary software. \n\nDuke Nukem did nothing wrong.","pleroma":{"actor_type":"Person","discoverable":false,"no_rich_text":true,"show_role":false},"privacy":"public","sensitive":false},"statuses_count":9437,"url":"https://stereophonic.space/users/newt","username":"newt"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"<span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9qrXewWxfr80iavPVY\" href=\"https://lain.com/users/lain\">@<span>lain</span></a></span> don&#39;t telegram devs live in Russia?","created_at":"2021-01-16T00:05:52.000Z","emojis":[],"favourited":false,"favourites_count":1,"id":"A3HHYP1mbbiHdirCDo","in_reply_to_account_id":"9qrXewWxfr80iavPVY","in_reply_to_id":"A3HHVhvzr2r9PPriW8","language":null,"media_attachments":[],"mentions":[{"acct":"lain@lain.com","id":"9qrXewWxfr80iavPVY","url":"https://lain.com/users/lain","username":"lain"}],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"@lain don't telegram devs live in Russia?"},"conversation_id":20784105,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":"lain@lain.com","local":true,"parent_visible":true,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":0,"replies_count":2,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://stereophonic.space/objects/504d2239-b8ef-4f8f-848c-9724e091216b","url":"https://stereophonic.space/notice/A3HHYP1mbbiHdirCDo","visibility":"public"},"type":"favourite"},{"account":{"acct":"lain@lain.com","avatar":"https://stereophonic.space/proxy/1jt_Q-4Svj4502XuohIeuwtCRS4/aHR0cHM6Ly9sYWluLmNvbS9tZWRpYS84YTY1MjMzNDIxMTYwZDU2MjU2YzFlYjljNGI0NTJmZDJmZmE5YTA4ZjlmZTZkOWE5YTllMDdjYTc4NDlkODI5LmJsb2I/8a65233421160d56256c1eb9c4b452fd2ffa9a08f9fe6d9a9a9e07ca7849d829.blob","avatar_static":"https://stereophonic.space/proxy/1jt_Q-4Svj4502XuohIeuwtCRS4/aHR0cHM6Ly9sYWluLmNvbS9tZWRpYS84YTY1MjMzNDIxMTYwZDU2MjU2YzFlYjljNGI0NTJmZDJmZmE5YTA4ZjlmZTZkOWE5YTllMDdjYTc4NDlkODI5LmJsb2I/8a65233421160d56256c1eb9c4b452fd2ffa9a08f9fe6d9a9a9e07ca7849d829.blob","bot":false,"created_at":"2020-01-10T15:38:37.000Z","display_name":"workin' 12 to 9ish","emojis":[],"fields":[],"followers_count":1587,"following_count":345,"header":"https://stereophonic.space/proxy/BzLFPP43fnB1rOBkAJDMGe2lL-s/aHR0cHM6Ly9sYWluLmNvbS9tZWRpYS8yMzk4ZjIwMDBmNzU3YzA3MDdjOWI0M2RhZTk4NjgyNzE3NjZhNzNlMzE0YjFkNGQ5NDVhZGNmZWVlN2Q2NzRmLmpwZw/2398f2000f757c0707c9b43dae9868271766a73e314b1d4d945adcfeee7d674f.jpg","header_static":"https://stereophonic.space/proxy/BzLFPP43fnB1rOBkAJDMGe2lL-s/aHR0cHM6Ly9sYWluLmNvbS9tZWRpYS8yMzk4ZjIwMDBmNzU3YzA3MDdjOWI0M2RhZTk4NjgyNzE3NjZhNzNlMzE0YjFkNGQ5NDVhZGNmZWVlN2Q2NzRmLmpwZw/2398f2000f757c0707c9b43dae9868271766a73e314b1d4d945adcfeee7d674f.jpg","id":"9qrXewWxfr80iavPVY","locked":false,"note":"No more hiding","pleroma":{"accepts_chat_messages":true,"ap_id":"https://lain.com/users/lain","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":true},"sensitive":false},"statuses_count":46685,"url":"https://lain.com/users/lain","username":"lain"},"created_at":"2021-01-16T00:06:45.000Z","id":"326564","pleroma":{"is_muted":false,"is_seen":true},"status":{"account":{"acct":"lain@lain.com","avatar":"https://stereophonic.space/proxy/1jt_Q-4Svj4502XuohIeuwtCRS4/aHR0cHM6Ly9sYWluLmNvbS9tZWRpYS84YTY1MjMzNDIxMTYwZDU2MjU2YzFlYjljNGI0NTJmZDJmZmE5YTA4ZjlmZTZkOWE5YTllMDdjYTc4NDlkODI5LmJsb2I/8a65233421160d56256c1eb9c4b452fd2ffa9a08f9fe6d9a9a9e07ca7849d829.blob","avatar_static":"https://stereophonic.space/proxy/1jt_Q-4Svj4502XuohIeuwtCRS4/aHR0cHM6Ly9sYWluLmNvbS9tZWRpYS84YTY1MjMzNDIxMTYwZDU2MjU2YzFlYjljNGI0NTJmZDJmZmE5YTA4ZjlmZTZkOWE5YTllMDdjYTc4NDlkODI5LmJsb2I/8a65233421160d56256c1eb9c4b452fd2ffa9a08f9fe6d9a9a9e07ca7849d829.blob","bot":false,"created_at":"2020-01-10T15:38:37.000Z","display_name":"workin' 12 to 9ish","emojis":[],"fields":[],"followers_count":1587,"following_count":345,"header":"https://stereophonic.space/proxy/BzLFPP43fnB1rOBkAJDMGe2lL-s/aHR0cHM6Ly9sYWluLmNvbS9tZWRpYS8yMzk4ZjIwMDBmNzU3YzA3MDdjOWI0M2RhZTk4NjgyNzE3NjZhNzNlMzE0YjFkNGQ5NDVhZGNmZWVlN2Q2NzRmLmpwZw/2398f2000f757c0707c9b43dae9868271766a73e314b1d4d945adcfeee7d674f.jpg","header_static":"https://stereophonic.space/proxy/BzLFPP43fnB1rOBkAJDMGe2lL-s/aHR0cHM6Ly9sYWluLmNvbS9tZWRpYS8yMzk4ZjIwMDBmNzU3YzA3MDdjOWI0M2RhZTk4NjgyNzE3NjZhNzNlMzE0YjFkNGQ5NDVhZGNmZWVlN2Q2NzRmLmpwZw/2398f2000f757c0707c9b43dae9868271766a73e314b1d4d945adcfeee7d674f.jpg","id":"9qrXewWxfr80iavPVY","locked":false,"note":"No more hiding","pleroma":{"accepts_chat_messages":true,"ap_id":"https://lain.com/users/lain","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":true},"sensitive":false},"statuses_count":46685,"url":"https://lain.com/users/lain","username":"lain"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"<span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9rZ3P3hbSH1g7QDXwO\" href=\"https://stereophonic.space/users/newt\">@<span>newt</span></a></span> I think so","created_at":"2021-01-16T00:06:41.000Z","emojis":[],"favourited":true,"favourites_count":1,"id":"A3HHdH3JgWNoLvtgXY","in_reply_to_account_id":"9rZ2STPb7FA7JnMRii","in_reply_to_id":"A3HHYP1mbbiHdirCDo","language":null,"media_attachments":[],"mentions":[{"acct":"newt","id":"9rZ2STPb7FA7JnMRii","url":"https://stereophonic.space/users/newt","username":"newt"}],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"@newt I think so"},"conversation_id":20784105,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":"newt","local":false,"parent_visible":true,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":0,"replies_count":1,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://lain.com/objects/753b3101-575c-44e8-9a46-52f248c896cb","url":"https://lain.com/objects/753b3101-575c-44e8-9a46-52f248c896cb","visibility":"public"},"type":"mention"},{"account":{"acct":"mystik@midnightride.rs","avatar":"https://stereophonic.space/proxy/CiibZFn3pLaq6z33WCA1d6TLDFc/aHR0cHM6Ly9taWRuaWdodHJpZGUucnMvbWVkaWEvNjk5MDllM2Y2Yjg4MDIwNjI0YWYzNDViMmZlZDVkNTNmNmM3NmUwOTUxNzk5ZTgzNGFiYmRhZmMzMTc1NWUxNC5qcGc/69909e3f6b88020624af345b2fed5d53f6c76e0951799e834abbdafc31755e14.jpg","avatar_static":"https://stereophonic.space/proxy/CiibZFn3pLaq6z33WCA1d6TLDFc/aHR0cHM6Ly9taWRuaWdodHJpZGUucnMvbWVkaWEvNjk5MDllM2Y2Yjg4MDIwNjI0YWYzNDViMmZlZDVkNTNmNmM3NmUwOTUxNzk5ZTgzNGFiYmRhZmMzMTc1NWUxNC5qcGc/69909e3f6b88020624af345b2fed5d53f6c76e0951799e834abbdafc31755e14.jpg","bot":false,"created_at":"2020-11-13T07:54:41.000Z","display_name":"mystik","emojis":[],"fields":[],"followers_count":124,"following_count":304,"header":"https://stereophonic.space/proxy/nakuPYK0SG389sIac37pUdOKeDM/aHR0cHM6Ly9taWRuaWdodHJpZGUucnMvbWVkaWEvNWExYjNhNjI1OWUxNTFkZGRjZmRhNWZmNjAxYzVlY2M4ZTA4YjEwMmJkOWIzZjgwZWY2ZWY4MDgxOGUyNGE4MC5qcGc/5a1b3a6259e151dddcfda5ff601c5ecc8e08b102bd9b3f80ef6ef80818e24a80.jpg","header_static":"https://stereophonic.space/proxy/nakuPYK0SG389sIac37pUdOKeDM/aHR0cHM6Ly9taWRuaWdodHJpZGUucnMvbWVkaWEvNWExYjNhNjI1OWUxNTFkZGRjZmRhNWZmNjAxYzVlY2M4ZTA4YjEwMmJkOWIzZjgwZWY2ZWY4MDgxOGUyNGE4MC5qcGc/5a1b3a6259e151dddcfda5ff601c5ecc8e08b102bd9b3f80ef6ef80818e24a80.jpg","id":"A19IVg19shIluyE7Bg","locked":false,"note":"Doesn&#39;t wear the slave mark (aka face mask).<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>Unpopular knowledge.<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>Give me freedom or give me death.","pleroma":{"accepts_chat_messages":true,"ap_id":"https://midnightride.rs/users/mystik","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":844,"url":"https://midnightride.rs/users/mystik","username":"mystik"},"created_at":"2021-01-15T22:55:51.000Z","id":"326542","pleroma":{"is_muted":false,"is_seen":true},"status":{"account":{"acct":"newt","avatar":"https://stereophonic.space/media/badfe007441b8daa3da9c1dfcd56a71378e3a2c0022745030cfe017057129582.blob","avatar_static":"https://stereophonic.space/media/badfe007441b8daa3da9c1dfcd56a71378e3a2c0022745030cfe017057129582.blob","bot":false,"created_at":"2020-01-31T15:16:18.000Z","display_name":"NÌ¸Ì¢Ì¡Ì¢Ì¤Ì®Ì¥Ì²ÍÍ‹Í†Î£ÌµÌ›ÌžÌ€ÌˆÌÌ†Ì“ÌÍ›Ì‹áº‚ÌµÌ¢Ì«Ì£Ì¦Ì»Ì©Í‘Ì€ÍTÌµÍ™Ì¯Ì”ÌˆÌÍÍ…","emojis":[{"shortcode":"8b_a","static_url":"https://stereophonic.space/emoji/custom/8b_a.png","url":"https://stereophonic.space/emoji/custom/8b_a.png","visible_in_picker":false},{"shortcode":"8b_c","static_url":"https://stereophonic.space/emoji/custom/8b_c.png","url":"https://stereophonic.space/emoji/custom/8b_c.png","visible_in_picker":false},{"shortcode":"8b_d","static_url":"https://stereophonic.space/emoji/custom/8b_d.png","url":"https://stereophonic.space/emoji/custom/8b_d.png","visible_in_picker":false},{"shortcode":"8b_e","static_url":"https://stereophonic.space/emoji/custom/8b_e.png","url":"https://stereophonic.space/emoji/custom/8b_e.png","visible_in_picker":false},{"shortcode":"8b_i","static_url":"https://stereophonic.space/emoji/custom/8b_i.png","url":"https://stereophonic.space/emoji/custom/8b_i.png","visible_in_picker":false},{"shortcode":"8b_l","static_url":"https://stereophonic.space/emoji/custom/8b_l.png","url":"https://stereophonic.space/emoji/custom/8b_l.png","visible_in_picker":false},{"shortcode":"8b_m","static_url":"https://stereophonic.space/emoji/custom/8b_m.png","url":"https://stereophonic.space/emoji/custom/8b_m.png","visible_in_picker":false},{"shortcode":"8b_o","static_url":"https://stereophonic.space/emoji/custom/8b_o.png","url":"https://stereophonic.space/emoji/custom/8b_o.png","visible_in_picker":false},{"shortcode":"8b_p","static_url":"https://stereophonic.space/emoji/custom/8b_p.png","url":"https://stereophonic.space/emoji/custom/8b_p.png","visible_in_picker":false},{"shortcode":"8b_r","static_url":"https://stereophonic.space/emoji/custom/8b_r.png","url":"https://stereophonic.space/emoji/custom/8b_r.png","visible_in_picker":false},{"shortcode":"8b_s","static_url":"https://stereophonic.space/emoji/custom/8b_s.png","url":"https://stereophonic.space/emoji/custom/8b_s.png","visible_in_picker":false},{"shortcode":"8b_t","static_url":"https://stereophonic.space/emoji/custom/8b_t.png","url":"https://stereophonic.space/emoji/custom/8b_t.png","visible_in_picker":false},{"shortcode":"8b_u","static_url":"https://stereophonic.space/emoji/custom/8b_u.png","url":"https://stereophonic.space/emoji/custom/8b_u.png","visible_in_picker":false},{"shortcode":"8b_v","static_url":"https://stereophonic.space/emoji/custom/8b_v.png","url":"https://stereophonic.space/emoji/custom/8b_v.png","visible_in_picker":false},{"shortcode":"8b_y","static_url":"https://stereophonic.space/emoji/custom/8b_y.png","url":"https://stereophonic.space/emoji/custom/8b_y.png","visible_in_picker":false},{"shortcode":"comfycofesmirk","static_url":"https://stereophonic.space/emoji/comfy/comfycofesmirk.png","url":"https://stereophonic.space/emoji/comfy/comfycofesmirk.png","visible_in_picker":false}],"fields":[{"name":"cofe","value":":comfycofesmirk:"}],"follow_requests_count":0,"followers_count":315,"following_count":198,"header":"https://stereophonic.space/media/e43024f466693cad7887a60ffce07861bd15b9b54dd67fee90c774534787ee4d.jpg","header_static":"https://stereophonic.space/media/e43024f466693cad7887a60ffce07861bd15b9b54dd67fee90c774534787ee4d.jpg","id":"9rZ2STPb7FA7JnMRii","locked":false,"note":"Chaos evangelist.<br/>Sometimes evil.<br/>Almost godlike.<br/>Better, even more magnificent than before.<br/>Not for the faint of heart.<br/><br/>:8b_v:<br/>:8b_e:<br/>:8b_r:<br/>:8b_t:<br/>:8b_i:<br/>:8b_c:<br/>:8b_a:<br/>:8b_l:<br/><br/>:8b_s:<br/>:8b_u:<br/>:8b_p:<br/>:8b_r:<br/>:8b_e:<br/>:8b_m:<br/>:8b_a:<br/>:8b_c:<br/>:8b_y:<br/><br/>:8b_a:<br/>:8b_d:<br/>:8b_v:<br/>:8b_o:<br/>:8b_c:<br/>:8b_a:<br/>:8b_t:<br/>:8b_e:<br/><br/><a class=\"hashtag\" data-tag=\"niu\" href=\"https://stereophonic.space/tag/niu\">#niu</a> refugee. <br/>Programming and tech talk is mostly at <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9jCuHkYZPSuOlVU6qm\" href=\"https://functional.cafe/@pureevil\">@<span>pureevil@functional.cafe</span></a></span> but occasionally leaks.<br/>I write and actively use proprietary software. <br/><br/>Duke Nukem did nothing wrong.","pleroma":{"accepts_chat_messages":true,"allow_following_move":true,"ap_id":"https://stereophonic.space/users/newt","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":true,"is_moderator":false,"notification_settings":{"block_from_strangers":false,"hide_notification_contents":false},"relationship":{},"skip_thread_containment":false,"tags":[],"unread_conversation_count":34,"unread_notifications_count":10},"source":{"fields":[{"name":"cofe","value":":comfycofesmirk:"}],"note":"Chaos evangelist.\nSometimes evil.\nAlmost godlike.\nBetter, even more magnificent than before.\nNot for the faint of heart.\n\n:8b_v:\n:8b_e:\n:8b_r:\n:8b_t:\n:8b_i:\n:8b_c:\n:8b_a:\n:8b_l:\n\n:8b_s:\n:8b_u:\n:8b_p:\n:8b_r:\n:8b_e:\n:8b_m:\n:8b_a:\n:8b_c:\n:8b_y:\n\n:8b_a:\n:8b_d:\n:8b_v:\n:8b_o:\n:8b_c:\n:8b_a:\n:8b_t:\n:8b_e:\n\n#niu refugee. \nProgramming and tech talk is mostly at @pureevil@functional.cafe but occasionally leaks.\nI write and actively use proprietary software. \n\nDuke Nukem did nothing wrong.","pleroma":{"actor_type":"Person","discoverable":false,"no_rich_text":true,"show_role":false},"privacy":"public","sensitive":false},"statuses_count":9437,"url":"https://stereophonic.space/users/newt","username":"newt"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"My internet is ded. Send me more internets please :comfygeek:","created_at":"2021-01-15T22:02:02.000Z","emojis":[{"shortcode":"comfygeek","static_url":"https://stereophonic.space/emoji/comfy/comfygeek.png","url":"https://stereophonic.space/emoji/comfy/comfygeek.png","visible_in_picker":false}],"favourited":false,"favourites_count":2,"id":"A3H6VFhTjIC2LXefVg","in_reply_to_account_id":null,"in_reply_to_id":null,"language":null,"media_attachments":[],"mentions":[],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"My internet is ded. Send me more internets please :comfygeek:"},"conversation_id":20781223,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":null,"local":true,"parent_visible":false,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":0,"replies_count":3,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://stereophonic.space/objects/5f533d84-01a8-4f3d-baa7-ed079b089138","url":"https://stereophonic.space/notice/A3H6VFhTjIC2LXefVg","visibility":"public"},"type":"favourite"},{"account":{"acct":"sathariel@gentoo.live","avatar":"https://stereophonic.space/proxy/KIgV_Ed9V9-8IKk-die8es3zBXI/aHR0cHM6Ly9nZW50b28ubGl2ZS9tZWRpYS8zNzk1MjQ4NzcxMDFhZDUxZjllMWU3ZmE0MWY0MGJkY2FjOGQxODg5MjBhZWM4YTEwMDI4Y2M3ZGNiYTc2MTczLmJsb2I/379524877101ad51f9e1e7fa41f40bdcac8d188920aec8a10028cc7dcba76173.blob","avatar_static":"https://stereophonic.space/proxy/KIgV_Ed9V9-8IKk-die8es3zBXI/aHR0cHM6Ly9nZW50b28ubGl2ZS9tZWRpYS8zNzk1MjQ4NzcxMDFhZDUxZjllMWU3ZmE0MWY0MGJkY2FjOGQxODg5MjBhZWM4YTEwMDI4Y2M3ZGNiYTc2MTczLmJsb2I/379524877101ad51f9e1e7fa41f40bdcac8d188920aec8a10028cc7dcba76173.blob","bot":false,"created_at":"2020-05-30T00:22:44.000Z","display_name":"Sathariel :chaos_pink: Laugh is the Law","emojis":[{"shortcode":"chaos_pink","static_url":"https://stereophonic.space/proxy/ulolyNhFhc2ZfkCkjG2UKWgp1ko/aHR0cHM6Ly9nZW50b28ubGl2ZS9lbW9qaS9jdXN0b20vY2hhb3NfcGluay5wbmc/chaos_pink.png","url":"https://stereophonic.space/proxy/ulolyNhFhc2ZfkCkjG2UKWgp1ko/aHR0cHM6Ly9nZW50b28ubGl2ZS9lbW9qaS9jdXN0b20vY2hhb3NfcGluay5wbmc/chaos_pink.png","visible_in_picker":false}],"fields":[{"name":"XMPP","value":"sathariel@magicadro.ga"},{"name":"Matrix","value":"<a href=\"https://gentoo.live/users/sathariel\" rel=\"ugc\">@sathariel</a>:blob.cat"}],"followers_count":320,"following_count":234,"header":"https://stereophonic.space/proxy/xyLTi9kvPEnNBvvMWTjqlZZNaHo/aHR0cHM6Ly9nZW50b28ubGl2ZS9tZWRpYS83YTc0NTk4ODk0YmRmNjNiMDM2YmI0NWIyM2E3NDcyOGQ3ODJmMDQxZWIwODM3MWQ1YmE2NGYzMTFjMTYxYWRmLnBuZw/7a74598894bdf63b036bb45b23a74728d782f041eb08371d5ba64f311c161adf.png","header_static":"https://stereophonic.space/proxy/xyLTi9kvPEnNBvvMWTjqlZZNaHo/aHR0cHM6Ly9nZW50b28ubGl2ZS9tZWRpYS83YTc0NTk4ODk0YmRmNjNiMDM2YmI0NWIyM2E3NDcyOGQ3ODJmMDQxZWIwODM3MWQ1YmE2NGYzMTFjMTYxYWRmLnBuZw/7a74598894bdf63b036bb45b23a74728d782f041eb08371d5ba64f311c161adf.png","id":"9vYUMtDznVwH6ixy6q","locked":false,"note":"Magician of Paradoxes.<br/>I have no interest on ordinary humans, but if you have got magic or psychic powers, have traveled in time, discovered a conspiracy, came from another planet or dimension please add me.<br/><br/><a href=\"https://sathariel.tk\">https://sathariel.tk</a><br/><br/><br/>for as much as you claim to be crazy, sathy, you&#39;re more reasonable than 2/3 of the internet<br/>- Nerthos at SPC<br/><br/>sathy is a mystery box~<br/>- Kogomi (Rina-chan) at RaRuRe<br/>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://gentoo.live/users/sathariel","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":6544,"url":"https://gentoo.live/users/sathariel","username":"sathariel"},"created_at":"2021-01-15T22:09:58.000Z","id":"326520","pleroma":{"is_muted":false,"is_seen":true},"status":{"account":{"acct":"sathariel@gentoo.live","avatar":"https://stereophonic.space/proxy/KIgV_Ed9V9-8IKk-die8es3zBXI/aHR0cHM6Ly9nZW50b28ubGl2ZS9tZWRpYS8zNzk1MjQ4NzcxMDFhZDUxZjllMWU3ZmE0MWY0MGJkY2FjOGQxODg5MjBhZWM4YTEwMDI4Y2M3ZGNiYTc2MTczLmJsb2I/379524877101ad51f9e1e7fa41f40bdcac8d188920aec8a10028cc7dcba76173.blob","avatar_static":"https://stereophonic.space/proxy/KIgV_Ed9V9-8IKk-die8es3zBXI/aHR0cHM6Ly9nZW50b28ubGl2ZS9tZWRpYS8zNzk1MjQ4NzcxMDFhZDUxZjllMWU3ZmE0MWY0MGJkY2FjOGQxODg5MjBhZWM4YTEwMDI4Y2M3ZGNiYTc2MTczLmJsb2I/379524877101ad51f9e1e7fa41f40bdcac8d188920aec8a10028cc7dcba76173.blob","bot":false,"created_at":"2020-05-30T00:22:44.000Z","display_name":"Sathariel :chaos_pink: Laugh is the Law","emojis":[{"shortcode":"chaos_pink","static_url":"https://stereophonic.space/proxy/ulolyNhFhc2ZfkCkjG2UKWgp1ko/aHR0cHM6Ly9nZW50b28ubGl2ZS9lbW9qaS9jdXN0b20vY2hhb3NfcGluay5wbmc/chaos_pink.png","url":"https://stereophonic.space/proxy/ulolyNhFhc2ZfkCkjG2UKWgp1ko/aHR0cHM6Ly9nZW50b28ubGl2ZS9lbW9qaS9jdXN0b20vY2hhb3NfcGluay5wbmc/chaos_pink.png","visible_in_picker":false}],"fields":[{"name":"XMPP","value":"sathariel@magicadro.ga"},{"name":"Matrix","value":"<a href=\"https://gentoo.live/users/sathariel\" rel=\"ugc\">@sathariel</a>:blob.cat"}],"followers_count":320,"following_count":234,"header":"https://stereophonic.space/proxy/xyLTi9kvPEnNBvvMWTjqlZZNaHo/aHR0cHM6Ly9nZW50b28ubGl2ZS9tZWRpYS83YTc0NTk4ODk0YmRmNjNiMDM2YmI0NWIyM2E3NDcyOGQ3ODJmMDQxZWIwODM3MWQ1YmE2NGYzMTFjMTYxYWRmLnBuZw/7a74598894bdf63b036bb45b23a74728d782f041eb08371d5ba64f311c161adf.png","header_static":"https://stereophonic.space/proxy/xyLTi9kvPEnNBvvMWTjqlZZNaHo/aHR0cHM6Ly9nZW50b28ubGl2ZS9tZWRpYS83YTc0NTk4ODk0YmRmNjNiMDM2YmI0NWIyM2E3NDcyOGQ3ODJmMDQxZWIwODM3MWQ1YmE2NGYzMTFjMTYxYWRmLnBuZw/7a74598894bdf63b036bb45b23a74728d782f041eb08371d5ba64f311c161adf.png","id":"9vYUMtDznVwH6ixy6q","locked":false,"note":"Magician of Paradoxes.<br/>I have no interest on ordinary humans, but if you have got magic or psychic powers, have traveled in time, discovered a conspiracy, came from another planet or dimension please add me.<br/><br/><a href=\"https://sathariel.tk\">https://sathariel.tk</a><br/><br/><br/>for as much as you claim to be crazy, sathy, you&#39;re more reasonable than 2/3 of the internet<br/>- Nerthos at SPC<br/><br/>sathy is a mystery box~<br/>- Kogomi (Rina-chan) at RaRuRe<br/>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://gentoo.live/users/sathariel","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":6544,"url":"https://gentoo.live/users/sathariel","username":"sathariel"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"<span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9vYsOX0iD0sfQCQyCu\" href=\"https://stereophonic.space/users/newt\">@<span>newt</span></a></span>","created_at":"2021-01-15T22:10:40.000Z","emojis":[],"favourited":true,"favourites_count":6,"id":"A3H7D5P1NSPv9NvJ5s","in_reply_to_account_id":"9rZ2STPb7FA7JnMRii","in_reply_to_id":"A3H6VFhTjIC2LXefVg","language":null,"media_attachments":[{"description":"","id":"-1561668185","pleroma":{"mime_type":"image/gif"},"preview_url":"https://stereophonic.space/proxy/nKbnyAv1PCRllODqFVg6497mOvo/aHR0cHM6Ly9nZW50b28ubGl2ZS9tZWRpYS82ZmY3ZGE2NWNjYTlkYmVlMGY0ZTJmZDE1YTQxNTdmMDVmODQzMzM1NmRlMmQwYTJhZGM5MWUyOWQ1ODcxZTM4LmdpZg/6ff7da65cca9dbee0f4e2fd15a4157f05f8433356de2d0a2adc91e29d5871e38.gif","remote_url":"https://stereophonic.space/proxy/nKbnyAv1PCRllODqFVg6497mOvo/aHR0cHM6Ly9nZW50b28ubGl2ZS9tZWRpYS82ZmY3ZGE2NWNjYTlkYmVlMGY0ZTJmZDE1YTQxNTdmMDVmODQzMzM1NmRlMmQwYTJhZGM5MWUyOWQ1ODcxZTM4LmdpZg/6ff7da65cca9dbee0f4e2fd15a4157f05f8433356de2d0a2adc91e29d5871e38.gif","text_url":"https://stereophonic.space/proxy/nKbnyAv1PCRllODqFVg6497mOvo/aHR0cHM6Ly9nZW50b28ubGl2ZS9tZWRpYS82ZmY3ZGE2NWNjYTlkYmVlMGY0ZTJmZDE1YTQxNTdmMDVmODQzMzM1NmRlMmQwYTJhZGM5MWUyOWQ1ODcxZTM4LmdpZg/6ff7da65cca9dbee0f4e2fd15a4157f05f8433356de2d0a2adc91e29d5871e38.gif","type":"image","url":"https://stereophonic.space/proxy/nKbnyAv1PCRllODqFVg6497mOvo/aHR0cHM6Ly9nZW50b28ubGl2ZS9tZWRpYS82ZmY3ZGE2NWNjYTlkYmVlMGY0ZTJmZDE1YTQxNTdmMDVmODQzMzM1NmRlMmQwYTJhZGM5MWUyOWQ1ODcxZTM4LmdpZg/6ff7da65cca9dbee0f4e2fd15a4157f05f8433356de2d0a2adc91e29d5871e38.gif"}],"mentions":[{"acct":"newt","id":"9rZ2STPb7FA7JnMRii","url":"https://stereophonic.space/users/newt","username":"newt"}],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"@newt"},"conversation_id":20781223,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":"newt","local":false,"parent_visible":true,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":4,"replies_count":0,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://gentoo.live/objects/1b3beee0-b353-4c67-be65-399bfa936495","url":"https://gentoo.live/objects/1b3beee0-b353-4c67-be65-399bfa936495","visibility":"public"},"type":"mention"},{"account":{"acct":"Stellar@fedi.absturztau.be","avatar":"https://stereophonic.space/proxy/UY5VCkfndTEtGEXtl2cqsuFVSs8/aHR0cHM6Ly9mZWRpLmFic3R1cnp0YXUuYmUvbWVkaWEvNjVmNWUzMzU5NzY0MzdkMzY4MDVmODRhYzM5MDMzNTY1NmExMjRhZWZiMWZiNTM5YmZhMTc4MDY2M2FiMmZhYS5naWY/65f5e335976437d36805f84ac390335656a124aefb1fb539bfa1780663ab2faa.gif","avatar_static":"https://stereophonic.space/proxy/UY5VCkfndTEtGEXtl2cqsuFVSs8/aHR0cHM6Ly9mZWRpLmFic3R1cnp0YXUuYmUvbWVkaWEvNjVmNWUzMzU5NzY0MzdkMzY4MDVmODRhYzM5MDMzNTY1NmExMjRhZWZiMWZiNTM5YmZhMTc4MDY2M2FiMmZhYS5naWY/65f5e335976437d36805f84ac390335656a124aefb1fb539bfa1780663ab2faa.gif","bot":false,"created_at":"2019-08-06T21:58:05.000Z","display_name":"ï¼³ï½”ï½…ï½Œï½Œï½ï½’ :ms_pleroma:â€‹â€‹","emojis":[{"shortcode":"ms_pleroma","static_url":"https://stereophonic.space/proxy/CMfON3VPh-np1C4ggKZSyukVqXU/aHR0cHM6Ly9mZWRpLmFic3R1cnp0YXUuYmUvZW1vamkvY3VzdG9tL21zX3BsZXJvbWEucG5n/ms_pleroma.png","url":"https://stereophonic.space/proxy/CMfON3VPh-np1C4ggKZSyukVqXU/aHR0cHM6Ly9mZWRpLmFic3R1cnp0YXUuYmUvZW1vamkvY3VzdG9tL21zX3BsZXJvbWEucG5n/ms_pleroma.png","visible_in_picker":false}],"fields":[{"name":"English","value":"French"},{"name":"Very","value":"Lewd"},{"name":"DONT","value":"DEAD"},{"name":"OPEN","value":"INSIDE"}],"followers_count":272,"following_count":399,"header":"https://stereophonic.space/proxy/yY_OPvFzFoJQJEnKyHi2qb4p_WM/aHR0cHM6Ly9mZWRpLmFic3R1cnp0YXUuYmUvbWVkaWEvNzZmMDk5ZDQxNjU2NzNmOWVjN2VhZGMyOTIzYWRhOGI0ZTc3Njc5NWRkYjUxZjI4MGU3ZWE1NWRlMjYxNTljMC5naWY/76f099d4165673f9ec7eadc2923ada8b4e776795ddb51f280e7ea55de26159c0.gif","header_static":"https://stereophonic.space/proxy/yY_OPvFzFoJQJEnKyHi2qb4p_WM/aHR0cHM6Ly9mZWRpLmFic3R1cnp0YXUuYmUvbWVkaWEvNzZmMDk5ZDQxNjU2NzNmOWVjN2VhZGMyOTIzYWRhOGI0ZTc3Njc5NWRkYjUxZjI4MGU3ZWE1NWRlMjYxNTljMC5naWY/76f099d4165673f9ec7eadc2923ada8b4e776795ddb51f280e7ea55de26159c0.gif","id":"9lcer8OuWEeNQCFmtc","locked":false,"note":"I love music, I love abstract art, i love old computers and cars, i love vaporwave and i make art.","pleroma":{"accepts_chat_messages":true,"ap_id":"https://fedi.absturztau.be/users/Stellar","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":16796,"url":"https://fedi.absturztau.be/users/Stellar","username":"Stellar"},"created_at":"2021-01-15T22:05:57.000Z","id":"326519","pleroma":{"is_muted":false,"is_seen":true},"status":{"account":{"acct":"newt","avatar":"https://stereophonic.space/media/badfe007441b8daa3da9c1dfcd56a71378e3a2c0022745030cfe017057129582.blob","avatar_static":"https://stereophonic.space/media/badfe007441b8daa3da9c1dfcd56a71378e3a2c0022745030cfe017057129582.blob","bot":false,"created_at":"2020-01-31T15:16:18.000Z","display_name":"NÌ¸Ì¢Ì¡Ì¢Ì¤Ì®Ì¥Ì²ÍÍ‹Í†Î£ÌµÌ›ÌžÌ€ÌˆÌÌ†Ì“ÌÍ›Ì‹áº‚ÌµÌ¢Ì«Ì£Ì¦Ì»Ì©Í‘Ì€ÍTÌµÍ™Ì¯Ì”ÌˆÌÍÍ…","emojis":[{"shortcode":"8b_a","static_url":"https://stereophonic.space/emoji/custom/8b_a.png","url":"https://stereophonic.space/emoji/custom/8b_a.png","visible_in_picker":false},{"shortcode":"8b_c","static_url":"https://stereophonic.space/emoji/custom/8b_c.png","url":"https://stereophonic.space/emoji/custom/8b_c.png","visible_in_picker":false},{"shortcode":"8b_d","static_url":"https://stereophonic.space/emoji/custom/8b_d.png","url":"https://stereophonic.space/emoji/custom/8b_d.png","visible_in_picker":false},{"shortcode":"8b_e","static_url":"https://stereophonic.space/emoji/custom/8b_e.png","url":"https://stereophonic.space/emoji/custom/8b_e.png","visible_in_picker":false},{"shortcode":"8b_i","static_url":"https://stereophonic.space/emoji/custom/8b_i.png","url":"https://stereophonic.space/emoji/custom/8b_i.png","visible_in_picker":false},{"shortcode":"8b_l","static_url":"https://stereophonic.space/emoji/custom/8b_l.png","url":"https://stereophonic.space/emoji/custom/8b_l.png","visible_in_picker":false},{"shortcode":"8b_m","static_url":"https://stereophonic.space/emoji/custom/8b_m.png","url":"https://stereophonic.space/emoji/custom/8b_m.png","visible_in_picker":false},{"shortcode":"8b_o","static_url":"https://stereophonic.space/emoji/custom/8b_o.png","url":"https://stereophonic.space/emoji/custom/8b_o.png","visible_in_picker":false},{"shortcode":"8b_p","static_url":"https://stereophonic.space/emoji/custom/8b_p.png","url":"https://stereophonic.space/emoji/custom/8b_p.png","visible_in_picker":false},{"shortcode":"8b_r","static_url":"https://stereophonic.space/emoji/custom/8b_r.png","url":"https://stereophonic.space/emoji/custom/8b_r.png","visible_in_picker":false},{"shortcode":"8b_s","static_url":"https://stereophonic.space/emoji/custom/8b_s.png","url":"https://stereophonic.space/emoji/custom/8b_s.png","visible_in_picker":false},{"shortcode":"8b_t","static_url":"https://stereophonic.space/emoji/custom/8b_t.png","url":"https://stereophonic.space/emoji/custom/8b_t.png","visible_in_picker":false},{"shortcode":"8b_u","static_url":"https://stereophonic.space/emoji/custom/8b_u.png","url":"https://stereophonic.space/emoji/custom/8b_u.png","visible_in_picker":false},{"shortcode":"8b_v","static_url":"https://stereophonic.space/emoji/custom/8b_v.png","url":"https://stereophonic.space/emoji/custom/8b_v.png","visible_in_picker":false},{"shortcode":"8b_y","static_url":"https://stereophonic.space/emoji/custom/8b_y.png","url":"https://stereophonic.space/emoji/custom/8b_y.png","visible_in_picker":false},{"shortcode":"comfycofesmirk","static_url":"https://stereophonic.space/emoji/comfy/comfycofesmirk.png","url":"https://stereophonic.space/emoji/comfy/comfycofesmirk.png","visible_in_picker":false}],"fields":[{"name":"cofe","value":":comfycofesmirk:"}],"follow_requests_count":0,"followers_count":315,"following_count":198,"header":"https://stereophonic.space/media/e43024f466693cad7887a60ffce07861bd15b9b54dd67fee90c774534787ee4d.jpg","header_static":"https://stereophonic.space/media/e43024f466693cad7887a60ffce07861bd15b9b54dd67fee90c774534787ee4d.jpg","id":"9rZ2STPb7FA7JnMRii","locked":false,"note":"Chaos evangelist.<br/>Sometimes evil.<br/>Almost godlike.<br/>Better, even more magnificent than before.<br/>Not for the faint of heart.<br/><br/>:8b_v:<br/>:8b_e:<br/>:8b_r:<br/>:8b_t:<br/>:8b_i:<br/>:8b_c:<br/>:8b_a:<br/>:8b_l:<br/><br/>:8b_s:<br/>:8b_u:<br/>:8b_p:<br/>:8b_r:<br/>:8b_e:<br/>:8b_m:<br/>:8b_a:<br/>:8b_c:<br/>:8b_y:<br/><br/>:8b_a:<br/>:8b_d:<br/>:8b_v:<br/>:8b_o:<br/>:8b_c:<br/>:8b_a:<br/>:8b_t:<br/>:8b_e:<br/><br/><a class=\"hashtag\" data-tag=\"niu\" href=\"https://stereophonic.space/tag/niu\">#niu</a> refugee. <br/>Programming and tech talk is mostly at <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9jCuHkYZPSuOlVU6qm\" href=\"https://functional.cafe/@pureevil\">@<span>pureevil@functional.cafe</span></a></span> but occasionally leaks.<br/>I write and actively use proprietary software. <br/><br/>Duke Nukem did nothing wrong.","pleroma":{"accepts_chat_messages":true,"allow_following_move":true,"ap_id":"https://stereophonic.space/users/newt","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":true,"is_moderator":false,"notification_settings":{"block_from_strangers":false,"hide_notification_contents":false},"relationship":{},"skip_thread_containment":false,"tags":[],"unread_conversation_count":34,"unread_notifications_count":10},"source":{"fields":[{"name":"cofe","value":":comfycofesmirk:"}],"note":"Chaos evangelist.\nSometimes evil.\nAlmost godlike.\nBetter, even more magnificent than before.\nNot for the faint of heart.\n\n:8b_v:\n:8b_e:\n:8b_r:\n:8b_t:\n:8b_i:\n:8b_c:\n:8b_a:\n:8b_l:\n\n:8b_s:\n:8b_u:\n:8b_p:\n:8b_r:\n:8b_e:\n:8b_m:\n:8b_a:\n:8b_c:\n:8b_y:\n\n:8b_a:\n:8b_d:\n:8b_v:\n:8b_o:\n:8b_c:\n:8b_a:\n:8b_t:\n:8b_e:\n\n#niu refugee. \nProgramming and tech talk is mostly at @pureevil@functional.cafe but occasionally leaks.\nI write and actively use proprietary software. \n\nDuke Nukem did nothing wrong.","pleroma":{"actor_type":"Person","discoverable":false,"no_rich_text":true,"show_role":false},"privacy":"public","sensitive":false},"statuses_count":9437,"url":"https://stereophonic.space/users/newt","username":"newt"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"<span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9zzoVd0oJZMuqGNzLk\" href=\"https://cdrom.tokyo/users/emilis\">@<span>emilis</span></a></span> :comfyevil:","created_at":"2021-01-15T22:02:51.000Z","emojis":[{"shortcode":"comfyevil","static_url":"https://stereophonic.space/emoji/comfy/comfyevil.png","url":"https://stereophonic.space/emoji/comfy/comfyevil.png","visible_in_picker":false}],"favourited":false,"favourites_count":1,"id":"A3H6ZlSxZCx01b11km","in_reply_to_account_id":"9zzoVd0oJZMuqGNzLk","in_reply_to_id":"A3H6X8mUQSilSxtp44","language":null,"media_attachments":[],"mentions":[{"acct":"emilis@cdrom.tokyo","id":"9zzoVd0oJZMuqGNzLk","url":"https://cdrom.tokyo/users/emilis","username":"emilis"}],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"@emilis :comfyevil:"},"conversation_id":20781223,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":"emilis@cdrom.tokyo","local":true,"parent_visible":true,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":0,"replies_count":1,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://stereophonic.space/objects/8fd0a989-3489-4e32-9c92-b96081ae6d1f","url":"https://stereophonic.space/notice/A3H6ZlSxZCx01b11km","visibility":"public"},"type":"favourite"},{"account":{"acct":"Stellar@fedi.absturztau.be","avatar":"https://stereophonic.space/proxy/UY5VCkfndTEtGEXtl2cqsuFVSs8/aHR0cHM6Ly9mZWRpLmFic3R1cnp0YXUuYmUvbWVkaWEvNjVmNWUzMzU5NzY0MzdkMzY4MDVmODRhYzM5MDMzNTY1NmExMjRhZWZiMWZiNTM5YmZhMTc4MDY2M2FiMmZhYS5naWY/65f5e335976437d36805f84ac390335656a124aefb1fb539bfa1780663ab2faa.gif","avatar_static":"https://stereophonic.space/proxy/UY5VCkfndTEtGEXtl2cqsuFVSs8/aHR0cHM6Ly9mZWRpLmFic3R1cnp0YXUuYmUvbWVkaWEvNjVmNWUzMzU5NzY0MzdkMzY4MDVmODRhYzM5MDMzNTY1NmExMjRhZWZiMWZiNTM5YmZhMTc4MDY2M2FiMmZhYS5naWY/65f5e335976437d36805f84ac390335656a124aefb1fb539bfa1780663ab2faa.gif","bot":false,"created_at":"2019-08-06T21:58:05.000Z","display_name":"ï¼³ï½”ï½…ï½Œï½Œï½ï½’ :ms_pleroma:â€‹â€‹","emojis":[{"shortcode":"ms_pleroma","static_url":"https://stereophonic.space/proxy/CMfON3VPh-np1C4ggKZSyukVqXU/aHR0cHM6Ly9mZWRpLmFic3R1cnp0YXUuYmUvZW1vamkvY3VzdG9tL21zX3BsZXJvbWEucG5n/ms_pleroma.png","url":"https://stereophonic.space/proxy/CMfON3VPh-np1C4ggKZSyukVqXU/aHR0cHM6Ly9mZWRpLmFic3R1cnp0YXUuYmUvZW1vamkvY3VzdG9tL21zX3BsZXJvbWEucG5n/ms_pleroma.png","visible_in_picker":false}],"fields":[{"name":"English","value":"French"},{"name":"Very","value":"Lewd"},{"name":"DONT","value":"DEAD"},{"name":"OPEN","value":"INSIDE"}],"followers_count":272,"following_count":399,"header":"https://stereophonic.space/proxy/yY_OPvFzFoJQJEnKyHi2qb4p_WM/aHR0cHM6Ly9mZWRpLmFic3R1cnp0YXUuYmUvbWVkaWEvNzZmMDk5ZDQxNjU2NzNmOWVjN2VhZGMyOTIzYWRhOGI0ZTc3Njc5NWRkYjUxZjI4MGU3ZWE1NWRlMjYxNTljMC5naWY/76f099d4165673f9ec7eadc2923ada8b4e776795ddb51f280e7ea55de26159c0.gif","header_static":"https://stereophonic.space/proxy/yY_OPvFzFoJQJEnKyHi2qb4p_WM/aHR0cHM6Ly9mZWRpLmFic3R1cnp0YXUuYmUvbWVkaWEvNzZmMDk5ZDQxNjU2NzNmOWVjN2VhZGMyOTIzYWRhOGI0ZTc3Njc5NWRkYjUxZjI4MGU3ZWE1NWRlMjYxNTljMC5naWY/76f099d4165673f9ec7eadc2923ada8b4e776795ddb51f280e7ea55de26159c0.gif","id":"9lcer8OuWEeNQCFmtc","locked":false,"note":"I love music, I love abstract art, i love old computers and cars, i love vaporwave and i make art.","pleroma":{"accepts_chat_messages":true,"ap_id":"https://fedi.absturztau.be/users/Stellar","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":16796,"url":"https://fedi.absturztau.be/users/Stellar","username":"Stellar"},"created_at":"2021-01-15T22:05:56.000Z","id":"326518","pleroma":{"is_muted":false,"is_seen":true},"status":{"account":{"acct":"newt","avatar":"https://stereophonic.space/media/badfe007441b8daa3da9c1dfcd56a71378e3a2c0022745030cfe017057129582.blob","avatar_static":"https://stereophonic.space/media/badfe007441b8daa3da9c1dfcd56a71378e3a2c0022745030cfe017057129582.blob","bot":false,"created_at":"2020-01-31T15:16:18.000Z","display_name":"NÌ¸Ì¢Ì¡Ì¢Ì¤Ì®Ì¥Ì²ÍÍ‹Í†Î£ÌµÌ›ÌžÌ€ÌˆÌÌ†Ì“ÌÍ›Ì‹áº‚ÌµÌ¢Ì«Ì£Ì¦Ì»Ì©Í‘Ì€ÍTÌµÍ™Ì¯Ì”ÌˆÌÍÍ…","emojis":[{"shortcode":"8b_a","static_url":"https://stereophonic.space/emoji/custom/8b_a.png","url":"https://stereophonic.space/emoji/custom/8b_a.png","visible_in_picker":false},{"shortcode":"8b_c","static_url":"https://stereophonic.space/emoji/custom/8b_c.png","url":"https://stereophonic.space/emoji/custom/8b_c.png","visible_in_picker":false},{"shortcode":"8b_d","static_url":"https://stereophonic.space/emoji/custom/8b_d.png","url":"https://stereophonic.space/emoji/custom/8b_d.png","visible_in_picker":false},{"shortcode":"8b_e","static_url":"https://stereophonic.space/emoji/custom/8b_e.png","url":"https://stereophonic.space/emoji/custom/8b_e.png","visible_in_picker":false},{"shortcode":"8b_i","static_url":"https://stereophonic.space/emoji/custom/8b_i.png","url":"https://stereophonic.space/emoji/custom/8b_i.png","visible_in_picker":false},{"shortcode":"8b_l","static_url":"https://stereophonic.space/emoji/custom/8b_l.png","url":"https://stereophonic.space/emoji/custom/8b_l.png","visible_in_picker":false},{"shortcode":"8b_m","static_url":"https://stereophonic.space/emoji/custom/8b_m.png","url":"https://stereophonic.space/emoji/custom/8b_m.png","visible_in_picker":false},{"shortcode":"8b_o","static_url":"https://stereophonic.space/emoji/custom/8b_o.png","url":"https://stereophonic.space/emoji/custom/8b_o.png","visible_in_picker":false},{"shortcode":"8b_p","static_url":"https://stereophonic.space/emoji/custom/8b_p.png","url":"https://stereophonic.space/emoji/custom/8b_p.png","visible_in_picker":false},{"shortcode":"8b_r","static_url":"https://stereophonic.space/emoji/custom/8b_r.png","url":"https://stereophonic.space/emoji/custom/8b_r.png","visible_in_picker":false},{"shortcode":"8b_s","static_url":"https://stereophonic.space/emoji/custom/8b_s.png","url":"https://stereophonic.space/emoji/custom/8b_s.png","visible_in_picker":false},{"shortcode":"8b_t","static_url":"https://stereophonic.space/emoji/custom/8b_t.png","url":"https://stereophonic.space/emoji/custom/8b_t.png","visible_in_picker":false},{"shortcode":"8b_u","static_url":"https://stereophonic.space/emoji/custom/8b_u.png","url":"https://stereophonic.space/emoji/custom/8b_u.png","visible_in_picker":false},{"shortcode":"8b_v","static_url":"https://stereophonic.space/emoji/custom/8b_v.png","url":"https://stereophonic.space/emoji/custom/8b_v.png","visible_in_picker":false},{"shortcode":"8b_y","static_url":"https://stereophonic.space/emoji/custom/8b_y.png","url":"https://stereophonic.space/emoji/custom/8b_y.png","visible_in_picker":false},{"shortcode":"comfycofesmirk","static_url":"https://stereophonic.space/emoji/comfy/comfycofesmirk.png","url":"https://stereophonic.space/emoji/comfy/comfycofesmirk.png","visible_in_picker":false}],"fields":[{"name":"cofe","value":":comfycofesmirk:"}],"follow_requests_count":0,"followers_count":315,"following_count":198,"header":"https://stereophonic.space/media/e43024f466693cad7887a60ffce07861bd15b9b54dd67fee90c774534787ee4d.jpg","header_static":"https://stereophonic.space/media/e43024f466693cad7887a60ffce07861bd15b9b54dd67fee90c774534787ee4d.jpg","id":"9rZ2STPb7FA7JnMRii","locked":false,"note":"Chaos evangelist.<br/>Sometimes evil.<br/>Almost godlike.<br/>Better, even more magnificent than before.<br/>Not for the faint of heart.<br/><br/>:8b_v:<br/>:8b_e:<br/>:8b_r:<br/>:8b_t:<br/>:8b_i:<br/>:8b_c:<br/>:8b_a:<br/>:8b_l:<br/><br/>:8b_s:<br/>:8b_u:<br/>:8b_p:<br/>:8b_r:<br/>:8b_e:<br/>:8b_m:<br/>:8b_a:<br/>:8b_c:<br/>:8b_y:<br/><br/>:8b_a:<br/>:8b_d:<br/>:8b_v:<br/>:8b_o:<br/>:8b_c:<br/>:8b_a:<br/>:8b_t:<br/>:8b_e:<br/><br/><a class=\"hashtag\" data-tag=\"niu\" href=\"https://stereophonic.space/tag/niu\">#niu</a> refugee. <br/>Programming and tech talk is mostly at <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9jCuHkYZPSuOlVU6qm\" href=\"https://functional.cafe/@pureevil\">@<span>pureevil@functional.cafe</span></a></span> but occasionally leaks.<br/>I write and actively use proprietary software. <br/><br/>Duke Nukem did nothing wrong.","pleroma":{"accepts_chat_messages":true,"allow_following_move":true,"ap_id":"https://stereophonic.space/users/newt","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":true,"is_moderator":false,"notification_settings":{"block_from_strangers":false,"hide_notification_contents":false},"relationship":{},"skip_thread_containment":false,"tags":[],"unread_conversation_count":34,"unread_notifications_count":10},"source":{"fields":[{"name":"cofe","value":":comfycofesmirk:"}],"note":"Chaos evangelist.\nSometimes evil.\nAlmost godlike.\nBetter, even more magnificent than before.\nNot for the faint of heart.\n\n:8b_v:\n:8b_e:\n:8b_r:\n:8b_t:\n:8b_i:\n:8b_c:\n:8b_a:\n:8b_l:\n\n:8b_s:\n:8b_u:\n:8b_p:\n:8b_r:\n:8b_e:\n:8b_m:\n:8b_a:\n:8b_c:\n:8b_y:\n\n:8b_a:\n:8b_d:\n:8b_v:\n:8b_o:\n:8b_c:\n:8b_a:\n:8b_t:\n:8b_e:\n\n#niu refugee. \nProgramming and tech talk is mostly at @pureevil@functional.cafe but occasionally leaks.\nI write and actively use proprietary software. \n\nDuke Nukem did nothing wrong.","pleroma":{"actor_type":"Person","discoverable":false,"no_rich_text":true,"show_role":false},"privacy":"public","sensitive":false},"statuses_count":9437,"url":"https://stereophonic.space/users/newt","username":"newt"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"My internet is ded. Send me more internets please :comfygeek:","created_at":"2021-01-15T22:02:02.000Z","emojis":[{"shortcode":"comfygeek","static_url":"https://stereophonic.space/emoji/comfy/comfygeek.png","url":"https://stereophonic.space/emoji/comfy/comfygeek.png","visible_in_picker":false}],"favourited":false,"favourites_count":2,"id":"A3H6VFhTjIC2LXefVg","in_reply_to_account_id":null,"in_reply_to_id":null,"language":null,"media_attachments":[],"mentions":[],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"My internet is ded. Send me more internets please :comfygeek:"},"conversation_id":20781223,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":null,"local":true,"parent_visible":false,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":0,"replies_count":3,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://stereophonic.space/objects/5f533d84-01a8-4f3d-baa7-ed079b089138","url":"https://stereophonic.space/notice/A3H6VFhTjIC2LXefVg","visibility":"public"},"type":"favourite"},{"account":{"acct":"emilis@cdrom.tokyo","avatar":"https://stereophonic.space/proxy/8V0mOwZFa_B-_CynqAMBTct_6gY/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS9lODIxMzc0MWJjZWE5MmIzN2JhNWFmM2EzZmE5NjZjNTU2NzFkZDMxZTUyZjZiNWRmNzJmYTM0ZDk1YTI0NTdmLmpwZw/e8213741bcea92b37ba5af3a3fa966c55671dd31e52f6b5df72fa34d95a2457f.jpg","avatar_static":"https://stereophonic.space/proxy/8V0mOwZFa_B-_CynqAMBTct_6gY/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS9lODIxMzc0MWJjZWE5MmIzN2JhNWFmM2EzZmE5NjZjNTU2NzFkZDMxZTUyZjZiNWRmNzJmYTM0ZDk1YTI0NTdmLmpwZw/e8213741bcea92b37ba5af3a3fa966c55671dd31e52f6b5df72fa34d95a2457f.jpg","bot":false,"created_at":"2020-10-09T20:14:01.000Z","display_name":"romaboo :jigglypuff:","emojis":[{"shortcode":"jigglypuff","static_url":"https://stereophonic.space/proxy/bnKBn39yPRzUVLRRsLrf-6g4u04/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9jZHJvbS9qaWdnbHlwdWZmLnBuZw/jigglypuff.png","url":"https://stereophonic.space/proxy/bnKBn39yPRzUVLRRsLrf-6g4u04/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9jZHJvbS9qaWdnbHlwdWZmLnBuZw/jigglypuff.png","visible_in_picker":false}],"fields":[],"followers_count":6,"following_count":12,"header":"https://stereophonic.space/proxy/oeQXvgFN5DnvG8xvOo-NU7BBbO0/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS81NTE1MThhYzRlNGQ0YTJiZWI1M2ExNTgxOTIwYzJkNDNmYjUzMDA1ZWI2MTU4MjBiMDE2NGYxMDczMTRmMjk4LmpwZw/551518ac4e4d4a2beb53a1581920c2d43fb53005eb615820b0164f107314f298.jpg","header_static":"https://stereophonic.space/proxy/oeQXvgFN5DnvG8xvOo-NU7BBbO0/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS81NTE1MThhYzRlNGQ0YTJiZWI1M2ExNTgxOTIwYzJkNDNmYjUzMDA1ZWI2MTU4MjBiMDE2NGYxMDczMTRmMjk4LmpwZw/551518ac4e4d4a2beb53a1581920c2d43fb53005eb615820b0164f107314f298.jpg","id":"9zzoVd0oJZMuqGNzLk","locked":false,"note":"lego is based on nipples<br/><br/>In lingua latina: <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9vqY7exhRY86vqnH6m\" href=\"https://cdrom.tokyo/users/aemilivs\">@<span>aemilivs</span></a></span>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://cdrom.tokyo/users/emilis","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":true},"sensitive":false},"statuses_count":4721,"url":"https://cdrom.tokyo/users/emilis","username":"emilis"},"created_at":"2021-01-15T22:05:04.000Z","id":"326517","pleroma":{"is_muted":false,"is_seen":true},"status":{"account":{"acct":"emilis@cdrom.tokyo","avatar":"https://stereophonic.space/proxy/8V0mOwZFa_B-_CynqAMBTct_6gY/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS9lODIxMzc0MWJjZWE5MmIzN2JhNWFmM2EzZmE5NjZjNTU2NzFkZDMxZTUyZjZiNWRmNzJmYTM0ZDk1YTI0NTdmLmpwZw/e8213741bcea92b37ba5af3a3fa966c55671dd31e52f6b5df72fa34d95a2457f.jpg","avatar_static":"https://stereophonic.space/proxy/8V0mOwZFa_B-_CynqAMBTct_6gY/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS9lODIxMzc0MWJjZWE5MmIzN2JhNWFmM2EzZmE5NjZjNTU2NzFkZDMxZTUyZjZiNWRmNzJmYTM0ZDk1YTI0NTdmLmpwZw/e8213741bcea92b37ba5af3a3fa966c55671dd31e52f6b5df72fa34d95a2457f.jpg","bot":false,"created_at":"2020-10-09T20:14:01.000Z","display_name":"romaboo :jigglypuff:","emojis":[{"shortcode":"jigglypuff","static_url":"https://stereophonic.space/proxy/bnKBn39yPRzUVLRRsLrf-6g4u04/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9jZHJvbS9qaWdnbHlwdWZmLnBuZw/jigglypuff.png","url":"https://stereophonic.space/proxy/bnKBn39yPRzUVLRRsLrf-6g4u04/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9jZHJvbS9qaWdnbHlwdWZmLnBuZw/jigglypuff.png","visible_in_picker":false}],"fields":[],"followers_count":6,"following_count":12,"header":"https://stereophonic.space/proxy/oeQXvgFN5DnvG8xvOo-NU7BBbO0/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS81NTE1MThhYzRlNGQ0YTJiZWI1M2ExNTgxOTIwYzJkNDNmYjUzMDA1ZWI2MTU4MjBiMDE2NGYxMDczMTRmMjk4LmpwZw/551518ac4e4d4a2beb53a1581920c2d43fb53005eb615820b0164f107314f298.jpg","header_static":"https://stereophonic.space/proxy/oeQXvgFN5DnvG8xvOo-NU7BBbO0/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS81NTE1MThhYzRlNGQ0YTJiZWI1M2ExNTgxOTIwYzJkNDNmYjUzMDA1ZWI2MTU4MjBiMDE2NGYxMDczMTRmMjk4LmpwZw/551518ac4e4d4a2beb53a1581920c2d43fb53005eb615820b0164f107314f298.jpg","id":"9zzoVd0oJZMuqGNzLk","locked":false,"note":"lego is based on nipples<br/><br/>In lingua latina: <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9vqY7exhRY86vqnH6m\" href=\"https://cdrom.tokyo/users/aemilivs\">@<span>aemilivs</span></a></span>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://cdrom.tokyo/users/emilis","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":true},"sensitive":false},"statuses_count":4721,"url":"https://cdrom.tokyo/users/emilis","username":"emilis"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"<p><span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9vLK6FwkZYqQAO4wIS\" href=\"https://stereophonic.space/users/newt\">@<span>newt</span></a></span> bojo took my fucking internet :angryduck:</p>","created_at":"2021-01-15T22:05:03.000Z","emojis":[{"shortcode":"angryduck","static_url":"https://stereophonic.space/proxy/yHQSc7EX9LDoKI9p60DsxUKBMEo/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9zdG9sZW4vYW5ncnlkdWNrLnBuZw/angryduck.png","url":"https://stereophonic.space/proxy/yHQSc7EX9LDoKI9p60DsxUKBMEo/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9zdG9sZW4vYW5ncnlkdWNrLnBuZw/angryduck.png","visible_in_picker":false}],"favourited":false,"favourites_count":1,"id":"A3H6m2L8ejrppiD1iS","in_reply_to_account_id":"9rZ2STPb7FA7JnMRii","in_reply_to_id":"A3H6ZlSxZCx01b11km","language":null,"media_attachments":[],"mentions":[{"acct":"newt","id":"9rZ2STPb7FA7JnMRii","url":"https://stereophonic.space/users/newt","username":"newt"}],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"@newt bojo took my fucking internet :angryduck:"},"conversation_id":20781223,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":"newt","local":false,"parent_visible":true,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":0,"replies_count":0,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://cdrom.tokyo/objects/8c1f9c70-29a7-4538-a999-649f5de02d2b","url":"https://cdrom.tokyo/objects/8c1f9c70-29a7-4538-a999-649f5de02d2b","visibility":"public"},"type":"mention"},{"account":{"acct":"Mitsu@shitposter.club","avatar":"https://stereophonic.space/proxy/nbixOd_jb_p8mZMKawPwrvkZzcY/aHR0cHM6Ly9zaGl0cG9zdGVyLmNsdWIvbWVkaWEvMmI1N2Y5ODc1MWE2NjVhNGVhOGI3NzlkMWVlNTEzOWY5NDQwZWQ3NzcwMjY4Nzg0ZjY4MmRhNjA4Mzc3MmJmZC5wbmc_bmFtZT1OWE5FSTRRTDZYSjgucG5n/2b57f98751a665a4ea8b779d1ee5139f9440ed7770268784f682da6083772bfd.png","avatar_static":"https://stereophonic.space/proxy/nbixOd_jb_p8mZMKawPwrvkZzcY/aHR0cHM6Ly9zaGl0cG9zdGVyLmNsdWIvbWVkaWEvMmI1N2Y5ODc1MWE2NjVhNGVhOGI3NzlkMWVlNTEzOWY5NDQwZWQ3NzcwMjY4Nzg0ZjY4MmRhNjA4Mzc3MmJmZC5wbmc_bmFtZT1OWE5FSTRRTDZYSjgucG5n/2b57f98751a665a4ea8b779d1ee5139f9440ed7770268784f682da6083772bfd.png","bot":false,"created_at":"2019-09-07T22:53:17.000Z","display_name":"Mitsu","emojis":[],"fields":[],"followers_count":346,"following_count":187,"header":"https://stereophonic.space/proxy/QPTIvD_T53_WPuCHyrA2AVL6uvo/aHR0cHM6Ly9zaGl0cG9zdGVyLmNsdWIvbWVkaWEvZDVhZmFkNWFjNzMxMzUyYTdiMjdhZTM0MzhhNjcwZjBhMDJjZjIwOTcwNDE4YzJkMjJiMTgyNjY0Nzg2YmRmNi5naWY_bmFtZT10dW1ibHJfaW5saW5lX3BpNnVwaWNjbGUxc3I5a3JuXzU0MC5naWY/d5afad5ac731352a7b27ae3438a670f0a02cf20970418c2d22b182664786bdf6.gif","header_static":"https://stereophonic.space/proxy/QPTIvD_T53_WPuCHyrA2AVL6uvo/aHR0cHM6Ly9zaGl0cG9zdGVyLmNsdWIvbWVkaWEvZDVhZmFkNWFjNzMxMzUyYTdiMjdhZTM0MzhhNjcwZjBhMDJjZjIwOTcwNDE4YzJkMjJiMTgyNjY0Nzg2YmRmNi5naWY_bmFtZT10dW1ibHJfaW5saW5lX3BpNnVwaWNjbGUxc3I5a3JuXzU0MC5naWY/d5afad5ac731352a7b27ae3438a670f0a02cf20970418c2d22b182664786bdf6.gif","id":"9mh4E0Ch5KoiDZBSQC","locked":false,"note":"ðŸ‘©ðŸ»â€ðŸ¦°â¤ï¸ðŸ¶ðŸ±ðŸ°<br/><br/>Bf: <span class=\"h-card\"><a data-user=\"9kwuqJiifRDOsgQ5ku\" class=\"u-url mention\" href=\"https://pleroma.guizzyordi.info/users/guizzy\">@<span>guizzy@pleroma.guizzyordi.info</span></a></span>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://shitposter.club/users/Mitsu","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":37484,"url":"https://shitposter.club/users/Mitsu","username":"Mitsu"},"created_at":"2021-01-15T22:02:28.000Z","id":"326516","pleroma":{"is_muted":false,"is_seen":true},"status":{"account":{"acct":"Mitsu@shitposter.club","avatar":"https://stereophonic.space/proxy/nbixOd_jb_p8mZMKawPwrvkZzcY/aHR0cHM6Ly9zaGl0cG9zdGVyLmNsdWIvbWVkaWEvMmI1N2Y5ODc1MWE2NjVhNGVhOGI3NzlkMWVlNTEzOWY5NDQwZWQ3NzcwMjY4Nzg0ZjY4MmRhNjA4Mzc3MmJmZC5wbmc_bmFtZT1OWE5FSTRRTDZYSjgucG5n/2b57f98751a665a4ea8b779d1ee5139f9440ed7770268784f682da6083772bfd.png","avatar_static":"https://stereophonic.space/proxy/nbixOd_jb_p8mZMKawPwrvkZzcY/aHR0cHM6Ly9zaGl0cG9zdGVyLmNsdWIvbWVkaWEvMmI1N2Y5ODc1MWE2NjVhNGVhOGI3NzlkMWVlNTEzOWY5NDQwZWQ3NzcwMjY4Nzg0ZjY4MmRhNjA4Mzc3MmJmZC5wbmc_bmFtZT1OWE5FSTRRTDZYSjgucG5n/2b57f98751a665a4ea8b779d1ee5139f9440ed7770268784f682da6083772bfd.png","bot":false,"created_at":"2019-09-07T22:53:17.000Z","display_name":"Mitsu","emojis":[],"fields":[],"followers_count":346,"following_count":187,"header":"https://stereophonic.space/proxy/QPTIvD_T53_WPuCHyrA2AVL6uvo/aHR0cHM6Ly9zaGl0cG9zdGVyLmNsdWIvbWVkaWEvZDVhZmFkNWFjNzMxMzUyYTdiMjdhZTM0MzhhNjcwZjBhMDJjZjIwOTcwNDE4YzJkMjJiMTgyNjY0Nzg2YmRmNi5naWY_bmFtZT10dW1ibHJfaW5saW5lX3BpNnVwaWNjbGUxc3I5a3JuXzU0MC5naWY/d5afad5ac731352a7b27ae3438a670f0a02cf20970418c2d22b182664786bdf6.gif","header_static":"https://stereophonic.space/proxy/QPTIvD_T53_WPuCHyrA2AVL6uvo/aHR0cHM6Ly9zaGl0cG9zdGVyLmNsdWIvbWVkaWEvZDVhZmFkNWFjNzMxMzUyYTdiMjdhZTM0MzhhNjcwZjBhMDJjZjIwOTcwNDE4YzJkMjJiMTgyNjY0Nzg2YmRmNi5naWY_bmFtZT10dW1ibHJfaW5saW5lX3BpNnVwaWNjbGUxc3I5a3JuXzU0MC5naWY/d5afad5ac731352a7b27ae3438a670f0a02cf20970418c2d22b182664786bdf6.gif","id":"9mh4E0Ch5KoiDZBSQC","locked":false,"note":"ðŸ‘©ðŸ»â€ðŸ¦°â¤ï¸ðŸ¶ðŸ±ðŸ°<br/><br/>Bf: <span class=\"h-card\"><a data-user=\"9kwuqJiifRDOsgQ5ku\" class=\"u-url mention\" href=\"https://pleroma.guizzyordi.info/users/guizzy\">@<span>guizzy@pleroma.guizzyordi.info</span></a></span>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://shitposter.club/users/Mitsu","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":false},"sensitive":false},"statuses_count":37484,"url":"https://shitposter.club/users/Mitsu","username":"Mitsu"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"<span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9rZ38To3IPHp89NigC\" href=\"https://stereophonic.space/users/newt\">@<span>newt</span></a></span> No","created_at":"2021-01-15T22:02:27.000Z","emojis":[],"favourited":false,"favourites_count":0,"id":"A3H6Xba5Lf1umtJpFw","in_reply_to_account_id":"9rZ2STPb7FA7JnMRii","in_reply_to_id":"A3H6VFhTjIC2LXefVg","language":null,"media_attachments":[],"mentions":[{"acct":"newt","id":"9rZ2STPb7FA7JnMRii","url":"https://stereophonic.space/users/newt","username":"newt"}],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"@newt No"},"conversation_id":20781223,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":"newt","local":false,"parent_visible":true,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":0,"replies_count":0,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://shitposter.club/objects/9973180c-c8b6-43c1-8864-0a21bbce15e0","url":"https://shitposter.club/objects/9973180c-c8b6-43c1-8864-0a21bbce15e0","visibility":"public"},"type":"mention"},{"account":{"acct":"emilis@cdrom.tokyo","avatar":"https://stereophonic.space/proxy/8V0mOwZFa_B-_CynqAMBTct_6gY/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS9lODIxMzc0MWJjZWE5MmIzN2JhNWFmM2EzZmE5NjZjNTU2NzFkZDMxZTUyZjZiNWRmNzJmYTM0ZDk1YTI0NTdmLmpwZw/e8213741bcea92b37ba5af3a3fa966c55671dd31e52f6b5df72fa34d95a2457f.jpg","avatar_static":"https://stereophonic.space/proxy/8V0mOwZFa_B-_CynqAMBTct_6gY/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS9lODIxMzc0MWJjZWE5MmIzN2JhNWFmM2EzZmE5NjZjNTU2NzFkZDMxZTUyZjZiNWRmNzJmYTM0ZDk1YTI0NTdmLmpwZw/e8213741bcea92b37ba5af3a3fa966c55671dd31e52f6b5df72fa34d95a2457f.jpg","bot":false,"created_at":"2020-10-09T20:14:01.000Z","display_name":"romaboo :jigglypuff:","emojis":[{"shortcode":"jigglypuff","static_url":"https://stereophonic.space/proxy/bnKBn39yPRzUVLRRsLrf-6g4u04/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9jZHJvbS9qaWdnbHlwdWZmLnBuZw/jigglypuff.png","url":"https://stereophonic.space/proxy/bnKBn39yPRzUVLRRsLrf-6g4u04/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9jZHJvbS9qaWdnbHlwdWZmLnBuZw/jigglypuff.png","visible_in_picker":false}],"fields":[],"followers_count":6,"following_count":12,"header":"https://stereophonic.space/proxy/oeQXvgFN5DnvG8xvOo-NU7BBbO0/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS81NTE1MThhYzRlNGQ0YTJiZWI1M2ExNTgxOTIwYzJkNDNmYjUzMDA1ZWI2MTU4MjBiMDE2NGYxMDczMTRmMjk4LmpwZw/551518ac4e4d4a2beb53a1581920c2d43fb53005eb615820b0164f107314f298.jpg","header_static":"https://stereophonic.space/proxy/oeQXvgFN5DnvG8xvOo-NU7BBbO0/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS81NTE1MThhYzRlNGQ0YTJiZWI1M2ExNTgxOTIwYzJkNDNmYjUzMDA1ZWI2MTU4MjBiMDE2NGYxMDczMTRmMjk4LmpwZw/551518ac4e4d4a2beb53a1581920c2d43fb53005eb615820b0164f107314f298.jpg","id":"9zzoVd0oJZMuqGNzLk","locked":false,"note":"lego is based on nipples<br/><br/>In lingua latina: <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9vqY7exhRY86vqnH6m\" href=\"https://cdrom.tokyo/users/aemilivs\">@<span>aemilivs</span></a></span>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://cdrom.tokyo/users/emilis","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":true},"sensitive":false},"statuses_count":4721,"url":"https://cdrom.tokyo/users/emilis","username":"emilis"},"created_at":"2021-01-15T22:02:23.000Z","id":"326515","pleroma":{"is_muted":false,"is_seen":true},"status":{"account":{"acct":"emilis@cdrom.tokyo","avatar":"https://stereophonic.space/proxy/8V0mOwZFa_B-_CynqAMBTct_6gY/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS9lODIxMzc0MWJjZWE5MmIzN2JhNWFmM2EzZmE5NjZjNTU2NzFkZDMxZTUyZjZiNWRmNzJmYTM0ZDk1YTI0NTdmLmpwZw/e8213741bcea92b37ba5af3a3fa966c55671dd31e52f6b5df72fa34d95a2457f.jpg","avatar_static":"https://stereophonic.space/proxy/8V0mOwZFa_B-_CynqAMBTct_6gY/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS9lODIxMzc0MWJjZWE5MmIzN2JhNWFmM2EzZmE5NjZjNTU2NzFkZDMxZTUyZjZiNWRmNzJmYTM0ZDk1YTI0NTdmLmpwZw/e8213741bcea92b37ba5af3a3fa966c55671dd31e52f6b5df72fa34d95a2457f.jpg","bot":false,"created_at":"2020-10-09T20:14:01.000Z","display_name":"romaboo :jigglypuff:","emojis":[{"shortcode":"jigglypuff","static_url":"https://stereophonic.space/proxy/bnKBn39yPRzUVLRRsLrf-6g4u04/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9jZHJvbS9qaWdnbHlwdWZmLnBuZw/jigglypuff.png","url":"https://stereophonic.space/proxy/bnKBn39yPRzUVLRRsLrf-6g4u04/aHR0cHM6Ly9jZHJvbS50b2t5by9lbW9qaS9jZHJvbS9qaWdnbHlwdWZmLnBuZw/jigglypuff.png","visible_in_picker":false}],"fields":[],"followers_count":6,"following_count":12,"header":"https://stereophonic.space/proxy/oeQXvgFN5DnvG8xvOo-NU7BBbO0/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS81NTE1MThhYzRlNGQ0YTJiZWI1M2ExNTgxOTIwYzJkNDNmYjUzMDA1ZWI2MTU4MjBiMDE2NGYxMDczMTRmMjk4LmpwZw/551518ac4e4d4a2beb53a1581920c2d43fb53005eb615820b0164f107314f298.jpg","header_static":"https://stereophonic.space/proxy/oeQXvgFN5DnvG8xvOo-NU7BBbO0/aHR0cHM6Ly9jZHJvbS50b2t5by9tZWRpYS81NTE1MThhYzRlNGQ0YTJiZWI1M2ExNTgxOTIwYzJkNDNmYjUzMDA1ZWI2MTU4MjBiMDE2NGYxMDczMTRmMjk4LmpwZw/551518ac4e4d4a2beb53a1581920c2d43fb53005eb615820b0164f107314f298.jpg","id":"9zzoVd0oJZMuqGNzLk","locked":false,"note":"lego is based on nipples<br/><br/>In lingua latina: <span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9vqY7exhRY86vqnH6m\" href=\"https://cdrom.tokyo/users/aemilivs\">@<span>aemilivs</span></a></span>","pleroma":{"accepts_chat_messages":true,"ap_id":"https://cdrom.tokyo/users/emilis","background_image":null,"confirmation_pending":false,"deactivated":false,"favicon":null,"hide_favorites":true,"hide_followers":false,"hide_followers_count":false,"hide_follows":false,"hide_follows_count":false,"is_admin":false,"is_moderator":false,"relationship":{},"skip_thread_containment":false,"tags":[]},"source":{"fields":[],"note":"","pleroma":{"actor_type":"Person","discoverable":true},"sensitive":false},"statuses_count":4721,"url":"https://cdrom.tokyo/users/emilis","username":"emilis"},"application":{"name":"Web","website":null},"bookmarked":false,"card":null,"content":"<p><span class=\"h-card\"><a class=\"u-url mention\" data-user=\"9vLK6FwkZYqQAO4wIS\" href=\"https://stereophonic.space/users/newt\">@<span>newt</span></a></span> canâ€™t, itâ€™s all closed til march here</p>","created_at":"2021-01-15T22:02:22.000Z","emojis":[],"favourited":false,"favourites_count":1,"id":"A3H6X8mUQSilSxtp44","in_reply_to_account_id":"9rZ2STPb7FA7JnMRii","in_reply_to_id":"A3H6VFhTjIC2LXefVg","language":null,"media_attachments":[],"mentions":[{"acct":"newt","id":"9rZ2STPb7FA7JnMRii","url":"https://stereophonic.space/users/newt","username":"newt"}],"muted":false,"pinned":false,"pleroma":{"content":{"text/plain":"@newt canâ€™t, itâ€™s all closed til march here"},"conversation_id":20781223,"direct_conversation_id":null,"emoji_reactions":[],"expires_at":null,"in_reply_to_account_acct":"newt","local":false,"parent_visible":true,"spoiler_text":{"text/plain":""},"thread_muted":false},"poll":null,"reblog":null,"reblogged":false,"reblogs_count":0,"replies_count":1,"sensitive":false,"spoiler_text":"","tags":[],"text":null,"uri":"https://cdrom.tokyo/objects/ea900ed9-5364-4caf-8dbe-97e04c5dae63","url":"https://cdrom.tokyo/objects/ea900ed9-5364-4caf-8dbe-97e04c5dae63","visibility":"public"},"type":"mention"}]
/* eslint-enable */

const fetchTimeline = ({
  timeline,
  credentials,
  since = false,
  until = false,
  userId = false,
  tag = false,
  withMuted = false,
  replyVisibility = 'all'
}) => {
  const timelineUrls = {
    public: MASTODON_PUBLIC_TIMELINE,
    friends: MASTODON_USER_HOME_TIMELINE_URL,
    dms: MASTODON_DIRECT_MESSAGES_TIMELINE_URL,
    notifications: MASTODON_USER_NOTIFICATIONS_URL,
    'publicAndExternal': MASTODON_PUBLIC_TIMELINE,
    user: MASTODON_USER_TIMELINE_URL,
    media: MASTODON_USER_TIMELINE_URL,
    favorites: MASTODON_USER_FAVORITES_TIMELINE_URL,
    tag: MASTODON_TAG_TIMELINE_URL,
    bookmarks: MASTODON_BOOKMARK_TIMELINE_URL
  }
  const isNotifications = timeline === 'notifications'
  const params = []

  let url = timelineUrls[timeline]

  if (timeline === 'user' || timeline === 'media') {
    url = url(userId)
  }

  if (since) {
    params.push(['since_id', since])
  }
  if (until) {
    params.push(['max_id', until])
  }
  if (tag) {
    url = url(tag)
  }
  if (timeline === 'media') {
    params.push(['only_media', 1])
  }
  if (timeline === 'public') {
    params.push(['local', true])
  }
  if (timeline === 'public' || timeline === 'publicAndExternal') {
    params.push(['only_media', false])
  }
  if (timeline !== 'favorites' && timeline !== 'bookmarks') {
    params.push(['with_muted', withMuted])
  }
  if (replyVisibility !== 'all') {
    params.push(['reply_visibility', replyVisibility])
  }

  params.push(['limit', 20])

  const queryString = map(params, (param) => `${param[0]}=${param[1]}`).join('&')
  url += `?${queryString}`

  let status = ''
  let statusText = ''

  let pagination = {}
  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => {
      status = data.status
      statusText = data.statusText
      pagination = parseLinkHeaderPagination(data.headers.get('Link'), {
        flakeId: timeline !== 'bookmarks' && timeline !== 'notifications'
      })
      return data
    })
    .then((data) => data.json())
    .then((data) => {
      if (!data.errors) {
        if (isNotifications) {
          // return { data: [parseNotification(report)], pagination }
          console.log(notifs2.map(n => ({ notif: n, status: n.status })))
          const parsedNotifs = notifs2.map(parseNotification)
          console.log(parsedNotifs)
          return { data: parsedNotifs, pagination }
        }

        return { data: data.map(isNotifications ? parseNotification : parseStatus), pagination }
      } else {
        data.status = status
        data.statusText = statusText
        return data
      }
    })
}

const fetchPinnedStatuses = ({ id, credentials }) => {
  const url = MASTODON_USER_TIMELINE_URL(id) + '?pinned=true'
  return promisedRequest({ url, credentials })
    .then((data) => data.map(parseStatus))
}

const verifyCredentials = (user) => {
  return fetch(MASTODON_LOGIN_URL, {
    headers: authHeaders(user)
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      } else {
        return {
          error: response
        }
      }
    })
    .then((data) => data.error ? data : parseUser(data))
}

const favorite = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_FAVORITE_URL(id), method: 'POST', credentials })
    .then((data) => parseStatus(data))
}

const unfavorite = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_UNFAVORITE_URL(id), method: 'POST', credentials })
    .then((data) => parseStatus(data))
}

const retweet = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_RETWEET_URL(id), method: 'POST', credentials })
    .then((data) => parseStatus(data))
}

const unretweet = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_UNRETWEET_URL(id), method: 'POST', credentials })
    .then((data) => parseStatus(data))
}

const bookmarkStatus = ({ id, credentials }) => {
  return promisedRequest({
    url: MASTODON_BOOKMARK_STATUS_URL(id),
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const unbookmarkStatus = ({ id, credentials }) => {
  return promisedRequest({
    url: MASTODON_UNBOOKMARK_STATUS_URL(id),
    headers: authHeaders(credentials),
    method: 'POST'
  })
}

const postStatus = ({
  credentials,
  status,
  spoilerText,
  visibility,
  sensitive,
  poll,
  mediaIds = [],
  inReplyToStatusId,
  contentType,
  preview,
  idempotencyKey
}) => {
  const form = new FormData()
  const pollOptions = poll.options || []

  form.append('status', status)
  form.append('source', 'Pleroma FE')
  if (spoilerText) form.append('spoiler_text', spoilerText)
  if (visibility) form.append('visibility', visibility)
  if (sensitive) form.append('sensitive', sensitive)
  if (contentType) form.append('content_type', contentType)
  mediaIds.forEach(val => {
    form.append('media_ids[]', val)
  })
  if (pollOptions.some(option => option !== '')) {
    const normalizedPoll = {
      expires_in: poll.expiresIn,
      multiple: poll.multiple
    }
    Object.keys(normalizedPoll).forEach(key => {
      form.append(`poll[${key}]`, normalizedPoll[key])
    })

    pollOptions.forEach(option => {
      form.append('poll[options][]', option)
    })
  }
  if (inReplyToStatusId) {
    form.append('in_reply_to_id', inReplyToStatusId)
  }
  if (preview) {
    form.append('preview', 'true')
  }

  let postHeaders = authHeaders(credentials)
  if (idempotencyKey) {
    postHeaders['idempotency-key'] = idempotencyKey
  }

  return fetch(MASTODON_POST_STATUS_URL, {
    body: form,
    method: 'POST',
    headers: postHeaders
  })
    .then((response) => {
      return response.json()
    })
    .then((data) => data.error ? data : parseStatus(data))
}

const deleteStatus = ({ id, credentials }) => {
  return fetch(MASTODON_DELETE_URL(id), {
    headers: authHeaders(credentials),
    method: 'DELETE'
  })
}

const uploadMedia = ({ formData, credentials }) => {
  return fetch(MASTODON_MEDIA_UPLOAD_URL, {
    body: formData,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((data) => data.json())
    .then((data) => parseAttachment(data))
}

const setMediaDescription = ({ id, description, credentials }) => {
  return promisedRequest({
    url: `${MASTODON_MEDIA_UPLOAD_URL}/${id}`,
    method: 'PUT',
    headers: authHeaders(credentials),
    payload: {
      description
    }
  }).then((data) => parseAttachment(data))
}

const importMutes = ({ file, credentials }) => {
  const formData = new FormData()
  formData.append('list', file)
  return fetch(MUTES_IMPORT_URL, {
    body: formData,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.ok)
}

const importBlocks = ({ file, credentials }) => {
  const formData = new FormData()
  formData.append('list', file)
  return fetch(BLOCKS_IMPORT_URL, {
    body: formData,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.ok)
}

const importFollows = ({ file, credentials }) => {
  const formData = new FormData()
  formData.append('list', file)
  return fetch(FOLLOW_IMPORT_URL, {
    body: formData,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.ok)
}

const deleteAccount = ({ credentials, password }) => {
  const form = new FormData()

  form.append('password', password)

  return fetch(DELETE_ACCOUNT_URL, {
    body: form,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.json())
}

const changeEmail = ({ credentials, email, password }) => {
  const form = new FormData()

  form.append('email', email)
  form.append('password', password)

  return fetch(CHANGE_EMAIL_URL, {
    body: form,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.json())
}

const changePassword = ({ credentials, password, newPassword, newPasswordConfirmation }) => {
  const form = new FormData()

  form.append('password', password)
  form.append('new_password', newPassword)
  form.append('new_password_confirmation', newPasswordConfirmation)

  return fetch(CHANGE_PASSWORD_URL, {
    body: form,
    method: 'POST',
    headers: authHeaders(credentials)
  })
    .then((response) => response.json())
}

const settingsMFA = ({ credentials }) => {
  return fetch(MFA_SETTINGS_URL, {
    headers: authHeaders(credentials),
    method: 'GET'
  }).then((data) => data.json())
}

const mfaDisableOTP = ({ credentials, password }) => {
  const form = new FormData()

  form.append('password', password)

  return fetch(MFA_DISABLE_OTP_URL, {
    body: form,
    method: 'DELETE',
    headers: authHeaders(credentials)
  })
    .then((response) => response.json())
}

const mfaConfirmOTP = ({ credentials, password, token }) => {
  const form = new FormData()

  form.append('password', password)
  form.append('code', token)

  return fetch(MFA_CONFIRM_OTP_URL, {
    body: form,
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}
const mfaSetupOTP = ({ credentials }) => {
  return fetch(MFA_SETUP_OTP_URL, {
    headers: authHeaders(credentials),
    method: 'GET'
  }).then((data) => data.json())
}
const generateMfaBackupCodes = ({ credentials }) => {
  return fetch(MFA_BACKUP_CODES_URL, {
    headers: authHeaders(credentials),
    method: 'GET'
  }).then((data) => data.json())
}

const fetchMutes = ({ credentials }) => {
  return promisedRequest({ url: MASTODON_USER_MUTES_URL, credentials })
    .then((users) => users.map(parseUser))
}

const muteUser = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_MUTE_USER_URL(id), credentials, method: 'POST' })
}

const unmuteUser = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_UNMUTE_USER_URL(id), credentials, method: 'POST' })
}

const subscribeUser = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_SUBSCRIBE_USER(id), credentials, method: 'POST' })
}

const unsubscribeUser = ({ id, credentials }) => {
  return promisedRequest({ url: MASTODON_UNSUBSCRIBE_USER(id), credentials, method: 'POST' })
}

const fetchBlocks = ({ credentials }) => {
  return promisedRequest({ url: MASTODON_USER_BLOCKS_URL, credentials })
    .then((users) => users.map(parseUser))
}

const fetchOAuthTokens = ({ credentials }) => {
  const url = '/api/oauth_tokens.json'

  return fetch(url, {
    headers: authHeaders(credentials)
  }).then((data) => {
    if (data.ok) {
      return data.json()
    }
    throw new Error('Error fetching auth tokens', data)
  })
}

const revokeOAuthToken = ({ id, credentials }) => {
  const url = `/api/oauth_tokens/${id}`

  return fetch(url, {
    headers: authHeaders(credentials),
    method: 'DELETE'
  })
}

const suggestions = ({ credentials }) => {
  return fetch(SUGGESTIONS_URL, {
    headers: authHeaders(credentials)
  }).then((data) => data.json())
}

const markNotificationsAsSeen = ({ id, credentials, single = false }) => {
  const body = new FormData()

  if (single) {
    body.append('id', id)
  } else {
    body.append('max_id', id)
  }

  return fetch(NOTIFICATION_READ_URL, {
    body,
    headers: authHeaders(credentials),
    method: 'POST'
  }).then((data) => data.json())
}

const vote = ({ pollId, choices, credentials }) => {
  const form = new FormData()
  form.append('choices', choices)

  return promisedRequest({
    url: MASTODON_VOTE_URL(encodeURIComponent(pollId)),
    method: 'POST',
    credentials,
    payload: {
      choices: choices
    }
  })
}

const fetchPoll = ({ pollId, credentials }) => {
  return promisedRequest(
    {
      url: MASTODON_POLL_URL(encodeURIComponent(pollId)),
      method: 'GET',
      credentials
    }
  )
}

const fetchFavoritedByUsers = ({ id, credentials }) => {
  return promisedRequest({
    url: MASTODON_STATUS_FAVORITEDBY_URL(id),
    method: 'GET',
    credentials
  }).then((users) => users.map(parseUser))
}

const fetchRebloggedByUsers = ({ id, credentials }) => {
  return promisedRequest({
    url: MASTODON_STATUS_REBLOGGEDBY_URL(id),
    method: 'GET',
    credentials
  }).then((users) => users.map(parseUser))
}

const fetchEmojiReactions = ({ id, credentials }) => {
  return promisedRequest({ url: PLEROMA_EMOJI_REACTIONS_URL(id), credentials })
    .then((reactions) => reactions.map(r => {
      r.accounts = r.accounts.map(parseUser)
      return r
    }))
}

const reactWithEmoji = ({ id, emoji, credentials }) => {
  return promisedRequest({
    url: PLEROMA_EMOJI_REACT_URL(id, emoji),
    method: 'PUT',
    credentials
  }).then(parseStatus)
}

const unreactWithEmoji = ({ id, emoji, credentials }) => {
  return promisedRequest({
    url: PLEROMA_EMOJI_UNREACT_URL(id, emoji),
    method: 'DELETE',
    credentials
  }).then(parseStatus)
}

const reportUser = ({ credentials, userId, statusIds, comment, forward }) => {
  return promisedRequest({
    url: MASTODON_REPORT_USER_URL,
    method: 'POST',
    payload: {
      'account_id': userId,
      'status_ids': statusIds,
      comment,
      forward
    },
    credentials
  })
}

const searchUsers = ({ credentials, query }) => {
  return promisedRequest({
    url: MASTODON_USER_SEARCH_URL,
    params: {
      q: query,
      resolve: true
    },
    credentials
  })
    .then((data) => data.map(parseUser))
}

const search2 = ({ credentials, q, resolve, limit, offset, following }) => {
  let url = MASTODON_SEARCH_2
  let params = []

  if (q) {
    params.push(['q', encodeURIComponent(q)])
  }

  if (resolve) {
    params.push(['resolve', resolve])
  }

  if (limit) {
    params.push(['limit', limit])
  }

  if (offset) {
    params.push(['offset', offset])
  }

  if (following) {
    params.push(['following', true])
  }

  params.push(['with_relationships', true])

  let queryString = map(params, (param) => `${param[0]}=${param[1]}`).join('&')
  url += `?${queryString}`

  return fetch(url, { headers: authHeaders(credentials) })
    .then((data) => {
      if (data.ok) {
        return data
      }
      throw new Error('Error fetching search result', data)
    })
    .then((data) => { return data.json() })
    .then((data) => {
      data.accounts = data.accounts.slice(0, limit).map(u => parseUser(u))
      data.statuses = data.statuses.slice(0, limit).map(s => parseStatus(s))
      return data
    })
}

const fetchKnownDomains = ({ credentials }) => {
  return promisedRequest({ url: MASTODON_KNOWN_DOMAIN_LIST_URL, credentials })
}

const fetchDomainMutes = ({ credentials }) => {
  return promisedRequest({ url: MASTODON_DOMAIN_BLOCKS_URL, credentials })
}

const muteDomain = ({ domain, credentials }) => {
  return promisedRequest({
    url: MASTODON_DOMAIN_BLOCKS_URL,
    method: 'POST',
    payload: { domain },
    credentials
  })
}

const unmuteDomain = ({ domain, credentials }) => {
  return promisedRequest({
    url: MASTODON_DOMAIN_BLOCKS_URL,
    method: 'DELETE',
    payload: { domain },
    credentials
  })
}

const dismissNotification = ({ credentials, id }) => {
  return promisedRequest({
    url: MASTODON_DISMISS_NOTIFICATION_URL(id),
    method: 'POST',
    payload: { id },
    credentials
  })
}

export const getMastodonSocketURI = ({ credentials, stream, args = {} }) => {
  return Object.entries({
    ...(credentials
      ? { access_token: credentials }
      : {}
    ),
    stream,
    ...args
  }).reduce((acc, [key, val]) => {
    return acc + `${key}=${val}&`
  }, MASTODON_STREAMING + '?')
}

const MASTODON_STREAMING_EVENTS = new Set([
  'update',
  'notification',
  'delete',
  'filters_changed'
])

const PLEROMA_STREAMING_EVENTS = new Set([
  'pleroma:chat_update'
])

// A thin wrapper around WebSocket API that allows adding a pre-processor to it
// Uses EventTarget and a CustomEvent to proxy events
export const ProcessedWS = ({
  url,
  preprocessor = handleMastoWS,
  id = 'Unknown'
}) => {
  const eventTarget = new EventTarget()
  const socket = new WebSocket(url)
  if (!socket) throw new Error(`Failed to create socket ${id}`)
  const proxy = (original, eventName, processor = a => a) => {
    original.addEventListener(eventName, (eventData) => {
      eventTarget.dispatchEvent(new CustomEvent(
        eventName,
        { detail: processor(eventData) }
      ))
    })
  }
  socket.addEventListener('open', (wsEvent) => {
    console.debug(`[WS][${id}] Socket connected`, wsEvent)
  })
  socket.addEventListener('error', (wsEvent) => {
    console.debug(`[WS][${id}] Socket errored`, wsEvent)
  })
  socket.addEventListener('close', (wsEvent) => {
    console.debug(
      `[WS][${id}] Socket disconnected with code ${wsEvent.code}`,
      wsEvent
    )
  })
  // Commented code reason: very spammy, uncomment to enable message debug logging
  /*
  socket.addEventListener('message', (wsEvent) => {
    console.debug(
      `[WS][${id}] Message received`,
      wsEvent
    )
  })
  /**/

  proxy(socket, 'open')
  proxy(socket, 'close')
  proxy(socket, 'message', preprocessor)
  proxy(socket, 'error')

  // 1000 = Normal Closure
  eventTarget.close = () => { socket.close(1000, 'Shutting down socket') }

  return eventTarget
}

export const handleMastoWS = (wsEvent) => {
  const { data } = wsEvent
  if (!data) return
  const parsedEvent = JSON.parse(data)
  const { event, payload } = parsedEvent
  if (MASTODON_STREAMING_EVENTS.has(event) || PLEROMA_STREAMING_EVENTS.has(event)) {
    // MastoBE and PleromaBE both send payload for delete as a PLAIN string
    if (event === 'delete') {
      return { event, id: payload }
    }
    const data = payload ? JSON.parse(payload) : null
    if (event === 'update') {
      return { event, status: parseStatus(data) }
    } else if (event === 'notification') {
      return { event, notification: parseNotification(data) }
    } else if (event === 'pleroma:chat_update') {
      return { event, chatUpdate: parseChat(data) }
    }
  } else {
    console.warn('Unknown event', wsEvent)
    return null
  }
}

export const WSConnectionStatus = Object.freeze({
  'JOINED': 1,
  'CLOSED': 2,
  'ERROR': 3
})

const chats = ({ credentials }) => {
  return fetch(PLEROMA_CHATS_URL, { headers: authHeaders(credentials) })
    .then((data) => data.json())
    .then((data) => {
      return { chats: data.map(parseChat).filter(c => c) }
    })
}

const getOrCreateChat = ({ accountId, credentials }) => {
  return promisedRequest({
    url: PLEROMA_CHAT_URL(accountId),
    method: 'POST',
    credentials
  })
}

const chatMessages = ({ id, credentials, maxId, sinceId, limit = 20 }) => {
  let url = PLEROMA_CHAT_MESSAGES_URL(id)
  const args = [
    maxId && `max_id=${maxId}`,
    sinceId && `since_id=${sinceId}`,
    limit && `limit=${limit}`
  ].filter(_ => _).join('&')

  url = url + (args ? '?' + args : '')

  return promisedRequest({
    url,
    method: 'GET',
    credentials
  })
}

const sendChatMessage = ({ id, content, mediaId = null, idempotencyKey, credentials }) => {
  const payload = {
    'content': content
  }

  if (mediaId) {
    payload['media_id'] = mediaId
  }

  const headers = {}

  if (idempotencyKey) {
    headers['idempotency-key'] = idempotencyKey
  }

  return promisedRequest({
    url: PLEROMA_CHAT_MESSAGES_URL(id),
    method: 'POST',
    payload: payload,
    credentials,
    headers
  })
}

const readChat = ({ id, lastReadId, credentials }) => {
  return promisedRequest({
    url: PLEROMA_CHAT_READ_URL(id),
    method: 'POST',
    payload: {
      'last_read_id': lastReadId
    },
    credentials
  })
}

const deleteChatMessage = ({ chatId, messageId, credentials }) => {
  return promisedRequest({
    url: PLEROMA_DELETE_CHAT_MESSAGE_URL(chatId, messageId),
    method: 'DELETE',
    credentials
  })
}

const setReportState = ({ id, state, credentials }) => {
  return promisedRequest({
    url: PLEROMA_ADMIN_REPORTS,
    method: 'PATCH',
    payload: {
      'reports': [
        {
          id,
          state
        }
      ]
    }
  })
}

const apiService = {
  verifyCredentials,
  fetchTimeline,
  fetchPinnedStatuses,
  fetchConversation,
  fetchStatus,
  fetchFriends,
  exportFriends,
  fetchFollowers,
  followUser,
  unfollowUser,
  pinOwnStatus,
  unpinOwnStatus,
  muteConversation,
  unmuteConversation,
  blockUser,
  unblockUser,
  fetchUser,
  fetchUserRelationship,
  favorite,
  unfavorite,
  retweet,
  unretweet,
  bookmarkStatus,
  unbookmarkStatus,
  postStatus,
  deleteStatus,
  uploadMedia,
  setMediaDescription,
  fetchMutes,
  muteUser,
  unmuteUser,
  subscribeUser,
  unsubscribeUser,
  fetchBlocks,
  fetchOAuthTokens,
  revokeOAuthToken,
  tagUser,
  untagUser,
  deleteUser,
  addRight,
  deleteRight,
  activateUser,
  deactivateUser,
  register,
  getCaptcha,
  updateProfileImages,
  updateProfile,
  importMutes,
  importBlocks,
  importFollows,
  deleteAccount,
  changeEmail,
  changePassword,
  settingsMFA,
  mfaDisableOTP,
  generateMfaBackupCodes,
  mfaSetupOTP,
  mfaConfirmOTP,
  fetchFollowRequests,
  approveUser,
  denyUser,
  suggestions,
  markNotificationsAsSeen,
  dismissNotification,
  vote,
  fetchPoll,
  fetchFavoritedByUsers,
  fetchRebloggedByUsers,
  fetchEmojiReactions,
  reactWithEmoji,
  unreactWithEmoji,
  reportUser,
  updateNotificationSettings,
  search2,
  searchUsers,
  fetchKnownDomains,
  fetchDomainMutes,
  muteDomain,
  unmuteDomain,
  chats,
  getOrCreateChat,
  chatMessages,
  sendChatMessage,
  readChat,
  deleteChatMessage,
  setReportState
}

export default apiService
