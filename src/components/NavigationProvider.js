import React from 'react'
import { useLocation, navigate } from '@reach/router'
import { useDispatch, useSelector } from 'react-redux'
import { parse } from 'query-string'

//Useful when clicking a notification on device, takes you to right page
const NavigationProvider = props => {
  const link = useSelector(s => s.gotoLink)
  const dispatch = useDispatch()
  const loc = useLocation()

  React.useEffect(() => {
    let gotoLink = parse(loc.search)['goto']
    //URL params take priority
    if (!gotoLink || gotoLink === 'home') {
      //If url not there then check redux state
      if (link && link !== '' && link !== 'home') {
        gotoLink = link
      }
    }

    let url
    switch (gotoLink) {
      case 'chats':
        url = '/chats'
        break
      case 'requests':
        url = '/chats/requests'
        break
      case 'notifications':
        url = '/notifications'
        break
      default:
        break
    }
    if (url) {
      dispatch({ type: 'app/link', link: 'home' }) //Reset state
      navigate(url)
    }
  }, [loc, link, dispatch])
  return props.children
}
export default NavigationProvider
