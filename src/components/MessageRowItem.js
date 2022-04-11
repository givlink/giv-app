import React from 'react'
import utils from 'lib/utils'
import { useTranslation } from 'react-i18next'
import SafeImage from 'components/SafeImage'
import MessageImageView from 'components/MessageImageView'
import { Link } from '@reach/router'
import Linkify from 'react-linkify'

const MessageRowItem = ({ message, prevMessage, group, user }, ref) => {
  const { t } = useTranslation()
  //@Todo show name instead of id

  const isSenderCurrent = message?.senderId === user.id
  const isModerator = utils.checkModerators(
    message?.senderId,
    group?.moderators,
  )

  if (message?.content === '' && !message.attachments) {
    return null
  }

  let showName = !isSenderCurrent
  //We decided to always show the name and there will
  //always be at least 3 people in chat (2 members + 1 mod) so show it to
  //be less confusing.
  // if (group) {
  //   if (Object.keys(group?.members).length > 2 || isModerator) {
  //     if (!isSenderCurrent) {
  //       showName = true
  //     }
  //   }
  //
  // }

  const isSameSender = prevMessage?.senderId === message?.senderId
  const senderName = utils.snipText(message?.sender?.name, 20)
  let content = message?.content
  return (
    <>
      {content && (
        <div
          className={`w-2/3 mb-2 rounded-lg ${
            isSenderCurrent
              ? 'chat-mine relative ml-auto bg-giv-blue-dark text-white'
              : 'mr-auto bg-gray-100 text-gray-800'
          }`}
        >
          <div className='-mb-2 pl-2.5 pt-2'>
            {showName && (
              <Link
                to={`/users/${message?.senderId}`}
                className='flex items-center space-x-1'
              >
                <SafeImage
                  className='h-5 w-5 rounded-full'
                  classNameFallback='hidden'
                  src={utils.parseUrl(message?.sender?.photoURL)}
                />
                <span className='block font-bold text-xs underline'>
                  {utils.snipText(message?.sender?.name, 20)}
                </span>
              </Link>
            )}
            {isModerator && !isSenderCurrent && (
              <span className='border bg-indigo-50 border-indigo-400 text-indigo-700 font-medium text-xs px-1 rounded-full inline-block'>
                {t('Moderator')}
              </span>
            )}
          </div>
          <div className='pt-3 pb-2 px-2.5 mx-1'>
            <p className='whitespace-pre-wrap text-sm font-medium'>
              <Linkify
                componentDecorator={(decoratedHref, decoratedText, key) => (
                  <a
                    target='_blank'
                    rel='noreferrer'
                    href={decoratedHref}
                    key={key}
                    className={`${
                      isSenderCurrent ? 'text-white' : 'text-giv-blue-dark'
                    } underline`}
                  >
                    {decoratedText}
                  </a>
                )}
              >
                {content}
              </Linkify>
            </p>
            <span
              className={`-mt-1 block text-right text-xs ${
                isSenderCurrent ? 'text-gray-200' : 'text-gray-400'
              } leading-none'`}
            >
              {utils.parseSmartDate(message?.createdAt)}
            </span>
          </div>
        </div>
      )}
      <div className={`flex flex-col ${isSenderCurrent ? 'items-end' : ''}`}>
        {!isSameSender && !isSenderCurrent && message?.attachments.length > 0 && (
          <span
            style={{ maxWidth: '280px' }}
            className='text-gray-400 pl-2.5 text-xs'
          >
            {senderName}さんからファイルをもらいました。
          </span>
        )}
        <div className={`flex ${isSenderCurrent ? 'justify-end' : ''}`}>
          {message?.attachments?.length > 0 && (
            <div
              className={`flex ${
                isSenderCurrent ? 'justify-end' : 'justify-start'
              } flex-col items-end space-y-1 pt-1 pb-2 px-2.5 bg-gray-50`}
            >
              {(message?.attachments).map((m, idx) => (
                <MessageImageView key={idx} src={m} />
              ))}
            </div>
          )}
        </div>
        <span ref={ref} />
      </div>
    </>
  )
}

export default React.forwardRef(MessageRowItem)
