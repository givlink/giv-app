import React from 'react'
import HeaderNotificationList from 'components/HeaderNotificationList'
import { useSelector } from 'react-redux'
import Recommendations from 'components/Recommendations'
import { useTranslation } from 'react-i18next'
import usePreserveScroll from 'hooks/scroll'

const EmptyReccList = () => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col items-center justify-center pt-20'>
      <img
        className='w-24 h-24 animate-wobble-slow opacity-50'
        src='/icons/tama_def_sleepy.png'
        alt=''
      />
      <span className='text-sm text-gray-500 pt-2'>
        {t('No Recommendations Found')}
      </span>
    </div>
  )
}

export default function ReccList() {
  const state = useSelector(s => ({
    recommendations: s.recommendations,
    loading: s.recommendationsLoading,
  }))

  usePreserveScroll('recommendationList')

  return (
    <div className='pb-20'>
      <HeaderNotificationList />
      {!state.loading && Object.keys(state.recommendations).length === 0 && (
        <EmptyReccList />
      )}
      <div className='max-w-2xl mx-auto px-2 pt-5 pb-12 space-y-6'>
        <Recommendations type='matchingYourInterests' />
        <Recommendations type='matchingYourSkills' />
        <Recommendations type='similarInterests' />
      </div>
    </div>
  )
}
