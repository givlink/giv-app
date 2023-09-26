import Dexie from 'dexie'

export const db = new Dexie('giv-indexeddb')

db.version(2).stores({
  messages: 'id, chatGroupId',
  chatGroups: 'id, hasUnread',
  lastFetchedMessagesAt: 'groupId', //last message fetched timestamp
})

