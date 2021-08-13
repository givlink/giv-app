import React from 'react'
import { useLocation } from '@reach/router'
import { useDispatch } from 'react-redux'
import { parse } from 'query-string'

export default function useSavePushToken() {
  const dispatch = useDispatch()
  const loc = useLocation()

  React.useEffect(() => {
    const { pushtoken, pushToken } = parse(loc.search)

    let token = pushtoken || pushToken
    if (token) {
      localStorage.setItem('pushToken', token)
      dispatch({
        type: 'app/debug',
        log: { msg: `Token set in LocalStorage`, token, loc },
      })
    } else {
      dispatch({
        type: 'app/debug',
        log: { msg: `No Token in SavePushToken`, loc },
      })
    }
  }, [loc, dispatch])

  return null
}
