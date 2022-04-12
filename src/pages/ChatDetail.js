import Header from 'components/HeaderChatDetail'
import Footer from 'components/FooterChatDetail'
import MessageRowItem from 'components/MessageRowItem'
import Spinner from 'components/Spinner'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import api from 'lib/api'
import utils from 'lib/utils'
// import { db } from '../lib/db'
import { useTranslation } from 'react-i18next'
const makeGroupName = async (group, user) => {
  if (group) {
    const memKeys = Object.keys(group?.members || {})
    if (memKeys.length === 2) {
      for (let m of memKeys) {
        if (m !== user?.id) {
          const user = await api.getUserProfile(m)
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
  const dispatch = useDispatch()
  const ref = React.useRef(null)
  const state = useSelector(s => {
    //sort messages just in case
    let messages = s.chatMessages[id] || []
    messages.sort((a, b) => {
      try {
        return a.createdAt < b.createdAt
          ? -1
          : a.createdAt > b.createdAt
          ? 1
          : 0
      } catch (err) {}
      return 0
    })
    return {
      chatMessagesLoading: s.chatMessagesLoading,
      messages,
      group: s.chatGroups[id] || null,
      user: s.user || {},
    }
  })

  const isModerator = utils.checkModerators(
    state.user.id,
    state.group?.moderators,
  )
  React.useEffect(() => {
    setTimeout(() => {
      ref.current?.scrollIntoView()
    }, 500)
  }, [state.messages?.length, id])

  React.useEffect(() => {
    //Update last read item
    if (state.messages && state.messages.length) {
      const lastItem = state.messages[state.messages.length - 1]
      console.log('lastRead:', lastItem.id)
      localStorage.setItem(`lastRead-${id}`, lastItem.id)
    }
  }, [state.messages, id])

  React.useEffect(() => {
    if (!id) return

    //@Todo err handling
    // dispatch({ type: 'chat_messages/reset', chatGroupId: id })
    const listener = api.watchChatMessages(id, async messages => {
      // await db.messages.bulkPut(messages)
      dispatch({ type: 'chat_messages/data', chatGroupId: id, messages })
    })
    return listener
  }, [dispatch, id])

  React.useEffect(() => {
    if (!state.group) return
    const run = async () => {
      makeGroupName(state.group, state.user).then(n => setGroupName(n))
    }
    run()
  }, [state.group, state.user])

  return (
    <div className='h-screen flex flex-col bg-white max-w-2xl md:mx-auto'>
      <Header
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
          {state.messages &&
            state.messages.map((m, idx) => (
              <li id={`msg-${m.id}`} key={m.id}>
                <MessageRowItem
                  ref={idx === state.messages.length - 1 ? ref : null}
                  group={state.group}
                  message={m}
                  prevMessage={idx === 0 ? null : state.messages[idx - 1]}
                  user={state.user}
                />
              </li>
            ))}

          {state.messages?.length === 0 && (
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
