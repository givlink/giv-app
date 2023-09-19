import { ChevronLeftIcon, UserCircleIcon } from '@heroicons/react/outline'
import React from 'react'
import { useInView } from 'react-intersection-observer'
import { Dialog, Transition } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import api from 'lib/api'
import SafeImage from 'components/SafeImage'
import utils from 'lib/utils'
import { db } from '../lib/localdb'
import { useLiveQuery } from 'dexie-react-hooks'

const ChatUsersModal = ({ open, setOpen, id }) => {
  const { t } = useTranslation()
  const cancelButtonRef = React.useRef(null)
  const closeModal = () => {
    setOpen(false)
  }

  const members = useLiveQuery(async () => {
    const group = await db.chatGroups.where('id').equals(parseInt(id)).first()

    if (!group) return []

    const result = await Promise.all([
      ...Object.keys(group.members).map(i => api.getCachedProfile(i)),
      ...Object.keys(group.moderators).map(i =>
        api.getCachedProfile(i).then(r => ({ ...r, isModerator: true })),
      ),
    ])
    return result
  }, [id])

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
            <div
              className='inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6 h-full'
              style={{ maxHeight: '50vh' }}
            >
              <div className='sm:flex sm:items-start'>
                <div className='mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left'>
                  <Dialog.Title
                    as='h3'
                    className='text-lg leading-6 font-medium text-gray-900'
                  >
                    {t('Chat Users')}
                  </Dialog.Title>
                </div>
              </div>
              <ul
                className='space-y-1 my-2 px-3 h-full overflow-auto'
                style={{ maxHeight: '40vh' }}
              >
                {members?.map((i, idx) => (
                  <li key={idx}>
                    <div className='py-1 px-3 text-sm bg-gray-50 flex items-center gap-2 rounded'>
                      <span>
                        <SafeImage
                          src={utils.parseUrl(i.photoURL)}
                          alt=''
                          className='h-8 w-8 object-cover rounded-full'
                          classNameFallback='h-8 w-8 object-fit rounded-full'
                        />
                      </span>
                      <div className='flex gap-3 flex-wrap items-center'>
                        <span>{i.name}</span>
                        {i.isModerator && (
                          <span className='text-xs border border-indigo-200 bg-indigo-50 px-2 py-0.5 rounded-full'>
                            {t('Moderator')}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              <div className='mt-5 sm:mt-4 sm:flex sm:flex-row-reverse'>
                <button
                  type='button'
                  className='mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:w-auto sm:text-sm'
                  ref={cancelButtonRef}
                  onClick={() => setOpen(false)}
                >
                  {t('Close')}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
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
  const [showList, setShowList] = React.useState(false)
  const toggleUserList = () => setShowList(true)

  return (
    <header
      ref={ref}
      className='z-10 border-b border-gray-200 bg-white px-3 py-2 shadow'
    >
      <ChatUsersModal
        group={props.group}
        id={props.id}
        open={showList}
        setOpen={setShowList}
      />
      <div className='flex items-center max-w-2xl mx-auto'>
        <button
          onClick={() => window.history.go(-1)}
          className='focus:translate-y-1 transform py-2 flex items-center justify-center bg-white'
        >
          <ChevronLeftIcon className='h-6 w-6 mr-1' />
        </button>
        <div className='flex-1 mr-10 flex flex-col items-center'>
          <h4 className='flex-1 text-center text-sm font-bold'>
            {props.title}
          </h4>
          {props.subText && props.subText()}
        </div>
        <button
          onClick={toggleUserList}
          className='focus:translate-y-1 transform py-2 flex items-center justify-center bg-white'
        >
          <UserCircleIcon className='h-6 w-6 text-giv-blue' />
        </button>
      </div>
    </header>
  )
})

export default function HeaderBack({ id, title, subText }) {
  const [ref, inView] = useInView({ threshold: 0 })
  return (
    <>
      {!inView && <FloatingBackHeader />}
      <BackHeader id={id} ref={ref} title={title} subText={subText} />
    </>
  )
}
