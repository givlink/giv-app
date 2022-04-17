import React from 'react'
import { LogoutIcon, HomeIcon } from '@heroicons/react/outline'
import actions from 'state/actions'
import { useDispatch, useSelector } from 'react-redux'
import ErrorComponent from 'components/Error'
import Spinner from 'components/Spinner'
import api from 'lib/api'
import { useTranslation } from 'react-i18next'
import { navigate } from '@reach/router'

const Page1 = ({ activeStepIndex = 0, code, setInviteCode, handleNext }) => {
  const state = useSelector(s => ({
    authUser: s.authUser,
  }))
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [error, setError] = React.useState(null)
  const [checking, setChecking] = React.useState(false)

  const isValidCode = code !== ''

  const onChange = e => {
    if (error) setError(null)
    setInviteCode(e.target.value)
  }

  const onSubmit = async () => {
    setError(null)
    setChecking(true)
    try {
      //Check code valid
      const result = await api.getInviteCode(code)
      if (!result) throw new Error('Invite code not found')
      setChecking(false)
      //then proceed to next page
      handleNext()
    } catch (err) {
      console.log(err.message)
      setError('招待コードが間違っています')
      setChecking(false)
    }
  }

  return (
    <>
      <div className='flex-1'></div>
      <img src='/image/giv_logo.png' alt='Giv' width='90' className='mb-12' />
      <span className='text-sm text-gray-700 mb-1'>
        {t('Enter your invite code')}
      </span>
      <input
        value={code}
        onChange={onChange}
        placeholder={t('Invite Code')}
        type='text'
        className='w-72 text-lg rounded-lg py-3 px-4 mb-6 border border-gray-400'
      />
      <a
        href='https://giv.link/'
        target='_blank'
        rel='noreferrer'
        className='w-64 px-3 underline leading-6 text-xs text-gray-600 text-center'
      >
        {t('No Code?')}
      </a>
      <div className='flex-1'></div>
      <ErrorComponent error={error} />
      <button
        onClick={onSubmit}
        disabled={checking}
        className={`${
          isValidCode
            ? 'bg-giv-blue text-white shadow-xl'
            : 'bg-gray-200 text-gray-600 opacity-75'
        } px-6 py-3 w-2/3 rounded-lg font-medium mt-4 mb-8 transition duration-150`}
      >
        {checking ? <Spinner /> : t('Next')}
      </button>

      <div className='w-full flex items-center justify-between'>
        <button
          onClick={() => navigate('/')}
          className='flex-1 text-gray-600 flex items-center justify-center text-xs py-4 px-4 mb-2 font-medium hover:bg-gray-100 rounded'
        >
          <HomeIcon className='h-4 w-4 -mb-px mr-1 text-gray-500' />
          {t('Go to Home')}
        </button>
        {state.authUser && (
          <button
            onClick={() => dispatch(actions.logout())}
            className='flex-1 text-gray-600 flex items-center justify-center text-xs py-4 px-4 mb-2 font-medium hover:bg-gray-100 rounded'
          >
            {t('Logout')}
            <LogoutIcon className='h-4 w-4 -mb-px ml-1 text-gray-500' />
          </button>
        )}
      </div>
    </>
  )
}

export default Page1
