import React from 'react'
import { useAuth } from 'hooks/auth'
import { navigate } from '@reach/router'
import { useDispatch } from 'react-redux'
import * as Sentry from '@sentry/browser'
import actions from 'state/actions'
import api from 'lib/api'

//Loads up all initial resources
const InitProvider = props => {
  const { user, loading } = useAuth()
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (loading || !user) return

    const run = async () => {
      const isActivatedUser = await api.isActivatedUser()
      if (!isActivatedUser) {
        navigate('/invite')
        return
      }

      dispatch(actions.loadUserProfileAndInitialPost())
      dispatch(actions.watchNotifications())
      dispatch(actions.watchRequests())
      dispatch(actions.loadInitialUsers())
      dispatch(actions.loadInitialSkills())
      dispatch(actions.loadInitialAreas())
      dispatch(actions.loadInitialSkillCategories())
      dispatch(actions.loadInitialAreaCategories())
      dispatch(actions.loadRecommendations())
      dispatch(actions.watchChatGroups())

      //setup push notifications
      const token = localStorage.getItem('pushToken')
      dispatch({
        type: 'app/debug',
        log: { msg: `Getting Token`, token, loc: window.location },
      })
      if (token) {
        api.setupNotifications(token).catch(err => {
          console.log('err setting up push token:', err.message)
          dispatch({
            type: 'app/debug',
            log: { msg: `Err: ${err.message}`, loc: window.location },
          })
          Sentry.captureException(err)
        })
      }
    }

    run()

    return () => {
      dispatch({ type: 'app/exit' }) //for resetting all listeners
    }
  }, [dispatch, user, loading])

  return props.children
}

export default InitProvider
