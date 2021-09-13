import React from 'react'
import { StatusOfflineIcon } from '@heroicons/react/outline'
import { Detector } from 'react-detect-offline'
import { Transition } from '@headlessui/react'
import { useTranslation } from 'react-i18next'

const OfflineBanner = () => {
  const { t } = useTranslation()
  return (
    <Detector
      render={({ online }) => (
        <Transition
          as={React.Fragment}
          appear={true}
          show={!online}
          enter='transform transition duration-300 ease-out-expo'
          enterFrom='-translate-y-1/2 opacity-50'
          enterTo='translate-y-0 opacity-100'
          leave='transform duration-150 transition ease-in'
          leaveFrom='translate-y-0 opacity-100'
          leaveTo='-translate-y-1/2 opacity-0'
        >
          <div className='fixed mt-1 top-0 left-0 right-0 z-50 flex items-center justify-center'>
            <div className='animate-shake bg-white w-2/3 bg-red-700 text-white py-0.5 border border-red-600 rounded-sm shadow font-medium text-xs text-center flex items-center justify-center'>
              <StatusOfflineIcon className='h-6 w-6 mr-2 text-red-100' />
              <span>{t('You are offline')}</span>
            </div>
          </div>
        </Transition>
      )}
    />
  )
}

export default OfflineBanner
