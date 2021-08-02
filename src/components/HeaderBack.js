import { ChevronLeftIcon } from '@heroicons/react/outline'
import React from 'react'
import { useInView } from 'react-intersection-observer'
import { Transition } from '@headlessui/react'
import { useTranslation } from 'react-i18next'

const FloatingBackHeader = () => {
  return (
    <Transition
      as={React.Fragment}
      appear={true}
      show={true}
      enter='transform transition duration-[500ms]'
      enterFrom='opacity-0 -translate-y-3'
      enterTo='opacity-100 translate-y-0'
      leave='transform duration-200 transition ease-in-out'
      leaveFrom='opacity-100'
      leaveTo='opacity-0'
    >
      <header className='z-10 px-3 py-2 mb-3 fixed top-0'>
        <button
          onClick={() => window.history.go(-1)}
          className='focus:translate-y-1 transform h-10 w-10 flex items-center justify-center bg-giv-blue text-white rounded-full shadow-xl'
        >
          <Transition.Child
            enter='transform transition duration-[700ms]'
            enterFrom='rotate-180'
            enterTo='rotate-0'
            leave='transform duration-200 transition ease-in-out'
            leaveFrom='rotate-0'
            leaveTo='rotate-90'
          >
            <ChevronLeftIcon className='h-6 w-7' />
          </Transition.Child>
        </button>
      </header>
    </Transition>
  )
}

const BackHeader = React.forwardRef((props, ref) => {
  const { t } = useTranslation()
  return (
    <header
      ref={ref}
      className='z-10 border-b border-gray-200 bg-white px-3 py-2 shadow'
    >
      <button
        onClick={() => window.history.go(-1)}
        className='focus:translate-y-1 transform py-2 flex items-center justify-center bg-white'
      >
        <ChevronLeftIcon className='h-6 w-6 mr-1' />
        <span>{t('Back')}</span>
      </button>
    </header>
  )
})

export default function HeaderBack() {
  const [ref, inView] = useInView({ threshold: 0 })
  return (
    <>
      {!inView && <FloatingBackHeader />}
      <BackHeader ref={ref} />
    </>
  )
}
