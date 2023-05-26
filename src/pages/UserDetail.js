import HeaderMyPage from 'components/HeaderMyPage'
import HeaderBack from 'components/HeaderBack'
import Spinner from 'components/Spinner'
import React from 'react'
import { useLocation } from '@reach/router'
import { useDispatch, useSelector } from 'react-redux'
import utils from 'lib/utils'
import api from 'lib/api'
import SkillTagList from 'components/SkillTagList'
import UserInterests from 'components/UserInterests'
import UserGivPrefs from 'components/UserGivPrefs'
import UserAbout from 'components/UserAbout'
import FloatingRequestButton from 'components/FloatingRequestButton'
import ProfilePic from 'components/ProfilePic'
import PauseGivActivity from 'components/PauseGivActivity'
import GivList from 'components/GivList'
import { LocationMarkerIcon } from '@heroicons/react/outline'
import { useTranslation } from 'react-i18next'
import EditUser from 'components/EditUser'
import usePreserveScroll from 'hooks/scroll'
import ReportActions from 'components/ReportActions'
import EmptyUser from 'components/EmptyUser'

const safeJsonStringify = require('safe-json-stringify')

const ADMIN_ID = '5ccf0b6a-770e-4753-8370-5f3318649938'

const Debug = () => {
  const debugState = useSelector(s => {
    const ignored = [
      'postsOffset',
      'posts',
      'postById',
      'usersOffset',
      'users',
      'userById',
      'requests',
      'chatMessages',
    ]
    const state = { ...s }
    ignored.forEach(i => {
      delete state[i]
    })
    return state
  })

  const getAllVars = () => {
    const items = []
    for (var i = 0; i < localStorage.length; i++) {
      // do something with localStorage.getItem(localStorage.key(i));
      const key = localStorage.key(i)
      const val = localStorage.getItem(key)
      items.push({ key, val })
    }
    return items
  }

  return (
    <div className='m-1 rounded text-xs bg-white border border-gray-300 py-5 shadow-lg overflow-hidden'>
      <span className='block mb-2 font-bold font-mono uppercase tracking-wide text-center'>
        Debug
      </span>
      <div className='flex flex-col space-y-2'>
        <span className='bg-gray-100 py-2 px-2'>LocalStorage</span>
        {getAllVars().map(item => {
          return (
            <div key={item.key} className='flex flex-col py-1 ml-2'>
              <span className='font-medium underline mb-1'>{item.key}</span>
              <code className='pl-3 pb-2 overflow-x-auto whitespace-pre-wrap'>
                {item.val}
              </code>
            </div>
          )
        })}
      </div>
      <div className='flex flex-col space-y-2 mt-3'>
        <span className='bg-gray-100 py-2 px-2'>Redux State</span>
        <div className='flex flex-col py-1 ml-2'>
          <code className='pl-3 pb-2 overflow-x-auto whitespace-pre-wrap'>
            {safeJsonStringify(debugState, null, 2)}
          </code>
        </div>
      </div>
    </div>
  )
}

export default function UserDetail(props) {
  const { t, i18n } = useTranslation()
  const loc = useLocation()
  const dispatch = useDispatch()
  const [loading, setLoading] = React.useState(true)
  const state = useSelector(s => ({
    user: s.userById[props.id],
    currUser: s.user,
    areaMap: s.areas,
  }))

  const tagField = i18n.language === 'en' ? 'tagEn' : 'tag'

  const renderArea = s => {
    const area = state.areaMap[s]
    if (!area) return s
    return area[tagField]
  }

  usePreserveScroll('userDetail', true)

  React.useEffect(() => {
    if (state.user) {
      return
    }
    //call api and update user list
    setLoading(true)
    api.getUserProfile(props.id).then(user => {
      dispatch({ type: 'users/data_single', user })
      setLoading(false)
    })
  }, [props.id, state.user, dispatch])

  const isMyPage = loc.pathname === `/users/${state.currUser?.id}`
  const isAdmin = props.id === ADMIN_ID
  const user = state.user

  return (
    <div className='bg-white h-full'>
      {isMyPage ? (
        <HeaderMyPage />
      ) : (
        <>
          <HeaderBack showComplaintButton={false} />
          {user && (
            <FloatingRequestButton userId={props.id}>
              Send Giv
            </FloatingRequestButton>
          )}
        </>
      )}
      <div className='pb-24 max-w-2xl mx-auto'>
        {!user && state.userSingleLoading ? (
          <div className='pt-2'>
            <Spinner />
          </div>
        ) : user ? (
          <>
            {isMyPage && <EditUser user={user} />}
            <div className='grid grid-cols-12 py-5 pl-4 pr-1'>
              <div className='col-span-5 mr-3'>
                <ProfilePic src={utils.parseUrl(user.photoURL)} />
              </div>
              <div className='col-span-7'>
                <h4 className='font-medium text-xl'>{user.name}</h4>
                <span className='text-gray-600 text-sm whitespace-wrap pr-2'>
                  {user.job}
                </span>
                <div className='mt-4 flex items-center'>
                  <LocationMarkerIcon className='h-5 w-5 mr-1 text-gray-400' />
                  <span>{renderArea(user.areaId)}</span>
                </div>
                <div className='mt-4'>
                  <SkillTagList skills={user.skills} size='medium' />
                </div>
                <PauseGivActivity user={user} editable={isMyPage} />
              </div>
            </div>
            <UserAbout user={user} editable={isMyPage} />
            <UserGivPrefs type='send' user={user} editable={isMyPage} />
            <UserGivPrefs type='receive' user={user} editable={isMyPage} />
            <UserInterests user={user} editable={isMyPage} />
            <span className='block mt-4 mb-1 px-4 py-2 border-b font-medium'>
              {t('Skills')}
            </span>
            <div className='pl-4 pr-1 pt-2'>
              <SkillTagList skills={user.skills} size='large' limit={100} />
            </div>
            <span className='block mt-4 mb-1 px-4 py-2 border-b font-medium'>
              {t('Giv Given')}{' '}
            </span>
            <div className='px-4 pt-2'>
              <GivList
                total={user.totalGivsGiven}
                userId={user.id}
                type='receive'
                limit={4}
              />
            </div>
            <span className='block mt-4 mb-1 px-4 py-2 border-b font-medium'>
              {t('Giv Received')}
            </span>
            <div className='px-4 pt-2'>
              <GivList
                total={user.totalGivsReceived}
                userId={user.id}
                type='send'
                limit={4}
              />
            </div>

            {!isMyPage && <ReportActions targetUser={user} />}
            {isMyPage && isAdmin && <Debug />}
          </>
        ) : (
          !loading && <EmptyUser />
        )}
      </div>
    </div>
  )
}
