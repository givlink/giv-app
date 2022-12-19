import React from 'react'
import Spinner from 'components/Spinner'
import { useSelector, useDispatch } from 'react-redux'
import { navigate } from '@reach/router'
import { useTranslation } from 'react-i18next'
import actions from 'state/actions'

const Page2 = ({ activeStepIndex = 0, code, handleNext }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const state = useSelector(s => ({
    authLoading: s.authLoading,
    authUser: s.authUser,
  }))
  const [checking, setChecking] = React.useState(false)

  const handleLogout = async () => {
    setChecking(true)
    //save code
    navigate(`/invite#${code}`)
    try {
      dispatch(actions.logout())
    } catch (err) {}
    setChecking(false)
  }
  const onSubmit = async () => {
    setChecking(true)

    if (!state.authUser) {
      //save step in url so after login we can come back here
      navigate(`/invite?step=${activeStepIndex + 1}#${code}`)

      dispatch(actions.login())
    } else {
      handleNext()
    }
    setChecking(false)
  }

  return (
    <>
      <div className='flex-1'></div>
      <img src='/image/giv_logo.png' alt='Giv' width='90' className='mb-12' />
      {!state.authLoading && state.authUser ? (
        <div className='flex flex-col items-center'>
          <span className='text-xs'>{t('Logged in as')}</span>
          <span className='font-medium text-blue-900 tracking-wide'>
            {state.authUser.displayName}
          </span>
          <button onClick={handleLogout} className='mt-6 text-sm underline'>
            {t('Not you? Logout')}
          </button>
        </div>
      ) : (
        <div className='flex flex-col items-center'>
          <span className='text-base text-giv-blue-dark font-medium text-center'>
            Let's create an account
          </span>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-6 w-6 text-giv-blue animate-pulse'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M19 13l-7 7-7-7m14-8l-7 7-7-7'
            />
          </svg>
        </div>
      )}
      <div className='flex-1'></div>
      <button
        onClick={onSubmit}
        disabled={checking}
        className={`bg-giv-blue text-white text-sm shadow-xl px-6 py-3 w-2/3 rounded-lg font-medium mt-0 mb-3 transition duration-150`}
      >
        {checking ? (
          <Spinner />
        ) : state.authUser ? (
          t('Next')
        ) : (
          t('Login with Facebook')
        )}
      </button>
      {!state.authUser && (
        <button
          onClick={() => navigate(`/login-mail?code=${code}`)}
          disabled={checking}
          className={`text-giv-blue border border-giv-blue text-sm shadow-xl px-6 py-3 w-2/3 rounded-lg font-medium mt-0 mb-8 transition duration-150`}
        >
          {checking ? (
            <Spinner />
          ) : state.authUser ? (
            t('Next')
          ) : (
            t('Login with Mail')
          )}
        </button>
      )}
    </>
  )
}

export default Page2
