import React from 'react'
import HeaderUserList from 'components/HeaderUserList'
import { useSelector, useDispatch } from 'react-redux'
import UserListCard from 'components/UserListCard'
import Spinner from 'components/Spinner'
import actions from 'state/actions'
import { XIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { useTranslation } from 'react-i18next'
import usePreserveScroll from 'hooks/scroll'

const makeOptions = (map, type, category) => {
  const result = []

  category.forEach(ac => {
    const itemsInCategory = []
    Object.values(map).forEach(i => {
      if (i.category === ac.id) {
        itemsInCategory.push(i)
      }
    })
    const item = [ac, itemsInCategory]
    if (itemsInCategory.length) result.push(item)
  })
  return result
}

const FilterBar = props => {
  const { t, i18n } = useTranslation()
  const state = useSelector(s => ({
    skillCategories: s.skillCategories,
    skillMap: s.skills,
    areaCategories: s.areaCategories,
    areaMap: s.areas,
    userSearchFilter: s.userSearchFilter,
    usersLoading: s.usersLoading,
  }))
  const dispatch = useDispatch()
  const handleChange = e => {
    dispatch(
      actions.updateSearchFilter({
        type: e.target.value === '' ? null : e.target.name,
        value: e.target.value === '' ? null : e.target.value,
      }),
    )
  }
  const tagField = i18n.language === 'en' ? 'tagEn' : 'tag'
  const handleReset = () => {
    dispatch(actions.updateSearchFilter({ type: null, value: null }))
  }

  return (
    <div className='mx-1.5 mt-2 mb-6 text-xs md:pt-4 max-w-2xl md:mx-auto'>
      <div className='flex items-center space-x-0.5'>
        <select
          name='skills'
          disabled={state.usersLoading}
          value={
            state.userSearchFilter.type === 'skills'
              ? state.userSearchFilter.value
              : ''
          }
          onChange={handleChange}
          className='w-1/2 border border-gray-200 rounded text-sm h-12 px-1 py-2'
        >
          <option value={''} className='text-center pr-2'>
            {t('Filter by Skills')}
          </option>
          {makeOptions(state.skillMap, 'skills', state.skillCategories).map(
            ([cat, skills]) => {
              return (
                <optgroup key={cat.id} label={cat[tagField]}>
                  {skills.map(s => (
                    <option key={s.id} className='block pl-1 py-1' value={s.id}>
                      {s[tagField]}
                    </option>
                  ))}
                </optgroup>
              )
            },
          )}
        </select>
        <select
          name='area'
          disabled={state.usersLoading}
          value={
            state.userSearchFilter.type === 'area'
              ? state.userSearchFilter.value
              : ''
          }
          onChange={handleChange}
          className='w-1/2 border border-gray-200 rounded text-sm h-12 px-1 py-2'
        >
          <option value={''} className='text-center pr-2'>
            {t('Filter by Area')}
          </option>

          {makeOptions(state.areaMap, 'area', state.areaCategories).map(
            ([cat, areas]) => {
              return (
                <optgroup key={cat.id} label={cat[tagField]}>
                  {areas.map(s => (
                    <option key={s.id} className='block pl-1 py-1' value={s.id}>
                      {s[tagField]}
                    </option>
                  ))}
                </optgroup>
              )
            },
          )}
        </select>
      </div>
      {(state.userSearchFilter.type === 'area' ||
        state.userSearchFilter.type === 'skills') &&
        state.userSearchFilter.value !== '' &&
        state.userSearchFilter.value !== null && (
          <div className='flex justify-end pr-1 mt-2'>
            <button
              onClick={handleReset}
              className='flex items-center justify-center px-2 py-0.5 border border-red-300 rounded'
            >
              <XIcon className='h-4 w-4 mt-px mr-0.5 text-red-500' />
              <span className='leading-none'>{t('Reset')}</span>
            </button>
          </div>
        )}
    </div>
  )
}
const EmptyUserList = () => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col items-center justify-center pt-20'>
      <img
        className='w-24 h-24 animate-wobble-slow opacity-50'
        src='/icons/tama_def_sleepy.png'
        alt=''
      />
      <span className='text-sm text-gray-500 pt-2'>{t('No Users Found')}</span>
    </div>
  )
}

export default function UserList() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { users, loading, hasMore, loadingMore } = useSelector(s => ({
    users: s.users,
    loading: s.usersLoading,
    hasMore: s.usersHasMore,
    loadingMore: s.usersLoadingMore,
  }))

  usePreserveScroll('userList')

  return (
    <div className='pb-20'>
      <HeaderUserList />
      <FilterBar />
      {loading && <Spinner className='' />}

      <ul className='max-w-2xl mx-auto divide-y overflow-x-hidden'>
        {users.map(u => {
          return (
            <li key={u.id}>
              <UserListCard user={u} />
            </li>
          )
        })}
        {!loading && users.length === 0 && <EmptyUserList />}
      </ul>
      {hasMore && !loading && (
        <div className='max-w-2xl md:mx-auto flex items-center justify-end mx-2'>
          <button
            disabled={loadingMore}
            className='flex items-center justify-end px-6 w-full md:w-auto border border-gray-400 shadow rounded py-3 my-3'
            onClick={() => dispatch(actions.loadMoreUsers())}
          >
            <span className='mr-2 mb-px'>{t('Load More')}</span>
            {loadingMore ? (
              <Spinner size='h-5 w-5' />
            ) : (
              <ChevronRightIcon className='h-5 w-5' />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
