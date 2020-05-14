import _ from 'lodash'

const empty = (chatId) => {
  return {
    idIndex: {},
    messages: [],
    newMessageCount: 0,
    lastSeenTimestamp: 0,
    chatId: chatId,
    minId: undefined,
    lastMessage: undefined
  }
}

const deleteMessage = (storage, messageId) => {
  if (!storage) { return }
  storage.messages = storage.messages.filter(m => m.id !== messageId)
  delete storage.idIndex[messageId]

  if (storage.lastMessage && (storage.lastMessage.id === messageId)) {
    storage.lastMessage = _.maxBy(storage.messages, 'id')
  }

  if (storage.minId === messageId) {
    storage.minId = _.minBy(storage.messages, 'id')
  }
}

const add = (storage, { messages: newMessages }) => {
  if (!storage) { return }
  for (let i = 0; i < newMessages.length; i++) {
    let message = newMessages[i]

    // sanity check
    if (message.chat_id !== storage.chatId) { return }

    if (!storage.minId || message.id < storage.minId) {
      storage.minId = message.id
    }

    if (!storage.lastMessage || message.id > storage.lastMessage.id) {
      storage.lastMessage = message
    }

    if (!storage.idIndex[message.id]) {
      if (storage.lastSeenTimestamp < message.created_at) {
        storage.newMessageCount++
      }
      storage.messages.push(message)
      storage.idIndex[message.id] = message
    }
  }
}

const resetNewMessageCount = (storage) => {
  if (!storage) { return }
  storage.newMessageCount = 0
  storage.lastSeenTimestamp = new Date()
}

// Inserts date separators and marks the head and tail if it's the sequence of messages made by the same user
const getView = (storage) => {
  if (!storage) { return [] }
  let messages = _.sortBy(storage.messages, 'id')

  let res = []

  let prev = messages[messages.length - 1]
  let currentSequenceId

  let firstMessages = messages[0]

  if (firstMessages) {
    let date = new Date(firstMessages.created_at)
    date.setHours(0, 0, 0, 0)
    res.push({ type: 'date', date: date, id: date.getTime().toString() })
  }

  let afterDate = false

  for (let i = 0; i < messages.length; i++) {
    let message = messages[i]
    let nextMessage = messages[i + 1]

    let date = new Date(message.created_at)
    date.setHours(0, 0, 0, 0)

    // insert date separator and start a new sequence
    if (prev && prev.date < date) {
      res.push({ type: 'date', date: date, id: date.getTime().toString() })
      prev['isTail'] = true
      currentSequenceId = undefined
      afterDate = true
    }

    let object = { type: 'message', data: message, date: date, id: message.id, sequenceId: currentSequenceId }

    // end a message sequence
    if ((nextMessage && nextMessage.account_id) !== message.account_id) {
      object['isTail'] = true
      currentSequenceId = undefined
    }
    // start a new message sequence
    if ((prev && prev.data && prev.data.account_id) !== message.account_id || afterDate) {
      currentSequenceId = _.uniqueId()
      object['isHead'] = true
      object['sequenceId'] = currentSequenceId
    }
    res.push(object)
    prev = object
    afterDate = false
  }

  return res
}

const ChatService = {
  add,
  empty,
  getView,
  deleteMessage,
  resetNewMessageCount
}

export default ChatService
