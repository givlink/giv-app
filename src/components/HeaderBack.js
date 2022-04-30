import { ChevronLeftIcon, BanIcon } from '@heroicons/react/outline'
import React from 'react'
import { useSelector } from 'react-redux'
import { useInView } from 'react-intersection-observer'
import ComplaintModal from 'components/ComplaintModal'
import { Transition } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
function goBack(fallbackUrl = '/') {
  fallbackUrl = fallbackUrl || '/'
  const prevPage = window.location.href

  window.history.go(-1)

  setTimeout(function () {
    if (window.location.href === prevPage) {
      window.location.href = fallbackUrl
    }
  }, 500)
}

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
          onClick={goBack}
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

const ComplaintButton = props => {
  const { t } = useTranslation()
  const [open, setOpen] = React.useState(false)
  const state = useSelector(s => ({ user: s.user }))
  return (
    <div>
      <ComplaintModal open={open} setOpen={setOpen} user={state.user} />
      <button
        onClick={() => setOpen(true)}
        className='text-gray-600 flex items-center text-xs pl-3 pr-1 py-2 font-medium hover:bg-gray-100 rounded'
      >
        {t('Report')}
        <BanIcon className='h-4 w-4 -mb-px ml-1 text-gray-500' />
      </button>
    </div>
  )
}

const BackHeader = React.forwardRef((props, ref) => {
  const { showComplaintButton = false } = props
  const { t } = useTranslation()

  return (
    <header
      ref={ref}
      className='z-10 border-b border-gray-200 bg-white px-3 py-2 shadow'
    >
      <div className='flex items-center justify-between max-w-2xl mx-auto'>
        <button
          onClick={goBack}
          className='focus:translate-y-1 transform py-2 flex items-center justify-center bg-white'
        >
          <ChevronLeftIcon className='h-6 w-6 mr-1' />
          <span>{t('Back')}</span>
        </button>
        {showComplaintButton && <ComplaintButton />}
      </div>
    </header>
  )
})

export default function HeaderBack(props) {
  const [ref, inView] = useInView({ threshold: 0 })
  return (
    <>
      {!inView && <FloatingBackHeader />}
      <BackHeader ref={ref} {...props} />
    </>
  )
}
