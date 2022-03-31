import HeaderNotificationList from 'components/HeaderNotificationList'
import React from 'react'
import { useSelector } from 'react-redux'
import NotificationListCard from 'components/NotificationListCard'
import Spinner from 'components/Spinner'
import { useTranslation } from 'react-i18next'
import usePreserveScroll from 'hooks/scroll'

export default function NotificationList() {
  const { t } = useTranslation()
  const state = useSelector(s => ({
    currUser: s.user,
    notifications: s.notifications,
    loading: s.notificationsLoading,
  }))

  usePreserveScroll('notificationList', true)

  return (
    <div className='h-full'>
      <HeaderNotificationList />
      {state.loading && <Spinner className='pt-2' />}

      <ul className='pb-20 max-w-2xl mx-auto'>
        {state.notifications.map(n => {
          return (
            <li key={n.id}>
              <NotificationListCard user={state.currUser} notification={n} />
            </li>
          )
        })}

        {!state.loading && state.notifications.length === 0 && (
          <div className='flex flex-col items-center justify-center py-4'>
            <img
              className='w-16 h-16 animate-wobble-slow'
              src='/icons/tama_def_sleepy.png'
              alt=''
            />
            <span className='text-sm text-gray-500 pt-2'>
              {t('No new notifications')}
            </span>
          </div>
        )}
      </ul>
    </div>
  )
}
