import React from 'react'
import { useTranslation } from 'react-i18next'
import api from 'lib/api'
import { useDispatch, useSelector } from 'react-redux'
export default function FooterChatDetail({ groupId }) {
  const dispatch = useDispatch()
  const ref = React.useRef()
  const { t } = useTranslation()
  const [msg, setMsg] = React.useState('')
  const currUser = useSelector(s => s.user)
  const [sending, setSending] = React.useState(false)
  const sendMessage = async () => {
    if (!groupId) return //@Todo err
    setSending(true)
    try {
      const lastMsgId = await api.sendMessage(groupId, msg)
      localStorage.setItem(`lastRead-${groupId}`, lastMsgId)
      setMsg('')
      dispatch({
        type: 'chat_messages/data',
        message: {
          content: msg,
          id: lastMsgId,
          groupId,
          senderId: currUser.id,
        },
      })
      setSending(false)
      ref.current.focus()
    } catch (err) {
      //@Todo err hadnling
      setSending(false)
    }
  }

  const adjustHeight = e => {
    let area = e.target
    area.style.height = 'auto'
    area.style.height = area.scrollHeight + 'px'
  }

  const checkSend = e => {
    if (e.ctrlKey && e.key === 'Enter') {
      sendMessage()
      setTimeout(() => adjustHeight(e), 300)
    }
  }
  const handleChange = e => {
    adjustHeight(e)
    setMsg(e.target.value)
  }
  return (
    <footer className='bg-white z-10 pl-1.5 py-1.5 flex items-center border-t border-gray-100'>
      <textarea
        ref={ref}
        disabled={sending}
        placeholder={t('Message')}
        rows='1'
        value={msg}
        onKeyDown={checkSend}
        onChange={handleChange}
        style={{ maxHeight: '200px' }}
        className='rounded-md whitespace-pre resize-none verflow-hidden border border-gray-200 w-full bg-gray-100 pl-3 pr-1 py-2 text-base'
      />
      <button disabled={sending} className='pr-1' onClick={sendMessage}>
        <svg
          xmlns='http://www.w3.org/2000/svg'
          className='h-12 w-12 text-giv-blue'
          viewBox='0 0 20 20'
          fill='currentColor'
        >
          <path
            fillRule='evenodd'
            d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z'
            clipRule='evenodd'
          />
        </svg>
      </button>
    </footer>
  )
}
