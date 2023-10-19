import HeaderChatList from 'components/HeaderChatList'
import React from 'react'
import { useSelector } from 'react-redux'
import ChatGroupCard from 'components/ChatGroupCard'
import usePreserveScroll from 'hooks/scroll'
import { db } from '../lib/localdb'
import { useTranslation } from 'react-i18next'
import { useLiveQuery } from 'dexie-react-hooks'
import api from 'lib/api'

const Empty = () => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col items-center justify-center pt-20'>
      <img
        className='w-24 h-24 animate-wobble-slow opacity-50'
        src='/icons/tama_def_sleepy.png'
        alt=''
      />
      <span className='text-sm text-gray-500 pt-2'>{t('No Chats Found')}</span>
    </div>
  )
}

const FilterBar = ({ selected, setSelected }) => {
  const { t } = useTranslation()
  const handleChange = e => {
    setSelected(e.target.value)
  }

  return (
    <div className='max-w-2xl mx-auto flex items-center justify-end space-x-0.5 px-3'>
      <select
        name='type'
        value={selected}
        onChange={handleChange}
        className='text-sm border border-gray-200 rounded-md text-xs px-8 py-1'
      >
        <option value='all' className='text-center pr-2'>
          {t('All Items')}
        </option>
        <option value='member' className='text-center pr-2'>
          {t('Member')}
        </option>
        <option value='moderator' className='text-center pr-2'>
          {t('CM')}
        </option>
      </select>
    </div>
  )
}

export default function ChatList() {
  const [showButton, setShowButton] = React.useState(true)
  const [selectedFilter, setSelectedFilter] = React.useState('all')
  const state = useSelector(s => ({ currUser: s.user }))
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
  const hasModeratorRoleChats = !!sortedChatGroups.find(
    i => i.role === 'moderator',
  )
  sortedChatGroups = sortedChatGroups.filter(i => {
    if (selectedFilter === 'all') return true

    return i.role === selectedFilter
  })

  return (
    <div className='pb-36 overflow-hidden'>
      <HeaderChatList chatsCount={unreadChatGroupsCount} />
      {hasModeratorRoleChats && (
        <FilterBar selected={selectedFilter} setSelected={setSelectedFilter} />
      )}
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
        {sortedChatGroups?.length === 0 && <Empty />}
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
