import HeaderChatList from 'components/HeaderChatList'
import React from 'react'
import { useSelector } from 'react-redux'
import ChatGroupCard from 'components/ChatGroupCard'
import usePreserveScroll from 'hooks/scroll'
import { db } from '../lib/localdb'
import { useLiveQuery } from 'dexie-react-hooks'
import api from 'lib/api'

export default function ChatList() {
  const [showButton, setShowButton] = React.useState(true)
  const state = useSelector(s => ({
    currUser: s.user,
    requestsPendingCount: s.requestsPendingCount,
  }))
  usePreserveScroll('chatList')

  const chatGroups = useLiveQuery(async () => {
    const resp = await db.chatGroups.reverse().sortBy('updatedAt')
    return resp || []
  }, [])

  const unreadChatGroupsCount = useLiveQuery(() =>
    db.chatGroups.where('hasUnread').equals(1).count(),
  )

  let sortedChatGroups = chatGroups ? [...chatGroups] : []
  const emptyChats = sortedChatGroups.filter(i => !i.lastMessage)
  const nonEmptyChats = sortedChatGroups.filter(i => i.lastMessage)
  emptyChats.sort((a, b) => (a.createdAt < b.createdAt ? -1 : 1))
  nonEmptyChats.sort((a, b) =>
    a.lastMessage?.createdAt > b.lastMessage?.createdAt ? -1 : 1,
  )
  sortedChatGroups = [...emptyChats, ...nonEmptyChats]

  return (
    <div className='pb-36 overflow-hidden'>
      <HeaderChatList chatsCount={unreadChatGroupsCount} />
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
        <div className='flex items-center justify-center pt-4'>
          {unreadChatGroupsCount > 1 && showButton && (
            <button
              onClick={() => {
                api.markAllAsRead()
                setShowButton(false)
              }}
              className='py-2 px-3 text-sm'
            >
              全て既読済み
            </button>
          )}
        </div>
      </>
    </div>
  )
}
