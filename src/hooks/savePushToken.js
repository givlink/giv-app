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
        log: { msg: `Token stored in LocalStorage`, token, loc },
      })
    }
  }, [loc, dispatch])

  return null
}
