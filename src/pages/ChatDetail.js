import Header from 'components/HeaderChatDetail'
import Footer from 'components/FooterChatDetail'
import MessageRowItem from 'components/MessageRowItem'
import Spinner from 'components/Spinner'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import api from 'lib/api'
import utils from 'lib/utils'
import { useTranslation } from 'react-i18next'
const makeGroupName = async (group, authUser) => {
  if (group) {
    const memKeys = Object.keys(group?.members)
    if (memKeys.length === 2) {
      for (let m of memKeys) {
        if (m !== authUser?.uid) {
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
  const state = useSelector(s => ({
    chatMessagesLoading: s.chatMessagesLoading,
    messages: s.chatMessages[id] || [],
    group: s.chatGroups[id] || null,
    authUser: s.authUser,
  }))

  const isModerator = utils.checkModerators(state.authUser?.uid, state.group?.moderators)
  React.useEffect(() => {
    //@Todo scroll to last unread
    ref.current?.scrollIntoView()
  }, [state.messages.length, id])

  React.useEffect(() => {
    //Update last read item
    if (state.messages && state.messages.length) {
      const lastItem = state.messages[state.messages.length - 1]
      localStorage.setItem(`lastRead-${id}`, lastItem.id)
    }
  }, [state.messages, id])

  React.useEffect(() => {
    if (!id) return

    let listener
    //Setup listener
    const run = async () => {
      //@Todo err handling
      // dispatch({ type: 'chat_messages/loading', chatGroupId: id })
      dispatch({ type: 'chat_messages/reset', chatGroupId: id })
      listener = api.watchChatMessages(id, message => {
        dispatch({ type: 'chat_messages/data', chatGroupId: id, message })
      })
    }
    run()
    return () => listener && listener()
  }, [dispatch, id])

  React.useEffect(() => {
    if (!state.group) return
    const run = async () => {
      makeGroupName(state.group, state.authUser).then(n => setGroupName(n))
    }
    run()
  }, [state.group, state.authUser])

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
              <li
                id={`msg-${m.id}`}
                key={m.id}
                ref={idx === state.messages.length - 1 ? ref : null}
              >
                <MessageRowItem
                  group={state.group}
                  message={m}
                  authUser={state.authUser}
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
