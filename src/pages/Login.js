import React from 'react'
import { Link, navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import Spinner from 'components/Spinner'
import api from 'lib/api'

export default function LoginMail() {
  const { t } = useTranslation()
  const state = useSelector(s => ({
    authUser: s.authUser,
  }))
  const [email, setEmail] = React.useState('')
  const [pwd, setPwd] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (state.authUser) {
      navigate('/')
    }
  }, [state])

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    try {
      await api.loginWithEmail(email, pwd)
      return navigate('/')
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <div className='h-full flex flex-col items-center justify-center max-w-2xl mx-auto'>
      <div className='flex-1'></div>
      <img src='/image/giv_logo.png' alt='Giv' width='90' className='mb-12' />
      <div className='w-2/3 flex flex-col gap-1 mb-8'>
        <label>
          <span className='text-xs'>{t('Email')}</span>
          <input
            className='w-full border border-gray-200 px-4 py-3 rounded-md'
            placeholder={t('Email')}
            name='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
        </label>
        <label>
          <span className='text-xs'>{t('Password')}</span>
          <input
            className='w-full border border-gray-200 px-4 py-3 rounded-md'
            placeholder={t('Password')}
            type='password'
            name='Password'
            value={pwd}
            onChange={e => setPwd(e.target.value)}
          />
        </label>
        {error && (
          <p className='text-center text-red-600 bg-red-100 px-3 py-1 leading-none'>
            {error}
          </p>
        )}
        <button
          disabled={loading}
          onClick={handleLogin}
          className='px-6 py-3 bg-giv-blue text-white border border-giv-blue rounded-md font-medium w-full'
        >
          {loading ? <Spinner color='text-white' /> : t('Login with Mail')}
        </button>
      </div>
      <Link
        to='/login-legacy'
        className='w-64 px-3 underline leading-6 text-xs text-gray-600 text-center'
      >
        {t('Login with Facebook')}
      </Link>

      <div className='flex-1'></div>
      <div className='mb-4 flex justify-center space-x-4 text-xs'>
        <Link to='/reset' className='underline hidden'>
          {t('Reset Password')}
        </Link>
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
