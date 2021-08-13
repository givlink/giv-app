import React from 'react'
import { useLocation , navigate} from '@reach/router'
import { parse } from 'query-string'


const NavigationProvider = props=>{
  const loc = useLocation()
  React.useEffect(()=>{
  const searchParams = parse(loc.search)
    let url
    switch(searchParams.goto){
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
    if(url)      navigate(url)

  },[loc])
  return props.children
}
export default NavigationProvider
