import React from 'react'
import { useLocation } from '@reach/router'
import useApi from 'hooks/use-api'
import { db } from 'lib/localdb'

const shouldDisable = loc => {
  if (
    !loc ||
    loc.pathname === '/login' ||
    loc.pathname === '/login-legacy' ||
    loc.pathname === '/reset'
  ) {
    return true
  }
  return false
}

const useWatchChatGroups = () => {
  const loc = useLocation()
  const { data, error } = useApi(
    '/chat-groups',
    {},
    { refreshInterval: 5000, disable: shouldDisable(loc) },
  )

  React.useEffect(() => {
    if (!data || error) return
    const run = async () => {
      //find deleted items
      const deletedItems = {}
      await db.chatGroups.each(item => (deletedItems[item.id] = true))
      data.forEach(item => delete deletedItems[item.id])
      await db.chatGroups.bulkPut(data)
      await db.chatGroups.bulkDelete(Object.keys(deletedItems))
    }
    run()
  }, [data, error])

  return null
}

//Loads up all initial resources using the new SWR approach
export default function InitV2Provider(props) {
  useWatchChatGroups()

  return props.children
}
