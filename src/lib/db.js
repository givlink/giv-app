import Dexie from 'dexie';

export const db = new Dexie('givLocalDB');

db.version(1).stores({
  messages: '++id, groupId', 
});

