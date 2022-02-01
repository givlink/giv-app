import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { navigate } from '@reach/router'
import api from 'lib/api'

const BlockModal = ({ open, setOpen, user }) => {
  const { t } = useTranslation()
  const cancelButtonRef = React.useRef(null)
  const closeModal = () => setOpen(false)
  const onSubmit = async e => {
    e.preventDefault()
    await api.blockUser(user.id)
    navigate('/')
    window.location.reload()
  }
  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog
        as='div'
        static
        className='fixed z-10 inset-0 overflow-y-auto'
        initialFocus={cancelButtonRef}
        open={open}
        onClose={closeModal}
      >
        <div className='flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0'>
          <Transition.Child
            as={React.Fragment}
            enter='ease-out duration-150'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-100'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-gray-500 opacity-75 transition-opacity' />
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
            <form
              onSubmit={onSubmit}
              className='w-full block sm:inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'
            >
              <div className='sm:flex sm:items-start'>
                <div className='mt-3 text-center sm:mt-0 sm:text-left'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg leading-6 font-medium text-gray-900'
                  >
                    {t('Report Content')}
                  </Dialog.Title>
                </div>
              </div>
              <div className='mt-3 py-3'>
                <p>Are you sure you want to block {user?.name}?</p>
              </div>
              <div className='mt-5 sm:mt-4 sm:flex sm:justify-between'>
                <button
                  type='button'
                  className='mt-3 w-full inline-flex justify-center rounded border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm'
                  ref={cancelButtonRef}
                  onClick={() => setOpen(false)}
                >
                  {t('Back')}
                </button>
                <button className='mt-3 w-full inline-flex justify-center rounded border border-red-300 shadow-sm px-4 py-2 bg-red-600 text-base font-bold text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm'>
                  {t('Block User')}
                </button>
              </div>
            </form>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
export default BlockModal
