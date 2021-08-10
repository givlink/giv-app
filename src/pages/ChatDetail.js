import Header from 'components/HeaderChatDetail'
import Footer from 'components/FooterChatDetail'
import MessageRowItem from 'components/MessageRowItem'
import Spinner from 'components/Spinner'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import utils from 'lib/utils'
import api from 'lib/api'
import { useTranslation } from 'react-i18next'
import useScrollToBottom from 'hooks/scroll-to-bottom'
const makeGroupName = async (group, authUser) => {
  if (group) {
    const memKeys = Object.keys(group.members)
    if (memKeys.length == 2) {
      for (let m of memKeys) {
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
  const { t, i18n } = useTranslation()
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

  const makeRefParams = idx => {
    const result = {}
    if (idx === state.messages.length - 1) {
      result.ref = ref
    }
    return result
  }

  return (
    <div className='h-screen flex flex-col bg-white max-w-2xl md:mx-auto'>
      <Header title={groupName} />
      {state.chatMessagesLoading && <Spinner className='pt-2' />}
      <ul
        id='chats'
        className='md:max-w-lg md:mx-auto overflow-auto pt-4 mb-1 flex-1 h-full bg-white px-2'
      >
        {state.messages &&
          state.messages.map((m, idx) => (
            <li id={`msg-${m.id}`} key={m.id}>
              <MessageRowItem group={state.group} message={m} />
            </li>
          ))}
        <div ref={ref} />
      </ul>
      <Footer groupId={id} />
    </div>
  )
}
//   methods: {
//     scrollToLastItem(target) {
//       const container = this.$el.querySelector("#chats");
//       if (target) {
//         container.scrollTop = target.offsetTop;
//       } else {
//         container.scrollTop = container.scrollHeight;
//       }
