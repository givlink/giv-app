import React from 'react'
import { useAuth } from 'hooks/auth'
import { useDispatch } from 'react-redux'
import actions from 'state/actions'
import api from 'lib/api'

//Loads up all initial resources
const InitProvider = props => {
  const { user, loading } = useAuth()
  const dispatch = useDispatch()

  React.useEffect(() => {
    if (loading || !user) return

    dispatch(actions.loadUserProfileAndInitialPost())
    dispatch(actions.watchNotifications())
    dispatch(actions.watchRequests())
    dispatch(actions.loadInitialUsers())
    dispatch(actions.loadInitialSkills())
    dispatch(actions.loadInitialAreas())
    dispatch(actions.loadInitialSkillCategories())
    dispatch(actions.loadInitialAreaCategories())
    dispatch(actions.watchChatGroups())

    //setup push notifications
    const token = localStorage.getItem('pushToken')
    if (token) {
      api.setupNotifications(token).catch(err => {
        console.log('err setting up push token:', err.message)
      })
    }

    return () => {
      dispatch({ type: 'app/exit' }) //for resetting all listeners
    }
  }, [dispatch, user, loading])

  return props.children
}

export default InitProvider
