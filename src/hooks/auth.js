import React from 'react'
import firebase from 'lib/firebase'
import * as Sentry from '@sentry/browser'
import { useSelector, useDispatch } from 'react-redux'

export const useInitAuth = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged(user => {
      if (user) {
        Sentry.setUser({
          email: user.email,
          id: user.uid,
          name: user.displayName,
        })
      } else {
        Sentry.configureScope(scope => scope.setUser(null))
      }
      dispatch({ type: 'auth/data', user })
    })
    return unsub
  }, [dispatch])

  return null
}

export const useAuth = () => {
  return useSelector(s => ({ user: s.authUser, loading: s.authLoading }))
}
