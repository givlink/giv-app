import { useDispatch } from 'react-redux'
import React from 'react'
import { ChevronLeftIcon } from '@heroicons/react/outline'
import { Dialog, Transition } from '@headlessui/react'
import Spinner from 'components/Spinner'
import { useTranslation } from 'react-i18next'
import api from 'lib/api'

const UserInterestsEditModal = ({
  id,
  initialIntro = '',
  editing,
  setEditing,
}) => {
  const { t } = useTranslation()
  const ref = React.useRef()
  const [intro, setIntro] = React.useState(initialIntro)
  const [sending, setSending] = React.useState(false)
  const dispatch = useDispatch()

  const closeModal = () => {
    if (sending) return
    setEditing(false)
  }
  const onUpdate = e => {
    setIntro(e.target.value)
  }
  const onSave = async () => {
    setSending(true)
    await api.updateCurrentUser({ intro })
    //@todo err handling
    //update store with new user data , a bit hacky
    const user = await api.getUserProfile(id, false)
    dispatch({ type: 'edit_user/new_data', user })
    setSending(false)
    closeModal()
  }

  return (
    <Transition.Root show={editing} as={React.Fragment}>
      <Dialog
        initialFocus={ref}
        as='div'
        static
        className='fixed z-10 inset-0 overflow-y-auto'
        open={editing}
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
            <div
              style={{ height: '65vh', minWidth: '80vw' }}
              ref={ref}
              className='bg-white max-w-2xl rounded-lg overflow-hidden w-full pt-3 pb-4 text-left shadow-xl transform transition-all'
            >
              {sending ? (
                <button className='flex items-center justify-center h-full w-full'>
                  <Spinner />
                </button>
              ) : (
                <div className='flex flex-col h-full'>
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
                      {t('Edit Your Intro')}
                    </Dialog.Title>
                  </div>
                  <div className='flex-1 flex flex-col mt-5 pb-12 px-3 text-center overflow-auto'>
                    <label className='mb-6 flex-1 flex flex-col items-start'>
                      <textarea
                        value={intro}
                        onChange={onUpdate}
                        placeholder='Your Intro'
                        className='h-full resize-none mt-1 w-full border border-gray-300 px-3 py-2 rounded'
                      />
                    </label>
                  </div>
                  <div className='fixed bottom-0 w-full rounded-b-lg border-t border-gray-200 bg-gray-100 px-4 py-3'>
                    <button
                      onClick={onSave}
                      disabled={sending || intro === initialIntro}
                      className={`w-full px-5 py-2 font-medium rounded ${
                        intro !== initialIntro
                          ? 'bg-giv-blue text-white shadow-xl'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {t('Save')}
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
export default UserInterestsEditModal
