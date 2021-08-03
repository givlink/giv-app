import React from 'react'
import { useDispatch } from 'react-redux'
import { navigate } from '@reach/router'
import { useAuth } from 'hooks/auth'
import { useTranslation } from 'react-i18next'
import actions from 'state/actions'

export default function Login() {
  const { t } = useTranslation()
  const { user } = useAuth()
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (user) {
      //already logged in..
      navigate('/')
      return
    }
  }, [user])

  const handleLogin = provider => dispatch(actions.login(provider))

  return (
    <div className='h-full flex flex-col items-center justify-center max-w-2xl mx-auto'>
      <div className='flex-1'></div>
      <img src='/image/giv_logo.png' alt='Giv' width='90' className='mb-12' />
      <button
        onClick={() => handleLogin()}
        className='px-6 py-3 w-2/3 bg-giv-blue text-white rounded-lg font-medium mb-8'
      >
        {t('Login')}
      </button>
      <a
        href='https://giv.link/privacy-policy/'
        target='_blank'
        rel='noreferrer'
        className='border-b border-gray-400'
      >
        {t('Privacy Policy')}
      </a>
      <div className='flex-1'></div>
      <button
        onClick={() => handleLogin('apple')}
        className='mb-4 flex items-center leading-0 text-sm shadow-sm hover:shadow-xl transition duration-150 rounded-md px-4 py-2 bg-gray-900 font-semibold text-white'
      >
        <img className='h-5 w-5 mr-2' src='/image/apple_logo.svg' alt='apple' />
        <span className='mt-1'>{t('Sign in with Apple')}</span>
      </button>
    </div>
  )
}
