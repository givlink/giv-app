import HeaderBack from 'components/HeaderBack'
import Spinner from 'components/Spinner'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import utils from 'lib/utils'
import { Link } from '@reach/router'
import useScrollTop from 'hooks/scroll'
import api from 'lib/api'
import SkillTagList from 'components/SkillTagList'

export default function UserDetail(props) {
  const dispatch = useDispatch()
  const { authUser, user, userSingleLoading } = useSelector((s) => ({
    authUser: s.authUser,
    user: s.userById[props.id],
    userSingleLoading: s.userSingleLoading,
  }))

  useScrollTop()

  React.useEffect(() => {
    if (user) return

    //Else call api and update user list
    const run = async () => {
      //@Todo err handling
      dispatch({ type: 'users/data_single_loading' })
      const user = await api.getUserProfile(props.id)
      dispatch({ type: 'users/data_single', user })
    }
    run()
  }, [user, props.id])

  if (!user && !userSingleLoading) return null //@todo show 404
  return (
    <div className="bg-white h-full">
      <HeaderBack />
      <div className="pb-24">
        {!user && userSingleLoading ? (
          <div className="pt-24">
          <Spinner />
          </div>
        ) : (
          <>
            <div className="flex py-5 pl-4 pr-1">
              <img
                src={utils.parseUrl(user.photoURL)}
                className="h-32 w-32 object-cover shadow-xl mr-3 rounded-xl"
              />
              <div className="">
                <h4 className="font-medium text-xl">{user.name}</h4>
                <span className="text-gray-600">{user.job}</span>
                <div className="mt-4">
                  <SkillTagList skills={user.skills} size="medium" />
                </div>
              </div>
            </div>
            {user.intro && user.intro !== '' && (
              <>
                <span className="block mt-4 mb-1 py-2 pl-4 pr-1 font-medium border-b">About</span>
                <p className="whitespace-pre-wrap leading-7 px-4">{user.intro}</p>
              </>
            )}
            <span className="block mt-4 mb-1 px-4 py-2 border-b font-medium">Interests</span>
            <div className="pl-4 pr-1 pt-2">
              <SkillTagList
                skills={user.interests}
                size={user.interests.length > 20 ? 'normal' : 'large'}
                limit={100}
              />
            </div>
            <span className="block mt-4 mb-1 px-4 py-2 border-b font-medium">Skills</span>
            <div className="pl-4 pr-1 pt-2">
              <SkillTagList skills={user.skills} size="large" limit={100} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
