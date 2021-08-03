import utils from 'lib/utils'
import React from 'react'
import { Link } from '@reach/router'
import SafeImage from 'components/SafeImage'
import Spinner from 'components/Spinner'
import Error from 'components/Error'
import api from 'lib/api'
import { Dialog, Transition } from '@headlessui/react'
import { CalendarIcon } from '@heroicons/react/outline'
import { Trans, useTranslation } from 'react-i18next'

const AcceptRequestModal = ({ request, requester, open, setOpen }) => {
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const ref = React.useRef(null)
  const { t } = useTranslation()

  const closeModal = () => {
    setError(null)
    setOpen(false)
  }
  const onAccept = async () => {
    setError(null)
    setLoading(true)

    try {
      await api.acceptGivRequest(request.id)
      // await api.mock({ fail: false });
      setSent(true)
    } catch (err) {
      setError(err.message)
    }
    setLoading(false)
  }

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog
        as='div'
        static
        className='fixed z-10 inset-0 overflow-y-auto'
        initialFocus={ref}
        open={open}
        onClose={closeModal}
      >
        <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center'>
          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-150'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity' />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className='hidden sm:inline-block sm:align-middle sm:h-screen'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-150'
            enterFrom='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
            enterTo='opacity-100 translate-y-0 sm:scale-100'
            leave='ease-in duration-100'
            leaveFrom='opacity-100 translate-y-0 sm:scale-100'
            leaveTo='opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95'
          >
            <div className='inline-block align-bottom bg-white rounded-lg px-4 text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-lg w-full py-6'>
              <div className='sm:flex sm:items-start'>
                <div className='mt-3 text-center sm:mt-0 flex'>
                  {sent ? (
                    <div className='w-full flex items-center justify-center'>
                      <img
                        className='h-14 w-14 animate-wobble-slow'
                        src='/icons/tama_def.png'
                        alt='tama'
                      />
                      <span className='mx-2 text-center text-sm leading-none text-giv-blue font-bold'>
                        {t('Request Accepted')}
                      </span>
                      <img
                        className='h-14 w-14 animate-wobble-slow'
                        src='/icons/piyo_def.png'
                        alt='poyo'
                      />
                    </div>
                  ) : (
                    <>
                      <SafeImage
                        src={utils.parseUrl(requester?.photoURL)}
                        className='flex-shrink-0 object-cover h-20 w-20 text-white rounded shadow-xl'
                        classNameFallback='w-20 opacity-50'
                      />
                      <div ref={ref} className='flex flex-col items-start ml-3'>
                        <Dialog.Title
                          as='h3'
                          className='text-lg leading-6 font-medium text-gray-900'
                        >
                          {requester.name}
                        </Dialog.Title>
                        <p className='text-sm text-left text-gray-500 mt-1'>
                          {t('acceptDetail', { name: requester.name })}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
              {loading ? (
                <div className='h-24 flex items-center justify-center'>
                  <Spinner />
                </div>
              ) : sent ? (
                <>
                  <div className='pt-4 pb-2 flex items-center justify-center'>
                    <span className='font-medium text-giv-blue-dark text-sm'>
                      <Trans i18nKey='requestAcceptedMessage' />
                    </span>
                  </div>
                  <button
                    type='button'
                    className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
                    onClick={closeModal}
                  >
                    {t('Close')}
                  </button>
                </>
              ) : (
                <div className='mt-5 sm:mt-4 max-w-sm mx-auto'>
                  <div className='flex justify-center'>
                    {<Error error={error} />}
                  </div>
                  <button
                    type='button'
                    className='w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-giv-blue text-base font-medium text-white hover:bg-giv-blue-dark focus:outline-none'
                    onClick={onAccept}
                  >
                    {t('Accept')}
                  </button>
                  <button
                    type='button'
                    className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
                    onClick={closeModal}
                  >
                    {t('Back')}
                  </button>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default function RequestListCard({ request }) {
  const [open, setOpen] = React.useState(false)
  const { t } = useTranslation()
  const { type, sender, receiver } = request

  let requester
  let msg = ''
  if (type === 'send') {
    requester = sender
    msg = t('wantSendRequest', { name: requester.name })
  }
  if (type === 'receive') {
    requester = receiver
    msg = t('wantReceiveRequest', { name: requester.name })
  }
  if (!requester) return null

  const completed = request.status === 'match'

  return (
    <div className='border-b border-gray-300 mx-1.5 bg-white'>
      <AcceptRequestModal
        request={request}
        open={open}
        setOpen={setOpen}
        requester={requester}
      />
      <div className='flex space-x-3 pt-2 pb-3 px-3'>
        <SafeImage
          src={utils.parseUrl(requester?.photoURL)}
          alt='Sender'
          className='h-16 w-16 object-cover border-2 border-gray-500 rounded-full'
          classNameFallback='w-12 object-cover rounded-full'
        />
        <div className='flex flex-col pt-1'>
          <span className='text-base font-medium pb-1'>{requester?.name}</span>
          <p className='text-sm text-gray-600'>{msg}</p>

          <span className='block flex justify-end items-center text-gray-500 text-xs pt-1'>
            <CalendarIcon className='h-4 w-4 mr-1.5 text-gray-400' />
            {utils.parseDate(request.createdAt)}
          </span>
        </div>
      </div>
      <div className='flex items-center justify-between text-xs px-2 mt-0.5 mb-1.5'>
        <Link
          to={`/users/${requester.id}`}
          className='border border border-gray-300 rounded-full px-4 py-1.5'
        >
          {t('View Profile')}
        </Link>
        <button
          disabled={completed}
          onClick={() => setOpen(true)}
          className={`text-white font-semibold ${
            completed
              ? 'border-transparent bg-gray-300 opacity-75'
              : 'bg-giv-blue border-giv-blue-dark'
          } border rounded-full px-4 py-1.5`}
        >
          {completed ? t('Accepted') : t('Accept Request')}
        </button>
      </div>
    </div>
  )
}
