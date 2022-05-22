import SafeImage from 'components/SafeImage'
import React from 'react'
import { useSelector } from 'react-redux'
import * as api from 'lib/api'

const UserSearchItem = ({ onSelect = () => {}, user }) => {
  return (
    <button
      onClick={() => onSelect(user)}
      className='focus:bg-gray-100 rounded w-full hover:bg-gray-100 text-sm px-2 py-1 flex items-center gap-2'
    >
      <SafeImage src={user.photoURL} className='w-8 h-8 rounded-full' />
      <span>{user.name}</span>
    </button>
  )
}
export default function TagUser({
  message,
  setMessage,
  setUserFilterActive,
  userFilter,
  setUserFilter,
  taggedUsers = [],
  setTaggedUsers,
  textRef,
}) {
  const activeGroup = useSelector(s => s.activeGroup)
  const [users, setUsers] = React.useState([])

  React.useEffect(() => {
    if (!userFilter || !activeGroup) {
      setUsers([])
      return
    }
    api.searchUsers(userFilter, activeGroup).then(d => setUsers(d))
  }, [activeGroup, userFilter])

  if (!userFilter) return null

  return (
    <div
      style={{ minWidth: '250px' }}
      className='mb-2 p-2 rounded text-sm bg-white shadow-xl border border-gray-200'
    >
      <span className='text-xs font-semibold'>Tag User</span>
      <ul className='space-y-2'>
        {users.map(p => (
          <UserSearchItem
            onSelect={u => {
              const newMsg = message.split('@')
              newMsg.pop()
              newMsg.push(u.name)
              setMessage(newMsg.join('@'))
              setTaggedUsers([...taggedUsers, { name: u.name, id: u.id }])
              setUserFilter('')
              setUserFilterActive(false)
              textRef.current.focus()
            }}
            key={p.id}
            user={p}
          />
        ))}
        {users.length <= 0 && (
          <span className='block text-xs py-3 px-2'>No member found</span>
        )}
      </ul>
    </div>
  )
}
