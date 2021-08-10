import HeaderChatList from 'components/HeaderChatList'
import React from 'react'
import { useSelector } from 'react-redux'
import PostListCard from 'components/PostListCard'
import ChatGroupCard from 'components/ChatGroupCard'
import Spinner from 'components/Spinner'
import { useTranslation } from 'react-i18next'
import usePreserveScroll from 'hooks/scroll'

const ChatComingSoon = () => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col items-center justify-center pt-20'>
      <img
        className='w-24 h-24 animate-wobble-slow opacity-50'
        src='/icons/tama_def_sleepy.png'
        alt=''
      />
      <span className='text-sm text-gray-500 pt-2'>
        {t('Chats Coming Soon')}
      </span>
    </div>
  )
}

export default function ChatList() {
  const state = useSelector(s => ({
    authUser: s.authUser,
    chats: s.chats,
    chatGroups: s.chatGroups,
    requestsPendingCount: s.requestsPendingCount,
    chatsUnreadCount: s.chatsUnreadCount,
    loading: s.chatsLoading,
  }))
  usePreserveScroll('chatList')

  return (
    <div className='pb-20 overflow-hidden'>
      <HeaderChatList
        active='chats'
        chatsCount={state.chatsUnreadCount}
        requestsCount={state.requestsPendingCount}
      />
      {state.loading && <Spinner className='pt-2' />}

      <ul className='space-y-2 overflow-auto md:max-w-2xl md:mx-auto'>
        {Object.values(state.chatGroups).map(p => {
          return (
            <li key={p.id}>
              <ChatGroupCard authUser={state.authUser} group={p} />
            </li>
          )
        })}
      </ul>
    </div>
  )
}
