import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import actions from 'state/actions'

export default function Login() {
  const { t } = useTranslation()
  const state = useSelector(s => ({
    authUser: s.authUser,
  }))
  const dispatch = useDispatch()
  React.useEffect(() => {
    if (state.authUser) {
      navigate('/')
    }
  }, [state])

  const handleLogin = provider => dispatch(actions.login(provider))

  return (
    <div className='h-full flex flex-col items-center justify-center max-w-2xl mx-auto'>
      <div className='flex-1'></div>
      <img src='/image/giv_logo.png' alt='Giv' width='90' className='mb-12' />
      <div className='w-2/3 flex flex-wrap items-center px-2 gap-2 mb-8'>
        <button
          onClick={() => handleLogin()}
          className='px-6 py-3 bg-giv-blue text-white rounded-md font-medium w-full'
        >
          {t('Login with Facebook')}
        </button>
      </div>
      <Link
        to='/login'
        className='w-64 px-3 underline leading-6 text-xs text-gray-600 text-center'
      >
        {t('Login with Mail')}
      </Link>
      <div className='flex-1'></div>
      <button
        onClick={() => handleLogin('apple')}
        className='hidden mb-8 flex items-center leading-0 text-xs shadow-sm hover:shadow-xl transition duration-150 rounded-md px-4 py-2 bg-gray-900 font-semibold text-white'
      >
        <img className='h-4 w-4 mr-2' src='/image/apple_logo.svg' alt='apple' />
        <span className='mt-1'>{t('Sign in with Apple')}</span>
      </button>
      <div className='mb-4 flex justify-center space-x-4 text-xs'>
        <a
          href='https://giv.link/privacy-policy/'
          target='_blank'
          rel='noreferrer'
          className='underline'
        >
          {t('Privacy Policy')}
        </a>
        <a
          href='https://giv.link/terms/'
          target='_blank'
          rel='noreferrer'
          className='underline'
        >
          {t('Terms')}
        </a>
      </div>
    </div>
  )
}
