import React from 'react'
import { useTranslation } from 'react-i18next'
import { CameraIcon, XMarkIcon, ArrowUturnLeftIcon } from '@heroicons/react/24/outline'
import api from 'lib/api'
import utils from 'lib/utils'
import { db } from 'lib/localdb'
import { useLiveQuery } from 'dexie-react-hooks'
import { useDispatch, useSelector } from 'react-redux'

export default function FooterChatDetail({ groupId }) {
  const dispatch = useDispatch()
  const ref = React.useRef()
  const { t } = useTranslation()
  const [msg, setMsg] = React.useState('')
  const [images, setImages] = React.useState(null)
  const state = useSelector(s => ({
    currUser: s.user,
    inReplyTo: s.inReplyTo,
  }))
  const { currUser, inReplyTo } = state

  const inReplyMsg = useLiveQuery(async () => {
    if (!inReplyTo) return null
    return await db.messages.where({ id: inReplyTo }).first()
  }, [state])

  const [sending, setSending] = React.useState(false)
  const sendMessage = async () => {
    if (!groupId) return //@Todo err
    setSending(true)
    try {
      const resp = await api.sendMessage(groupId, msg, images, inReplyMsg?.id)
      const { id: lastMsgId, attachments, msgData } = resp
      setMsg('')
      setImages(null)
      await db.messages.put({
        content: msg,
        attachments,
        id: lastMsgId,
        groupId,
        senderId: currUser?.id,
        inReplyTo: inReplyMsg?.id,
        ...msgData,
      })
      dispatch({ type: 'chat/set-in-reply-to', id: null })
      setSending(false)
      ref.current.focus()
    } catch (err) {
      //@Todo err hadnling
      setSending(false)
    }
  }

  const onImagesSelected = e => {
    console.log(e.target.files)
    setImages(Array.from(e.target.files))
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
  const deleteImage = idx => {
    const newImages = images.filter((_, i) => idx !== i)
    setImages(newImages)
  }

  const handleChange = e => {
    adjustHeight(e)
    setMsg(e.target.value)
  }
  return (
    <footer className='bg-white z-10 pl-1.5 py-1.5 border-t border-gray-100'>
      {images && (
        <div className='grid grid-cols-2 gap-3 pl-2 pr-4 py-2'>
          {images.map((i, idx) => {
            return (
              <div key={idx} className='relative'>
                <button
                  onClick={() => deleteImage(idx)}
                  className='animate-jiggle absolute z-10 top-0 right-0 -mr-2.5 -mt-3 p-1.5 bg-red-500 rounded-full text-red-100 shadow'
                >
                  <XMarkIcon className='h-4 w-4' />
                </button>

                <img
                  className='object-cover rounded-md h-full w-full'
                  style={{ maxHeight: '200px' }}
                  src={URL.createObjectURL(i)}
                  alt=''
                />
              </div>
            )
          })}
        </div>
      )}
      {inReplyTo && inReplyMsg && (
        <div className='-ml-1.5 bg-giv-blue py-2 px-3 flex gap-2 items-center justify-between'>
          <div className='flex-1'>
            <div className='text-xs flex items-center gap-2 text-gray-100'>
              <ArrowUturnLeftIcon className='w-4 h-4' />
              {utils.snipText(inReplyMsg.sender?.name, 30)}
            </div>
            <p className='text-xs text-white'>
              {utils.snipText(inReplyMsg.content, 100)}
            </p>
          </div>
          <div className='flex-shrink-0'>
            <button
              onClick={() =>
                dispatch({ type: 'chat/set-in-reply-to', id: null })
              }
              className='bg-white rounded-full p-1'
            >
              <XMarkIcon className='w-4 h-4' />
            </button>
          </div>
        </div>
      )}
      <div className='flex items-center'>
        <label>
          <input
            multiple
            onChange={onImagesSelected}
            type='file'
            className='hidden'
            accept='image/*'
          />
          <CameraIcon className='h-7 w-7 ml-1 mr-3' />
        </label>
        <textarea
          ref={ref}
          disabled={sending}
          placeholder={t('Message')}
          rows='1'
          value={msg}
          onKeyDown={checkSend}
          onChange={handleChange}
          style={{ maxHeight: '200px' }}
          className='rounded-md whitespace-pre resize-none overflow-y-auto border border-gray-200 w-full bg-gray-100 pl-3 pr-1 py-2 text-base'
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
      </div>
    </footer>
  )
}
