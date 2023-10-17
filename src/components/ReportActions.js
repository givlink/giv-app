import React from 'react'
import { ExclamationTriangleIcon, NoSymbolIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import ComplaintModal from 'components/ComplaintModal'
import BlockModal from 'components/BlockModal'

export default function ReportActions({ targetUser }) {
  const { t } = useTranslation()
  const state = useSelector(s => ({ user: s.user }))
  const [complaintOpen, setComplaintOpen] = React.useState(false)
  const [blockOpen, setBlockOpen] = React.useState(false)

  return (
    <div className='my-12 flex flex-col items-center space-y-2'>
      <ComplaintModal
        open={complaintOpen}
        setOpen={setComplaintOpen}
        user={state.user}
      />
      <BlockModal open={blockOpen} setOpen={setBlockOpen} user={targetUser} />
      <button
        onClick={() => setComplaintOpen(true)}
        className='group text-gray-600 flex items-center text-xs px-3 py-2 font-medium border border-red-500 hover:bg-red-600 hover:text-white rounded w-48 flex items-center justify-center'
      >
        {t('Report')}
        <ExclamationTriangleIcon className='h-4 w-4 -mb-px ml-1 text-gray-500 group-hover:text-white' />
      </button>
      <button
        onClick={() => setBlockOpen(true)}
        className='group text-gray-600 flex items-center text-xs px-3 py-2 font-medium border border-red-500 hover:bg-red-600 hover:text-white rounded w-48 flex items-center justify-center'
      >
        {t('Block User')}
        <NoSymbolIcon className='h-4 w-4 -mb-px ml-1 text-gray-500 group-hover:text-white' />
      </button>
    </div>
  )
}
