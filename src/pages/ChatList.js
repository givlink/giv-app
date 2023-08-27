import HeaderChatList from 'components/HeaderChatList'
import React from 'react'
import { useSelector } from 'react-redux'
import ChatGroupCard from 'components/ChatGroupCard'
import usePreserveScroll from 'hooks/scroll'
import { db } from '../lib/localdb'
import { useLiveQuery } from 'dexie-react-hooks'


export default function ChatList() {
  const state = useSelector(s => ({
    currUser: s.user,
    chats: s.chats,
    chatGroups: s.chatGroups,
    requestsPendingCount: s.requestsPendingCount,
    chatsUnreadCount: s.chatsUnreadCount,
  }))
  usePreserveScroll('chatList')

  const chatGroups = useLiveQuery(async () => {
    const resp = await db.chatGroups.reverse().sortBy('updatedAt')
    return resp || []
  }, [])

  let sortedChatGroups = chatGroups ? [...chatGroups] : []
  const emptyChats = sortedChatGroups.filter(i => !i.lastMessage)
  const nonEmptyChats = sortedChatGroups.filter(i => i.lastMessage)
  emptyChats.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
  nonEmptyChats.sort((a, b) =>
    a.lastMessage?.createdAt > b.lastMessage?.createdAt ? -1 : 1,
  )
  sortedChatGroups = [...emptyChats, ...nonEmptyChats]

  return (
    <div className='pb-20 overflow-hidden'>
      <HeaderChatList
        active='chats'
        chatsCount={state.chatsUnreadCount}
        requestsCount={state.requestsPendingCount}
      />
      <>
        <ul className='space-y-2 overflow-auto md:max-w-2xl md:mx-auto'>
          {sortedChatGroups.map(p => {
            return (
              <li key={p.id}>
                <ChatGroupCard currUser={state.currUser} group={p} />
              </li>
            )
          })}
        </ul>
      </>
    </div>
  )
}
