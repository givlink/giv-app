import { useDispatch } from 'react-redux'
import React from 'react'
import utils from 'lib/utils'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { useTranslation } from 'react-i18next'
import { Dialog, Transition } from '@headlessui/react'
import Spinner from 'components/Spinner'
import api from 'lib/api'
// import { toast } from "react-hot-toast";

const ConfirmModal = ({ open, setOpen }) => {
  const { t } = useTranslation()
  const ref = React.useRef()
  const [sending, setSending] = React.useState(false)

  const dispatch = useDispatch()

  const closeModal = () => {
    if (sending) return
    setOpen(false)
  }

  const onSave = async () => {
    setSending(true)
    await api.pauseGivActivity()
    //@todo err handling
    const user = await api.getMyProfile()
    dispatch({ type: 'edit_user/new_data', user })
    setSending(false)
    closeModal()
  }

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog
        as='div'
        initialFocus={ref}
        static
        className='fixed z-10 inset-0 overflow-y-auto'
        open={open}
        onClose={closeModal}
      >
        <div className='flex items-center justify-center overflow-hidden min-h-screen pt-4 px-4 pb-20 text-center'>
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
            <div
              style={{ minHeight: '200px' }}
              className='bg-white rounded-lg overflow-hidden max-w-md w-full pt-3 pb-4 text-left shadow-xl transform transition-all'
            >
              {sending ? (
                <button className='flex items-center justify-center h-full w-full'>
                  <Spinner />
                </button>
              ) : (
                <div className='flex flex-col overflow-hidden h-full'>
                  <div className='flex items-center mx-2'>
                    <button
                      type='button'
                      className='shadow-lg inline-flex justify-center rounded-full border border-transparent shadow-sm p-1 bg-gray-300 text-base font-medium text-gray-500 hover:bg-gray-400 focus:outline-none'
                      onClick={closeModal}
                    >
                      <ChevronLeftIcon className='h-5 w-5' />
                    </button>
                    <Dialog.Title
                      as='h3'
                      className='flex-1 text-center mr-4 text-base leading-6 font-medium text-gray-900'
                    >
                      {t('Pause Giv Activity')}
                    </Dialog.Title>
                  </div>

                  <p className='text-sm px-8 pt-4 font-medium'>
                    {t('Pause Description')}
                  </p>
                  <div className='fixed bottom-0 w-full rounded-b-lg border-t border-gray-200 bg-gray-100 px-4 py-3 flex gap-4'>
                    <button
                      type='button'
                      className='w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none'
                      onClick={closeModal}
                    >
                      {t('Back')}
                    </button>
                    <button
                      type='button'
                      className='w-full inline-flex text-base justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-giv-blue font-medium text-white hover:bg-giv-blue-dark focus:outline-none'
                      onClick={onSave}
                    >
                      {t('Pause')}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default function PauseGivActivity({ user, editable = false }) {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const [confirmOpen, setConfirmOpen] = React.useState(false)
  const [sending, setSending] = React.useState(false)

  const handleUnpause = async () => {
    setSending(true)
    await api.unpauseGivActivity()
    //@todo err handling
    const user = await api.getMyProfile()
    dispatch({ type: 'edit_user/new_data', user })
    setSending(false)
  }

  if (!user) return null
  if (sending) return null
  const isPaused = !!user.pauseTime
  return (
    <div className='pt-5'>
      {isPaused ? (
        <div className='flex flex-wrap'>
          <span>
            {t('Giv is Paused', { date: utils.parseDate(user.pauseTime, 30) })}
          </span>
          {editable && (
            <button onClick={handleUnpause} className='underline pl-1'>
              {t('Unpause Giv Activity')}
            </button>
          )}
        </div>
      ) : (
        editable && (
          <div>
            <button onClick={() => setConfirmOpen(true)} className='underline'>
              {t('Pause Giv Activity')}
            </button>

            <ConfirmModal
              open={confirmOpen}
              setOpen={setConfirmOpen}
              user={user}
            />
          </div>
        )
      )}
    </div>
  )
}
