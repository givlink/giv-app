import { Link } from '@reach/router'
import { useSelector } from 'react-redux'
import React from 'react'
import { useLocation, useMatch } from '@reach/router'
import { Transition } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { db } from '../lib/localdb'
import { useLiveQuery } from 'dexie-react-hooks'
import {
  ClockIcon as ClockIconSolid,
  ChatIcon as ChatIconSolid,
  UserIcon as UserIconSolid,
  BellIcon as BellIconSolid,
  SparklesIcon as SparklesIconSolid,
} from '@heroicons/react/solid'
import {
  SearchIcon,
  ClockIcon,
  ChatIcon,
  UserIcon,
  BellIcon,
  SparklesIcon,
} from '@heroicons/react/outline'

export default function Footer() {
  const { t } = useTranslation()
  // const dispatch = useDispatch();
  const { unreadCount, user } = useSelector(s => ({
    unreadCount: s.notificationsUnreadCount,
    user: s.user,
  }))
  const loc = useLocation()

  const isPostList = !!useMatch('/')
  const isUserList = !!useMatch('/users')
  const isChatList = !!useMatch('/chats')
  const isRequestList = !!useMatch('/chats/requests')
  const isNotsList = !!useMatch('/notifications')
  const isReccomendationList = !!useMatch('/recommendations')

  const isMyPage = loc.pathname === `/users/${user?.id}`

  const shouldShow =
    isPostList ||
    isUserList ||
    isChatList ||
    isRequestList ||
    isNotsList ||
    isReccomendationList ||
    isMyPage

  const unreadChatGroupsCount = useLiveQuery(() =>
    db.chatGroups.where('hasUnread').equals(1).count(),
  )

  return (
    <Transition
      as={React.Fragment}
      appear={true}
      show={shouldShow}
      enter='transform transition duration-300 ease-out-expo'
      enterFrom='translate-y-1/2 opacity-50'
      enterTo='translate-y-0 opacity-100'
      leave='transform duration-150 transition ease-in'
      leaveFrom='translate-y-0 opacity-100'
      leaveTo='translate-y-1/2 opacity-0'
    >
      <nav className='max-w-2xl md:mx-auto bg-white text-gray-600 my-3 mx-2 px-1 fixed z-10 left-0 right-0 bottom-0 rounded-xl shadow-lg border border-gray-300'>
        {user ? (
          <div className='max-w-xl mx-auto flex items-center justify-between'>
            <Link
              to='/'
              // onClick={() => {
              //   isPostList &&
              //     window.scrollTo({ left: 0, top: 0, behavior: "smooth" });
              //     This doesn't smooth on ios safari
              // }}
              className={`${
                isPostList
                  ? 'text-giv-blue-dark border-giv-blue'
                  : 'border-transparent'
              } flex flex-1 flex-col py-2 items-center border-b-4`}
            >
              {isPostList ? (
                <ClockIconSolid className='h-7 w-7' />
              ) : (
                <ClockIcon className='h-7 w-7' />
              )}
              <label className='hidden md:block'>{t('Footer_Posts')}</label>
            </Link>
            <Link
              to='/users'
              className={`${
                isUserList
                  ? 'text-giv-blue-dark border-giv-blue'
                  : 'border-transparent'
              } flex flex-1 flex-col py-2 items-center border-b-4`}
            >
              <SearchIcon className='pt-px h-7 w-7' />
              <label className='hidden md:block'>{t('Footer_Search')}</label>
            </Link>
            <Link
              to='/recommendations'
              className={`${
                isReccomendationList
                  ? 'text-giv-blue-dark border-giv-blue'
                  : 'border-transparent'
              } flex flex-1 flex-col py-2 items-center border-b-4 relative`}
            >
              {isReccomendationList ? (
                <SparklesIconSolid className='h-7 w-7' />
              ) : (
                <SparklesIcon className='h-7 w-7' />
              )}
              <label className='hidden md:block'>{t('Footer_Discover')}</label>
            </Link>
            <Link
              to='/chats'
              className={`${
                isChatList || isRequestList
                  ? 'text-giv-blue-dark border-giv-blue'
                  : 'border-transparent'
              } relative flex flex-1 flex-col py-2 items-center border-b-4`}
            >
              {isChatList || isRequestList ? (
                <ChatIconSolid className='h-7 w-7' />
              ) : (
                <ChatIcon className='h-7 w-7' />
              )}
              {unreadChatGroupsCount > 0 && (
                <div className='w-5 h-5 text-xs leading-none font-mono p-1 text-white flex items-center justify-center rounded-full absolute mt-0 mr-1 top-0 right-0 bg-giv-blue'>
                  {unreadChatGroupsCount}
                </div>
              )}
              <label className='hidden md:block'>{t('Footer_Chat')}</label>
            </Link>
            <Link
              to='/notifications'
              className={`${
                isNotsList
                  ? 'text-giv-blue-dark border-giv-blue'
                  : 'border-transparent'
              } flex flex-1 flex-col py-2 items-center border-b-4 relative`}
            >
              {isNotsList ? (
                <BellIconSolid className='h-7 w-7' />
              ) : (
                <BellIcon className='h-7 w-7' />
              )}
              {unreadCount > 0 && (
                <div className='w-5 h-5 text-xs p-1 text-white flex items-center justify-center rounded-full absolute mt-0 mr-1 top-0 right-0 bg-giv-blue'>
                  {unreadCount}
                </div>
              )}
              <label className='hidden md:block'>
                {t('Footer_Notifications')}
              </label>
            </Link>
            <Link
              to={`/users/${user?.id}`}
              className={`${
                isMyPage
                  ? 'text-giv-blue-dark border-giv-blue'
                  : 'border-transparent'
              } flex flex-1 flex-col py-2 items-center border-b-4`}
            >
              {isMyPage ? (
                <UserIconSolid className='h-7 w-7' />
              ) : (
                <UserIcon className='h-7 w-7' />
              )}
              <label className='hidden md:block'>{t('Footer_MyPage')}</label>
            </Link>
          </div>
        ) : null}
      </nav>
    </Transition>
  )
}
