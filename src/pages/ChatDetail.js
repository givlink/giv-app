import Header from 'components/HeaderChatDetail'
import Footer from 'components/FooterChatDetail'
import MessageRowItem from 'components/MessageRowItem'
import Spinner from 'components/Spinner'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import api from 'lib/api'
import { useTranslation } from 'react-i18next'
const makeGroupName = async (group, authUser) => {
  if (group) {
    if (group.members.length === 2) {
      for (let m of group.members) {
        if (m !== authUser?.uid) {
          const user = await api.getUserProfile(m)
          if (user) {
            return user.name
          }
        }
      }
    }
  }
  return 'Group'
}

export default function ChatDetail({ id, messages = [] }) {
  const [groupName, setGroupName] = React.useState('Group')
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const ref = React.useRef(null)
  const state = useSelector(s => ({
    chatMessagesLoading: s.chatMessagesLoading,
    messages: s.chatMessages[id],
    group: s.chatGroups[id],
    authUser: s.authUser,
  }))

  //@Todo scroll to last unread
  React.useEffect(() => {
    ref.current?.scrollIntoView()
  }, [ref, state.messages])

  React.useEffect(() => {
    if (!id) return

    let listener
    //Setup listener
    const run = async () => {
      //@Todo err handling
      dispatch({ type: 'chat_messages/loading' })
      listener = api.watchChatMessages(id, messages => {
        dispatch({ type: 'chat_messages/data', chatGroupId: id, messages })
      })
    }
    run()
    return () => listener && listener()
  }, [dispatch, id])

  React.useEffect(() => {
    const run = async () => {
      makeGroupName(state.group, state.authUser).then(n => setGroupName(n))
    }
    run()
  }, [state.group, state.authUser])

  return (
    <div className='h-screen flex flex-col bg-white max-w-2xl md:mx-auto'>
      <Header title={groupName} />
      {state.chatMessagesLoading && <Spinner className='pt-2' />}
      <ul
        id='chats'
        className='bg-gray-50 md:max-w-lg md:mx-auto overflow-auto pt-4 flex-1 h-full bg-white px-2'
      >
        {state.messages &&
          state.messages.map((m, idx) => (
            <li id={`msg-${m.id}`} key={m.id}>
              <MessageRowItem group={state.group} message={m} authUser={state.authUser}/>
            </li>
          ))}

        {state.messages?.length === 0 && (
          <span className='text-xs h-full flex justify-center items-end'>
            {t('Start chatting')}...
          </span>
        )}

        <div ref={ref} />
      </ul>
      <Footer groupId={id} />
    </div>
  )
}
