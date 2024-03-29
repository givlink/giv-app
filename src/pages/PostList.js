import HeaderPostList from 'components/HeaderPostList'
import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import PostListCard from 'components/PostListCard'
import Spinner from 'components/Spinner'
import actions from 'state/actions'
import usePreserveScroll from 'hooks/scroll'
import { ChevronRightIcon, ArrowDownIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import PullToRefresh from 'react-simple-pull-to-refresh'

const PullDownHandle = () => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col items-center justify-center pb-4'>
      <ArrowDownIcon className='h-7 w-7 text-gray-600' />
      <span className='text-gray-700'>{t('Pull down to refresh')}</span>
    </div>
  )
}
const EmptyPost = () => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col h-96 items-center justify-center py-20'>
      <img
        className='w-24 h-24 animate-wobble-slow opacity-50'
        src='/icons/tama_def_sleepy.png'
        alt=''
      />
      <span className='text-sm text-gray-500 pt-2'>{t('No Posts Found')}</span>
    </div>
  )
}

export default function PostList() {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const { posts, loading, hasMore, loadingMore } = useSelector(s => ({
    posts: s.posts,
    loading: s.postsLoading,
    hasMore: s.postsHasMore,
    loadingMore: s.postsLoadingMore,
  }))

  usePreserveScroll('postList')

  const handleRefresh = () => {
    dispatch(actions.loadInitialPosts())
    return Promise.resolve()
  }

  return (
    <div className='pb-20'>
      <HeaderPostList />
      {loading && <Spinner className='pt-2' />}
      <PullToRefresh
        onRefresh={handleRefresh}
        pullingContent={<PullDownHandle />}
        refreshingContent={<Spinner className='' />}
      >
        <ul className='space-y-2'>
          {posts.map(p => {
            return (
              <li key={p.id}>
                <PostListCard post={p} />
              </li>
            )
          })}
        </ul>
        {posts.length === 0 && !loading && <EmptyPost />}
      </PullToRefresh>
      {hasMore && !loading && (
        <div className='max-w-2xl md:mx-auto flex items-center justify-end mx-2'>
          <button
            disabled={loadingMore}
            className='flex items-center justify-end px-6 w-full md:w-auto border border-gray-400 shadow rounded py-3 my-3'
            onClick={() => dispatch(actions.loadMorePosts())}
          >
            <span className='mr-2 mb-px'>{t('Load More')}</span>
            {loadingMore ? (
              <Spinner size='h-5 w-5' />
            ) : (
              <ChevronRightIcon className='h-5 w-5' />
            )}
          </button>
        </div>
      )}
    </div>
  )
}
