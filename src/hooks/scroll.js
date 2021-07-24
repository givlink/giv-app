import React from 'react'
import { useLocation } from '@reach/router'

const DISABLE = false
const shouldDisable = process.env.NODE_ENV === 'development' && DISABLE

export default function useScrollTop(disableDev = true) {
  const { pathname } = useLocation()

  React.useEffect(() => {
    if (shouldDisable) return
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
