import { Link } from '@reach/router'
import { useSelector } from 'react-redux'
import React from 'react'
import { useLocation, useMatch } from '@reach/router'
import { Transition } from '@headlessui/react'

export default function Footer() {
  const { unreadCount, user } = useSelector((s) => ({
    unreadCount: s.unreadCount,
    user: s.authUser,
  }))
  const loc = useLocation()

  const isPostList = !!useMatch('/')
  const isUserList = !!useMatch('/users')
  const isChatList = !!useMatch('/chats')
  const isNotsList = !!useMatch('/notifications')

  const isMyPage = loc.pathname === `/users/${user?.uid}`
  console.log(loc.pathname)

  const shouldShow = isPostList || isUserList || isChatList || isNotsList || isMyPage

  return (
    <Transition
      as={React.Fragment}
      appear={true}
      show={shouldShow}
      enter="transform transition duration-300 ease-out-expo"
      enterFrom="translate-y-1/2 opacity-50"
      enterTo="translate-y-0 opacity-100"
      leave="transform duration-150 transition ease-in"
      leaveFrom="translate-y-0 opacity-100"
      leaveTo="translate-y-1/2 opacity-0"
    >
      <nav className="bg-white text-gray-600 m-3 fixed z-10 left-0 right-0 bottom-0 px-3 rounded-xl shadow-lg py-3 border border-gray-300">
        <div className="max-w-xl mx-auto flex items-center justify-between">
          <Link
            to="/"
            className={`${isPostList && 'text-giv-blue-dark'} flex flex-col items-center`}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </Link>
          <Link
            to="/users"
            className={`${isUserList && 'text-giv-blue-dark'} flex flex-col items-center`}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </Link>
          <Link
            to="/chats"
            className={`${isChatList && 'text-giv-blue-dark'} flex flex-col items-center`}
          >
            <svg
              className="w-7 h-7"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
          </Link>
          <Link
            to="/notifications"
            className={`${isNotsList && 'text-giv-blue-dark'} flex flex-col items-center`}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              ></path>
            </svg>
            {unreadCount > 0 && (
              <div className="w-6 h-6 text-xs p-1 text-white flex items-center justify-center rounded-full absolute top-0 right-0 -mt-3 -mr-4 bg-giv-blue">
                {unreadCount}
              </div>
            )}
          </Link>
          <Link
            to={`/users/${user?.uid}`}
            className={`${isMyPage && 'text-giv-blue-dark'} flex flex-col items-center`}
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 22 22"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
          </Link>
        </div>
      </nav>
    </Transition>
  )
}
