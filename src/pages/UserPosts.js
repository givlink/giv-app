import HeaderBack from 'components/HeaderBack'
import React from 'react'
import Spinner from 'components/Spinner'
import { useLocation } from '@reach/router'
import { useDispatch, useSelector } from 'react-redux'
import GivList from 'components/GivList'
import { useTranslation } from 'react-i18next'
import usePreserveScroll from 'hooks/scroll'
import qs from 'query-string'
import EmptyUser from 'components/EmptyUser'
import api from 'lib/api'

export default function UserPosts(props) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const [loading, setLoading] = React.useState(true)
  const loc = useLocation()
  const state = useSelector(s => ({
    user: s.userById[props.id],
  }))
  const user = state.user

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

  const { type, count = 0 } = qs.parse(loc.search)
  usePreserveScroll(`userPosts${type}`, true)

  const title = type === 'receive' ? 'Giv Given' : 'Giv Received'

  return (
    <div className='bg-white h-full'>
      <HeaderBack />
      <div className='pb-24 max-w-2xl mx-auto'>
        {!user && state.userSingleLoading ? (
          <div className='pt-2'>
            <Spinner />
          </div>
        ) : user ? (
          <>
            <span className='block mt-4 mb-1 px-4 py-2 border-b font-medium text-2xl'>
              {state.user?.name}さんが{t(title)} {count > 0 && `(${count})`}
            </span>
            <div className='px-4 pt-2'>
              <GivList
                userId={state.user?.id}
                type={type}
                showViewMore={false}
              />
            </div>
          </>
        ) : (
          !loading && <EmptyUser />
        )}
      </div>
    </div>
  )
}
