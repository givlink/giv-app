import { Link } from '@reach/router'
import utils from 'lib/utils'
import React from 'react'
import SafeImage from 'components/SafeImage'
import api from 'lib/api'

export default function ChatGroupCard({ group, authUser }) {
  const [groupName, setGroupName] = React.useState('Group')
  const [groupImg, setGroupImg] = React.useState()

  React.useEffect(() => {
    const run = async () => {
      if (group?.members.length === 2) {
        for (let m of group?.members) {
          if (m !== authUser.uid) {
            const user = await api.getUserProfile(m)
            if (user) {
              setGroupName(user.name)
              setGroupImg(utils.parseUrl(user.photoURL))
            }
          }
        }
      }
    }
    run()
  }, [group, authUser])

  const unreadCount = group?.unreadCount[authUser.uid]

  return (
    <Link to={`/chats/${group?.id}`}>
      <div className='pl-2 shadow-sm border-b grid grid-cols-10'>
        <div className='py-2 mx-auto col-span-2'>
          <SafeImage
            src={groupImg}
            className='mx-auto h-16 w-16 rounded-full border-2 border-gray-300 object-cover overflow-hidden'
            classNameFallback='h-12 object-cover opacity-50 animate-wobble-slow'
          />
        </div>
        <div className='pt-2 pb-1 pr-2 pl-1 col-span-8'>
          <div className='flex items-center justify-between'>
            <h2 className='text-sm font-bold'>
              {utils.snipText(groupName, 30)}
            </h2>
            <div className='flex items-end justify-end'>
              {!!unreadCount && (
                <span className='text-xs bg-giv-blue text-white font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-sm'>
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
          <div className='flex-1 flex flex-col items-between' style={{ height: '60px' }}>
              <p className='flex-1 text-xs mt-1 col-span-7 overflow-clip overflow-hidden'>
                {utils.snipText(group?.lastMessage?.content ?? 'Start Chatting...', 50)}
              </p>
            <span className='text-xs flex justify-end items-end font-medium'>
              {utils.parseAgo(group?.lastMessage?.timestamp)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
