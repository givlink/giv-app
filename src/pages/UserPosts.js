import HeaderBack from 'components/HeaderBack'
import React from 'react'
import { useLocation } from '@reach/router'
import GivList from 'components/GivList'
import { useTranslation } from 'react-i18next'
import usePreserveScroll from 'hooks/scroll'
import { parse } from 'query-string'

export default function UserPosts() {
  const { t } = useTranslation()
  const loc = useLocation()
  const searchParams = parse(loc.search)
  delete searchParams.limit // on user posts we show ALL posts

  usePreserveScroll(`userPosts`, true)

  const title = loc.state.type === 'receive' ? 'Giv Given' : 'Giv Received'

  return (
    <div className='bg-white h-full'>
      <HeaderBack />
      <div className='pb-24 max-w-2xl mx-auto'>
        <span className='block mt-4 mb-1 px-4 py-2 border-b font-medium text-2xl'>
          {loc.state.userName}さんが{t(title)}{' '}
          {loc.state.count > 0 && `(${loc.state.count})`}
        </span>
        <div className='px-4 pt-2'>
          <GivList query={searchParams} showViewMore={false} />
        </div>
      </div>
    </div>
  )
}
