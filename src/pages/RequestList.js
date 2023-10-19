import HeaderRequestList from 'components/HeaderRequestList'
import React from 'react'
import RequestListCard from 'components/RequestListCard'
import Spinner from 'components/Spinner'
import usePreserveScroll from 'hooks/scroll'
import useApi from 'hooks/use-api'

export default function RequestList() {
  const { data, loading } = useApi(
    '/requests',
    {},
    { refreshInterval: 10000 },
  )
  usePreserveScroll('requestList')

  const pendingCount = data?.filter(i => i.status !== 'match').length || 0

  return (
    <div className='pb-20'>
      <HeaderRequestList requestsCount={pendingCount} />
      {loading && <Spinner className='pt-2' />}

      <ul className='max-w-xl pt-3 mx-auto space-y-3'>
        {data?.map(p => {
          return (
            <li key={p.id}>
              <RequestListCard request={p} />
            </li>
          )
        })}

        {!loading && data?.length === 0 && (
          <div className='flex flex-col items-center justify-center py-4'>
            <img
              className='w-16 h-16 animate-wobble-slow'
              src='/icons/tama_def_sleepy.png'
              alt=''
            />
            <span className='text-sm text-gray-500 pt-2'>No new requests</span>
          </div>
        )}
      </ul>
    </div>
  )
}
