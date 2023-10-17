import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from '@reach/router'

export default function Header({ requestsCount = 0 }) {
  const { t } = useTranslation()
  return (
    <div className='mb-16'>
      <header className='z-10 border-b border-gray-200 bg-white px-3 shadow mb-3 fixed w-full top-0'>
        <div className='flex items-center mt-0.5 justify-between max-w-2xl mx-auto'>
          <img
            src='/image/giv_logo.png'
            alt='Giv'
            className='w-10 object-cover'
          />
          <div className='flex-1 flex items-center'>
            <Link
              className={`
-mb-px text-xs sm:text-sm font-medium px-2 pt-5 pb-4 w-full text-center inline-block`}
              to='/chats/requests'
            >
              <span className='relative'>
                {t('Requests')}
                <span
                  className={`${requestsCount > 0 ? 'visible' : 'hidden'} ${
                    true
                      ? 'text-white bg-giv-blue '
                      : 'bg-gray-300 text-gray-900 opacity-50'
                  } absolute top-0 right-0 -mr-7 -mt-3 w-6 h-6 p-1 flex items-center justify-center leading-0 text-xs rounded-full`}
                >
                  {requestsCount > 10 ? '9+' : requestsCount}
                </span>
              </span>
            </Link>
          </div>
        </div>
      </header>
    </div>
  )
}
