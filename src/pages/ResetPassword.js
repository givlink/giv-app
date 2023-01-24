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
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const [error, setError] = React.useState(null)

  React.useEffect(() => {
    if (state.authUser) {
      navigate('/')
    }
  }, [state])

  const handleReset = async () => {
    setLoading(true)
    setError(null)
    try {
      await api.resetPassword(email)
      setSent(true)
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
        {sent ? (
          <p>{t('Reset Password Email Sent')}</p>
        ) : (
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
        )}
        {error && (
          <p className='text-center text-red-600 bg-red-100 px-3 py-1 leading-none'>
            {error}
          </p>
        )}
        {sent ? (
          <button
            onClick={() => navigate('/login')}
            className='px-6 py-3 bg-giv-blue text-white border border-giv-blue rounded-md font-medium w-full'
          >
            {t('Back To Login')}
          </button>
        ) : (
          <button
            disabled={loading}
            onClick={handleReset}
            className='px-6 py-3 bg-giv-blue text-white border border-giv-blue rounded-md font-medium w-full'
          >
            {loading ? (
              <Spinner color='text-white' />
            ) : (
              t('Send Reset Password')
            )}
          </button>
        )}
      </div>
      {!sent && (
        <Link
          to='/login'
          className='w-64 px-3 underline leading-6 text-xs text-gray-600 text-center'
        >
          {t('Login')}
        </Link>
      )}
      <div className='flex-1' />
    </div>
  )
}
