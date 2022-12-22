import React from 'react'
import { HomeIcon } from '@heroicons/react/outline'
import ErrorComponent from 'components/Error'
import SpinnerFull from 'components/SpinnerFull'
import api from 'lib/api'
import { useTranslation } from 'react-i18next'
import { navigate } from '@reach/router'

const Page6 = ({ data }) => {
  const { t } = useTranslation()
  const [loading, setLoading] = React.useState(true)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (!data) return

    setLoading(true)

    const run = async () => {
      try {
        await api.createUserProfile(data)
      } catch (err) {
        setError('エラー：' + err.message)
      }
      setLoading(false)
    }
    run()
  }, [data])

  if (loading) return <SpinnerFull />
  return (
    <div className='flex-1 flex flex-col items-center justify-center w-full px-2 overflow-x-hidden bg-blue-50'>
      <div className='flex-1' />
      <div className='px-12 flex flex-col items-center justify-center w-full mb-12'>
        <img className='w-24 h-24 mb-12' src='/image/giv_logo.png' alt='' />
        {error ? (
          <>
            <ErrorComponent error={error} />
            <span className='mt-6 text-sm'>
              {t('Please contact Giv support team')}
            </span>
          </>
        ) : (
          <>
            <span className='text-xl text-blue-900'>
              {t('Registration Finished')}
            </span>
            <span className='text-xl text-blue-900'>{t('Thank You')}</span>
          </>
        )}
      </div>
      <div className='flex-1' />
      {!error && (
        <button
          onClick={() => navigate('/')}
          className='mb-6 w-4/5 text-white font-medium bg-giv-blue px-8 py-4 rounded flex items-center justify-center'
        >
          <HomeIcon className='mr-2 h-6 w-6' />
          {t('Go to Home')}
        </button>
      )}
    </div>
  )
}

export default Page6
