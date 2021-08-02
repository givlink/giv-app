import React from 'react'
import { useLocation } from '@reach/router'
import { parse } from 'query-string'

export default function useSavePushToken() {
  const loc = useLocation()

  React.useEffect(() => {
    const { pushtoken, pushToken } = parse(loc.search)

    let token = pushtoken || pushToken
    if (token) {
      localStorage.setItem('pushToken', token)
    }
  }, [loc])

  return null
}
