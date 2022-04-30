import React from 'react'
import api from 'lib/api'
import utils from 'lib/utils'
import { Link } from '@reach/router'
import { useTranslation } from 'react-i18next'
import Spinner from 'components/Spinner'
import SafeImage from 'components/SafeImage'
import { ChevronRightIcon } from '@heroicons/react/outline'

const GivCard = ({ post, type = 'receive' }) => {
  let firstImage
  if (post.images && post.images.length) {
    firstImage = post.images[0]
  }

  const renderName = () => {
    let name = ''
    if (type === 'receive') name = post.author.name
    if (type === 'send') name = post.giver.name
    return utils.snipText(name, 15)
  }

  return (
    <Link
      to={`/posts/${post.id}`}
      className='flex flex-col items-center justify-center'
    >
      <SafeImage
        src={utils.parseUrl(firstImage)}
        alt=''
        className='h-32 md:h-64 w-full object-cover rounded-md shadow-lg'
        classNameFallback='w-32 h-32 opacity-25 object-fit rounded-md shadow'
      />
      <span className='block mt-1 text-sm'>{renderName()}</span>
    </Link>
  )
}

const EmptyGivList = () => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col items-center justify-center py-4'>
      <img
        className='w-12 h-12 animate-wobble-slow opacity-50'
        src='/icons/tama_def_sleepy.png'
        alt=''
      />
      <span className='text-xs text-gray-500 pt-2'>{t('No Givs Found')}</span>
    </div>
  )
}

const GivList = ({ userId, type = 'receive', showViewMore = true, limit }) => {
  const { t } = useTranslation()
  const [givs, setGivs] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (!userId) return
    const run = async () => {
      //@Todo err handling
      //@Todo pagination??
      let givs
      if (type === 'receive') {
        givs = await api.getUserReceivedPosts(userId, limit)
      } else {
        givs = await api.getUserPosts(userId, limit)
      }
      try {
        givs.sort((a, b) => {
          return a.createdAt > b.createdAt ? 1 : -1
        })
      } catch (err) {}
      setGivs(givs)
      setLoading(false)
    }
    run()
  }, [userId, type, limit])

  if (!userId) return <EmptyGivList />
  if (loading) return <Spinner />
  if (!givs.length) return <EmptyGivList />

  return (
    <div>
      <ul className='grid grid-cols-2 gap-x-3 gap-y-5'>
        {givs.map(s => (
          <li key={s.id} className=''>
            <GivCard post={s} type={type} />
          </li>
        ))}
      </ul>

      <div className='max-w-2xl md:mx-auto flex items-center justify-end mx-2'>
        {showViewMore && (
          <Link
            to={`/users/${userId}/posts?type=${type}`}
            className='flex items-center justify-end px-6 w-full md:w-auto border border-gray-400 shadow rounded py-3 my-3'
          >
            <span className='mr-2 mb-px'>{t('Load More')}</span>
            <ChevronRightIcon className='h-5 w-5' />
          </Link>
        )}
      </div>
    </div>
  )
}

export default GivList
