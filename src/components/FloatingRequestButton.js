import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import Spinner from 'components/Spinner'
import { ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/outline'
import { UploadIcon } from '@heroicons/react/solid'
import api from 'lib/api'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const RequestModal = ({ open, setOpen, userId }) => {
  const { t } = useTranslation()
  const user = useSelector(s => s.authUser)
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const closeModal = () => {
    if (sent) {
      setSent(false) //reset
    }
    setOpen(false)
  }
  const sendRequest = async type => {
    setLoading(true)
    let senderId
    let receiverId
    if (type === 'send') {
      senderId = user.uid
      receiverId = userId
    }
    if (type === 'receive') {
      senderId = userId
      receiverId = user.uid
    }
    await api.createGivRequest(senderId, receiverId, type)
    setSent(true)
    setLoading(false)
  }
  return (
    <Transition appear show={open} as={React.Fragment}>
      <Dialog
        as={React.Fragment}
        static
        className='fixed inset-0 z-20 overflow-hidden'
        onClose={closeModal}
      >
        <div className='min-h-screen h-full text-center'>
          <Transition.Child
            as={React.Fragment}
            enter='transition ease-out duration-150'
            enterFrom=''
            enterTo=''
            leave='transition ease-in duration-100'
            leaveFrom=''
            leaveTo=''
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-900 opacity-75' />
          </Transition.Child>

          <div className='fixed left-0 right-0 bottom-0'>
            <Transition.Child
              enter='ease-out duration-300 transform z-20'
              enterFrom='opacity-50 translate-y-12 z-20'
              enterTo='opacity-100 translate-y-0 z-20'
              leave='ease-in duration-100 transform z-20'
              leaveFrom='opacity-100 translate-y-2'
              leaveTo='opacity-50 translate-y-6'
            >
              <div className='inline-block w-full text-left align-middle transition-all transform bg-white shadow-xl rounded-sm'>
                <Dialog.Title
                  as='h3'
                  className='relative px-4 pt-4 pb-3 font-medium leading-6 flex items-center justify-center'
                >
                  <button
                    onClick={closeModal}
                    className='-mt-4 mr-0.5 absolute right-0 top-0 flex items-center justify-center border bg-white rounded-full shadow p-2 focus:outline-none'
                  >
                    <ChevronDownIcon className='h-6 w-6' />
                  </button>
                  <img
                    className='w-10 h-10 mr-3 animate-wobble opacity-75'
                    src='/icons/tama_def.png'
                    alt=''
                  />
                  <span className='text-giv-blue text-lg font-medium'>
                    {t('Send Request')}
                  </span>
                  <img
                    className='w-10 h-10 ml-3 animate-wobble opacity-75'
                    src='/icons/piyo_def.png'
                    alt=''
                  />
                </Dialog.Title>
                <div className='mt-6 space-y-2 px-6 pt-3 pb-8'>
                  {loading ? (
                    <div className='mb-12'>
                      <Spinner />
                    </div>
                  ) : sent ? (
                    <div className='mb-12 flex -ml-1 items-center justify-center'>
                      <CheckCircleIcon className='text-giv-blue h-8 w-8 mr-1' />
                      <span className='font-medium text-giv-blue-dark text-sm'>
                        {t('Request sent')}
                      </span>
                    </div>
                  ) : (
                    <>
                      <button
                        onClick={() => sendRequest('send')}
                        className='text-sm font-medium block w-full rounded px-8 py-3 shadow bg-giv-blue text-white flex items-center justify-center'
                      >
                        <span className='ml-3'>{t('Want to Send')}</span>
                        <UploadIcon className='h-6 w-6 rotate-90 transform ml-3' />
                      </button>
                      <button
                        onClick={() => sendRequest('receive')}
                        className='text-sm font-medium block w-full rounded px-8 py-3 shadow bg-giv-blue text-white flex items-center justify-center'
                      >
                        <UploadIcon className='h-6 w-6 mr-3 -rotate-90 transform' />

                        <span className='mr-3'>{t('Want to Receive')}</span>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}
const FloatingRequestButton = ({ userId }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <div>
      <RequestModal userId={userId} open={open} setOpen={setOpen} />
      <button
        onClick={() => setOpen(true)}
        className='fixed bottom-0 right-0 bg-giv-blue text-white text-xl p-6 rounded-full shadow-2xl mr-3 mb-5 font-bold tracking-wide active:translate-y-1 transform focus:outline-none'
      >
        giv
      </button>
    </div>
  )
}

export default FloatingRequestButton
