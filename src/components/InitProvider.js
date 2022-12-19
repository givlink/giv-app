import React from 'react'
import { useAuth } from 'hooks/auth'
import { navigate, useLocation } from '@reach/router'
import { useDispatch } from 'react-redux'
import * as Sentry from '@sentry/browser'
import actions from 'state/actions'
import api from 'lib/api'

const sleep = ms => new Promise(r => setTimeout(r, ms))

//Loads up all initial resources
const InitProvider = props => {
  const loc = useLocation()
  const { user, loading } = useAuth()
  const [error, setError] = React.useState(null)
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (loading || !user) return

    //Don't init of invite pages
    if (loc.pathname === '/invite') return

    const run = async () => {
      try {
        await sleep(3000) //initial delay to make sure we have the auth
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
        dispatch(actions.loadInitialGivTypes())
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
      } catch (err) {
        setError(err)
      }
    }

    run()

    return () => {
      dispatch({ type: 'app/exit' }) //for resetting all listeners
    }
  }, [dispatch, user, loading, setError, loc])

  if (error) throw error

  return props.children
}

export default InitProvider
