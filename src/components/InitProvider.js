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
  const [error, setError] = React.useState(null)
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (loading || !user) return

    //Don't init on invite or login pages
    if (
      window.location.pathname === '/login' ||
      window.location.pathname === '/login-legacy' ||
      window.location.pathname === '/reset'
    ) {
      return
    }

    const run = async () => {
      try {
        const isActivatedUser = await api.isActivatedUser()
        if (!isActivatedUser) {
          navigate('/invite')
          return
        }

        dispatch(actions.loadUserProfileAndInitialPost())
        dispatch(actions.watchNotifications())
        dispatch(actions.loadInitialUsers())
        dispatch(actions.loadInitialSkills())
        dispatch(actions.loadInitialGivTypes())
        dispatch(actions.loadInitialAreas())
        dispatch(actions.loadInitialSkillCategories())
        dispatch(actions.loadInitialAreaCategories())
        dispatch(actions.loadRecommendations())

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
  }, [dispatch, user, loading, setError])

  if (error) throw error

  return props.children
}

export default InitProvider
