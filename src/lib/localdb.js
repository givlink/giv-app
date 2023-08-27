import Dexie from 'dexie'

export const db = new Dexie('giv-indexeddb')

db.version(1).stores({
  messages: 'id, chatGroupId',
  chatGroups: 'id',
  lastFetchedMessagesAt: 'groupId', //last message fetched timestamp
})

