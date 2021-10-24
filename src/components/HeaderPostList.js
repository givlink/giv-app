import React from 'react'
import { Switch } from '@headlessui/react'
import { useSelector, useDispatch } from 'react-redux'
import { Dialog, Transition } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { ExclamationIcon, CogIcon } from '@heroicons/react/outline'
import actions from 'state/actions'

const groupMap = {
  all: '全体',
  senboku: '泉北ニュータウン',
}

export default function Header() {
  const [open, setOpen] = React.useState(false)
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const state = useSelector(s => ({
    activeGroup: s.activeGroup,
    userLoading: s.userLoading,
    user: s.user,
  }))

  const shouldShowFilter = Object.keys(state.user?.groups || {}).length > 1

  return (
    <div className='mb-16'>
      <SwitchGroupModal
        open={open}
        setOpen={setOpen}
        user={state.user}
        activeGroup={state.activeGroup}
      />
      <header className='z-10 border-b border-gray-200 bg-white px-3 py-2 shadow fixed w-full top-0'>
        <div className='flex items-center justify-between max-w-2xl mx-auto'>
          <img
            width='40'
            src='/image/giv_logo.png'
            alt='Giv'
            className='object-cover'
          />
          {!state.userLoading && shouldShowFilter && (
            <div className='flex items-end mt-2'>
              <button
                className='flex items-center justify-center'
                onClick={() => setOpen(true)}
              >
                <span className='text-xs pt-px text-gray-500'>
                  {t(groupMap[state.activeGroup])}
                </span>
                <CogIcon className='h-4 w-4 text-blue-400 ml-1' />
              </button>
            </div>
          )}
        </div>
      </header>
    </div>
  )
}

const SwitchGroupModal = ({ open, setOpen, user, activeGroup }) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  const cancelButtonRef = React.useRef(null)
  const closeModal = () => setOpen(false)
  const onSwitch = item => {
    closeModal()
    dispatch(actions.switchActiveGroup(item))
    dispatch(actions.loadInitialUsers())
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
            <div className='w-full block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6'>
              <div className='sm:flex sm:items-start'>
                <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg leading-6 font-medium text-gray-900'
                  >
                    {t('Switch Group')}
                  </Dialog.Title>
                </div>
              </div>
              <div className='mt-3 py-3'>
                <ul className='space-y-3 flex flex-col items-center'>
                  {Object.keys(user?.groups || {}).map(item => (
                    <li key={item} className='block w-full max-w-xs'>
                      <button
                        onClick={() => onSwitch(item)}
                        className={`flex items-center border border-giv-blue w-full text-center py-3 uppercase tracking-widest text-sm rounded shadow px-3 ${
                          activeGroup === item
                            ? 'bg-giv-blue text-white'
                            : 'bg-gray-50'
                        }`}
                      >
                        <svg
                          className={`w-6 h-6 -mr-2 ${
                            activeGroup === item
                              ? 'text-white'
                              : 'text-gray-100'
                          }`}
                          fill='none'
                          stroke='currentColor'
                          viewBox='0 0 24 24'
                          xmlns='http://www.w3.org/2000/svg'
                        >
                          <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                          />
                        </svg>
                        <span className='flex-1'>{t(item)}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
                <button
                  type='button'
                  className='mt-3 w-full inline-flex justify-center rounded border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm'
                  ref={cancelButtonRef}
                  onClick={() => setOpen(false)}
                >
                  {t('Back')}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
