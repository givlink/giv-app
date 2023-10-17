import { PowerIcon } from '@heroicons/react/24/outline'
import { Link } from '@reach/router'
import { useTranslation } from 'react-i18next'
import api from 'lib/api'

export default function Header() {
  const { t } = useTranslation()
  return (
    <div className='mb-16'>
      <header className='z-10 border-b border-gray-200 bg-white px-3 py-2 shadow fixed w-full top-0'>
        <div className='flex items-center justify-between max-w-2xl mx-auto'>
          <Link to='/' replace={true}>
            <img
              width='40'
              src='/image/giv_logo.png'
              alt='Giv'
              className='object-cover'
            />
          </Link>
          <button
            onClick={api.logout}
            className='text-gray-600 flex items-center text-xs pl-3 pr-1 py-2 font-medium hover:bg-gray-100 rounded'
          >
            {t('Logout')}
            <PowerIcon className='h-4 w-4 -mb-px ml-1 text-gray-500' />
          </button>
        </div>
      </header>
    </div>
  )
}
