import React from 'react'
import {useDispatch} from 'react-redux'

//This sets up some global funcs which are used in ios native side
export default function useGlobalFuncs() {
  const dispatch = useDispatch()

  React.useEffect(() => {
    window.globalSetGotoLink = (gotoLink) => {
      dispatch({type:'app/gotoLink', gotoLink})
    }
    window.globalSetPushToken = (token) => {
      dispatch({type:'app/token', token})
    }
  }, [dispatch])
}
