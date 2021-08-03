import React from 'react'
import firebase from 'lib/firebase'
import { useSelector, useDispatch } from 'react-redux'

export const useInitAuth = () => {
  const dispatch = useDispatch()

  React.useEffect(() => {
    const unsub = firebase.auth().onAuthStateChanged(user => {
      dispatch({ type: 'auth/data', user })
    })
    return unsub
  }, [dispatch])

  return null
}

export const useAuth = () => {
  return useSelector(s => ({ user: s.authUser, loading: s.authLoading }))
}
