import utils from 'lib/utils'
import { useTranslation } from 'react-i18next'

export default function MessageRowItem({ message, group, authUser }) {
  const { t } = useTranslation()
  //@Todo show name instead of id

  const isSenderCurrent = message?.senderId === authUser.uid
  const isModerator = utils.checkModerators(message?.senderId, group?.moderators)

  let showName = false
  if (group) {
    if (Object.keys(group?.members).length > 2 || isModerator) {
      if (!isSenderCurrent) {
        showName = true
      }
    }
  }

  return (
    <div
      className={`w-2/3 mb-2 rounded-lg ${
        isSenderCurrent
          ? 'chat-mine relative ml-auto bg-giv-blue-dark text-white'
          : 'mr-auto bg-gray-100 text-gray-800'
      }`}
    >
      <div className='-mb-2 pl-2.5 pt-2'>
        {showName && (
          <span className='block font-bold text-xs underline'>
            {utils.snipText(message?.sender?.name, 20)}
          </span>
        )}
        {isModerator && (
          <span className='border bg-indigo-50 border-indigo-400 text-indigo-700 font-medium text-xs px-1 rounded-full inline-block'>
            {t('Moderator')}
          </span>
        )}
      </div>
      <div className='pt-3 pb-2 px-2.5 mx-1'>
        <p className='whitespace-pre-wrap text-sm font-medium'>
          {message?.content}
        </p>
        <span
          className={`-mt-1 block text-right text-xs ${
            isSenderCurrent ? 'text-gray-200' : 'text-gray-400'
          } leading-none'`}
        >
          12:13
        </span>
      </div>
    </div>
  )
}
