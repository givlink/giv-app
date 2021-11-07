import React from 'react'
import { Link } from '@reach/router'
import utils from 'lib/utils'
import SafeImage from 'components/SafeImage'

export default function UserCircleItem({ user }) {
  return (
    <Link to={`/users/${user?.id}`} >
      <div className='h-36 w-full flex flex-col'>
        <img
          src={utils.parseUrl(user?.photoURL)}
          className='mx-auto h-full w-full object-cover object-top rounded-md shadow overflow-hidden'
        />
        <div className='h-10 mt-auto flex flex-col items-center'>
          <span className='text-center text-xs pt-2 pb-1 truncate'>
            {utils.snipText(user?.name, 14)}
          </span>
        </div>
      </div>
    </Link>
  )
}
