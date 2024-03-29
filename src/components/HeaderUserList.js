import React from 'react'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { useSelector, useDispatch } from 'react-redux'
import actions from 'state/actions'
import { useTranslation } from 'react-i18next'

export default function Header() {
  const { t } = useTranslation()
  const state = useSelector(s => ({
    skillCategories: s.skillCategories,
    skillMap: s.skills,
    userSearchFilter: s.userSearchFilter,
    usersLoading: s.usersLoading,
  }))
  const [value, setValue] = React.useState('')

  const dispatch = useDispatch()

  React.useEffect(() => {
    if (state.userSearchFilter.type === 'name') {
      setValue(state.userSearchFilter.value)
    } else {
      setValue('')
    }
  }, [state.userSearchFilter])

  const handleSubmitForm = e => {
    e.preventDefault()

    dispatch(
      actions.updateSearchFilter({
        type: value === '' ? null : 'name',
        value: value === '' ? null : value,
      }),
    )
  }
  const handleSubmit = e => {
    if (e.key !== 'Enter') {
      return
    }

    handleSubmitForm(e)
  }
  const handleChange = e => setValue(e.target.value)
  const handleReset = () => {
    setValue('')
    dispatch(actions.updateSearchFilter({ type: null, value: null }))
  }

  return (
    <div className='mb-16'>
      <header className='z-10 border-b border-gray-200 bg-white px-3 py-2 shadow fixed w-full top-0'>
        <div className='flex items-center justify-between max-w-2xl mx-auto'>
          <img
            width='40'
            src='/image/giv_logo.png'
            alt='Giv'
            className='object-cover'
          />
          <form
            onSubmit={handleSubmitForm}
            className='relative ml-2 flex-1 md:flex-none flex justify-end mt-1'
          >
            <MagnifyingGlassIcon className='absolute left-0 mt-2.5 ml-3 h-5 w-5 text-gray-500' />
            <input
              disabled={state.usersLoading}
              value={value}
              name='name'
              onChange={handleChange}
              onKeyDown={handleSubmit}
              placeholder={t('Search by last name')}
              className='border border-gray-300 text-sm pl-9 pr-9 py-2 rounded-full w-full focus:outline-none'
            />
            {value !== '' && (
              <button
                type='button'
                onClick={handleReset}
                className='absolute right-0 mt-2.5 mr-3 h-5 w-5'
              >
                <XMarkIcon className='h-5 w-5 text-red-500' />
              </button>
            )}
          </form>
        </div>
      </header>
    </div>
  )
}
