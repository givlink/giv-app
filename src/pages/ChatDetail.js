import Header from 'components/HeaderChatDetail'
import Footer from 'components/FooterChatDetail'
import MessageRowItem from 'components/MessageRowItem'
import Spinner from 'components/Spinner'
import React from 'react'
import { useSelector } from 'react-redux'
import api from 'lib/api'
import utils from 'lib/utils'
import { db } from '../lib/localdb'
import { useLiveQuery } from 'dexie-react-hooks'
import { useTranslation } from 'react-i18next'

const makeGroupName = async (group, user) => {
  if (group) {
    const memKeys = Object.keys(group?.members || {})
    if (memKeys.length === 2) {
      for (let m of memKeys) {
        if (m !== user?.id) {
          const user = await api.getCachedProfile(m)
          if (user) {
            return user.name
          }
        }
      }
    } else {
      return group.name || 'Group'
    }
  }
  return 'Group'
}

export default function ChatDetail({ id }) {
  const [groupName, setGroupName] = React.useState('')
  const { t } = useTranslation()
  const ref = React.useRef(null)

  const group = useLiveQuery(async () => {
    return await db.chatGroups.where('id').equals(parseInt(id)).first()
  })

  const messages = useLiveQuery(async () => {
    const msgsMap = {}
    let msgs = []
    const r = await db.messages
      .where('chatGroupId')
      .equals(parseInt(id))
      .sortBy('createdAt')
    for (const item of r) {
      item.sender = await api.getCachedProfile(item.senderId)
      msgsMap[item.id] = item
      if (item.inReplyTo) {
        item.reply = msgsMap[item.inReplyTo]
      }
      msgs.push(item)
    }
    return msgs
  }, [id])

  const state = useSelector(s => {
    return {
      chatMessagesLoading: s.chatMessagesLoading,
      group: s.chatGroups[id] || null,
      user: s.user || {},
    }
  })

  const isModerator = utils.checkModerators(
    state.user.id,
    state.group?.moderators,
  )
  React.useEffect(() => {
    ref.current?.scrollIntoView()
  }, [messages?.length, id])

  React.useEffect(() => {
    //Update last read item
    if (messages && messages.length) {
      const lastItem = messages[messages.length - 1]
      db.chatGroups.update(parseInt(id), { hasUnread: 0 })
      api.updateReadReceipts(id, lastItem.id)
    }
  }, [messages, id, state?.user])

  React.useEffect(() => api.watchChatMessages(id), [id])

  React.useEffect(() => {
    if (!group) return
    const run = async () => {
      makeGroupName(group, state.user).then(n => setGroupName(n))
    }
    run()
  }, [group, state.user])

  return (
    <div className='h-screen flex flex-col bg-white max-w-2xl md:mx-auto'>
      <Header
        id={id}
        title={groupName}
        subText={() =>
          isModerator && (
            <span className='border border-indigo-400 bg-indigo-50 text-indigo-600 rounded-full px-1 text-xs font-medium'>
              {t('Moderator')}
            </span>
          )
        }
      />
      {state.chatMessagesLoading ? (
        <Spinner className='pt-2 h-full' />
      ) : (
        <ul
          id='chats'
          className='w-full bg-gray-50 md:max-w-2xl md:mx-auto overflow-auto pt-4 flex-1 h-full bg-white px-2'
        >
          {messages &&
            messages.map((m, idx) => (
              <li id={`msg-${m.id}`} key={m.id}>
                <MessageRowItem
                  ref={idx === messages.length - 1 ? ref : null}
                  group={state.group}
                  message={m}
                  prevMessage={idx === 0 ? null : messages[idx - 1]}
                  user={state.user}
                />
              </li>
            ))}

          {messages?.length === 0 && (
            <span className='text-xs h-full flex justify-center items-end'>
              {t('Start chatting')}...
            </span>
          )}
        </ul>
      )}
      <Footer groupId={id} />
    </div>
  )
}
