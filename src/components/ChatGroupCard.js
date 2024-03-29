import { Link } from '@reach/router'
import utils from 'lib/utils'
import React from 'react'
import { useTranslation } from 'react-i18next'
import SafeImage from 'components/SafeImage'
import api from 'lib/api'

export default function ChatGroupCard({ group, currUser }) {
  const { t } = useTranslation()
  const [groupName, setGroupName] = React.useState('Group')
  const [groupImg, setGroupImg] = React.useState()

  const isModerator = utils.checkModerators(currUser?.id, group?.moderators)

  React.useEffect(() => {
    if(group?.name){
      setGroupName(group?.name)
      return
    }

    const run = async () => {
      const memKeys = Object.keys(group?.members || {})
      if (memKeys.length === 2) {
        for (let m of memKeys) {
          if (m !== currUser?.id) {
            const user = await api.getUserProfile(m)
            if (user) {
              setGroupName(user.name)
              setGroupImg(utils.parseUrl(user.photoURL))
            }
          }
        }
      } else {
        setGroupName(group.name || 'Group')
        setGroupImg('')
      }
    }
    run()
  }, [group, currUser])

  return (
    <Link to={`/chats/${group?.id}`}>
      <div className='pl-2 shadow-sm border-b grid grid-cols-10'>
        <div className='py-2 mx-auto col-span-2'>
          <SafeImage
            src={groupImg}
            fallbackSrc={
              groupImg ? '/icons/tama_def_sleepy.png' : '/icons/tama_def.png'
            }
            className='mx-auto h-16 w-16 rounded-full border-2 border-gray-300 object-cover overflow-hidden'
            classNameFallback='h-12 object-cover opacity-75'
          />
        </div>
        <div className='pt-2 pb-1 pr-2 pl-1 col-span-8'>
          <div className='flex items-center justify-between'>
            <h2 className='text-sm font-bold'>
              {utils.snipText(groupName, 30)}
            </h2>
            <div className='flex items-end justify-end'>
              {group?.hasUnread > 0 && (
                <span className='animate-pulse text-xs bg-giv-blue text-white font-bold w-3 h-3 flex items-center justify-center rounded-full shadow-sm'></span>
              )}
            </div>
          </div>
          {isModerator && (
            <div className=''>
              <span className='border border-indigo-400 bg-indigo-50 text-indigo-600 rounded-full px-1 text-xs font-medium'>
                {t('Moderator')}
              </span>
            </div>
          )}
          <div
            className='flex-1 flex flex-col items-between'
            style={{ height: '60px' }}
          >
            <p className='flex-1 text-xs mt-1 col-span-7 overflow-clip overflow-hidden'>
              {utils.snipText(
                group?.lastMessage?.content ?? 'Start Chatting...',
                50,
              )}
            </p>
            <span className='text-xs flex justify-end items-end font-medium'>
              {utils.parseAgo(group?.lastMessage?.createdAt)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
