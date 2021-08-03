import { Link } from '@reach/router'
import { useSelector } from 'react-redux'
import React from 'react'
import { useLocation, useMatch } from '@reach/router'
import { Transition } from '@headlessui/react'
import {
  ClockIcon as ClockIconSolid,
  ChatIcon as ChatIconSolid,
  UserIcon as UserIconSolid,
  BellIcon as BellIconSolid,
} from '@heroicons/react/solid'
import {
  SearchIcon,
  ClockIcon,
  ChatIcon,
  UserIcon,
  BellIcon,
} from '@heroicons/react/outline'

export default function Footer() {
  // const dispatch = useDispatch();
  const { unreadCount, user } = useSelector(s => ({
    unreadCount: s.notificationsUnreadCount,
    user: s.authUser,
  }))
  const loc = useLocation()

  const isPostList = !!useMatch('/')
  const isUserList = !!useMatch('/users')
  const isChatList = !!useMatch('/chats')
  const isRequestList = !!useMatch('/chats/requests')
  const isNotsList = !!useMatch('/notifications')

  const isMyPage = loc.pathname === `/users/${user?.uid}`

  const shouldShow =
    isPostList ||
    isUserList ||
    isChatList ||
    isRequestList ||
    isNotsList ||
    isMyPage

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
            <label className='hidden md:block'>Posts</label>
          </Link>
          <Link
            to='/users'
            className={`${
              isUserList
                ? 'text-giv-blue-dark border-giv-blue'
                : 'border-transparent'
            } flex flex-1 flex-col py-2 items-center border-b-4`}
          >
            <SearchIcon className='h-7 w-7 mt-0.5' />
            <label className='hidden md:block'>Search</label>
          </Link>
          <Link
            to='/chats/requests' //@Todo For now directly go to requests, in future go to chats
            className={`${
              isChatList || isRequestList
                ? 'text-giv-blue-dark border-giv-blue'
                : 'border-transparent'
            } flex flex-1 flex-col py-2 items-center border-b-4`}
          >
            {isChatList || isRequestList ? (
              <ChatIconSolid className='h-7 w-7' />
            ) : (
              <ChatIcon className='h-7 w-7' />
            )}
            <label className='hidden md:block'>Chat</label>
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
            <label className='hidden md:block'>Notifications</label>
          </Link>
          <Link
            to={`/users/${user?.uid}`}
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
            <label className='hidden md:block'>My Page</label>
          </Link>
        </div>
      </nav>
    </Transition>
  )
}
