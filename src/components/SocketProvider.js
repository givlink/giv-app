import React from 'react'
import { io } from 'socket.io-client'
import { useAuth } from 'hooks/auth'
import { _apiClient } from 'lib/api'

let socket

export default function SocketProvider(props) {
  const { user } = useAuth()
  const [d, setD] = React.useState([])

  React.useEffect(() => {
    if (!user) {
      console.log('skipping socket: no user')
      return
    }

    socket = io('ws://localhost:3000', {
      path: '/socket',
      autoConnect: true,
      withCredentials: true,
    })

    function onConnect() {
      console.log('connected')
    }

    function onDisconnect() {
      console.log('disconnected')
    }

    function onData(data) {
      console.log('received', data)
      setD(oldD => [...oldD, data])
    }

    socket.on('connect', onConnect)
    socket.on('disconnect', onDisconnect)
    socket.on('data', onData)

    return () => {
      socket.off('connect', onConnect)
      socket.off('disconnect', onDisconnect)
      socket.off('data', onData)
    }
  }, [user])

  return (
    <div>
      <div className='flex justify-center mt-24 py-3'>
        <button
          onClick={() => {
            _apiClient('/admin/debug')
          }}
          className='px-8 py-3 font-bold rounded bg-gray-200 text-gray-900'
        >
          Request Ping
        </button>
      </div>

      <ul>
        {d.map((item, idx) => (
          <li key={idx}>
            <pre>{JSON.stringify(item)}</pre>
          </li>
        ))}
      </ul>
      {props.children}
    </div>
  )
}
