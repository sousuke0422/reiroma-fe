import { filter, sortBy, includes } from 'lodash'

export const notificationsFromStore = store => store.state.statuses.notifications.data

export const visibleTypes = state => ([
  state.config.notificationVisibility.likes && 'favourite',
  state.config.notificationVisibility.mentions && 'mention',
  state.config.notificationVisibility.repeats && 'reblog',
  state.config.notificationVisibility.follows && 'follow',
  state.config.notificationVisibility.followRequest && 'follow_request',
  state.config.notificationVisibility.moves && 'move',
  state.config.notificationVisibility.emojiReactions && 'pleroma:emoji_reaction'
].filter(_ => _))

const statusNotifications = ['favourite', 'mention', 'reblog', 'pleroma:emoji_reaction']

export const isStatusNotification = (type) => includes(statusNotifications, type)

const sortById = (a, b) => {
  const seqA = Number(a.id)
  const seqB = Number(b.id)
  const isSeqA = !Number.isNaN(seqA)
  const isSeqB = !Number.isNaN(seqB)
  if (isSeqA && isSeqB) {
    return seqA > seqB ? -1 : 1
  } else if (isSeqA && !isSeqB) {
    return 1
  } else if (!isSeqA && isSeqB) {
    return -1
  } else {
    return a.id > b.id ? -1 : 1
  }
}

export const filteredNotificationsFromStore = (store, types) => {
  // map is just to clone the array since sort mutates it and it causes some issues
  let sortedNotifications = notificationsFromStore(store).map(_ => _).sort(sortById)
  sortedNotifications = sortBy(sortedNotifications, 'seen')
  return sortedNotifications.filter(
    (notification) => (types || visibleTypes(store.state)).includes(notification.redux.type)
  )
}

export const unseenNotificationsFromStore = store =>
  filter(filteredNotificationsFromStore(store), ({ seen }) => !seen)

export const prepareNotificationObject = (notification, i18n) => {
  const notifObj = {
    tag: notification.redux.id
  }
  const status = notification.redux.status
  const title = notification.redux.account.name
  notifObj.title = title
  notifObj.icon = notification.redux.account.profile_image_url
  let i18nString
  switch (notification.redux.type) {
    case 'favourite':
      i18nString = 'favorited_you'
      break
    case 'reblog':
      i18nString = 'repeated_you'
      break
    case 'follow':
      i18nString = 'followed_you'
      break
    case 'move':
      i18nString = 'migrated_to'
      break
    case 'follow_request':
      i18nString = 'follow_request'
      break
  }

  if (notification.redux.type === 'pleroma:emoji_reaction') {
    notifObj.body = i18n.t('notifications.reacted_with', [notification.redux.emoji])
  } else if (i18nString) {
    notifObj.body = i18n.t('notifications.' + i18nString)
  } else if (isStatusNotification(notification.redux.type)) {
    notifObj.body = notification.redux.status.text
  }

  // Shows first attached non-nsfw image, if any. Should add configuration for this somehow...
  if (status && status.attachments && status.attachments.length > 0 && !status.nsfw &&
    status.attachments[0].pleroma.mime_type.startsWith('image/')) {
    notifObj.image = status.attachments[0].url
  }

  return notifObj
}
