import React from 'react'
import api from 'lib/api'
import { Dialog, Transition } from '@headlessui/react'
import { Trans, useTranslation } from 'react-i18next'
import Error from 'components/Error'
import { useSelector } from 'react-redux'
import Spinner from 'components/Spinner'
import {
  ChevronRightIcon,
  ArrowNarrowRightIcon,
} from '@heroicons/react/outline'
import utils from 'lib/utils'
import SafeImage from 'components/SafeImage'

const doesSkillMatch = (skills = [], interests = []) => {
  let matched
  for (const s of skills) {
    if (interests.includes(s)) {
      matched = s
      break
    }
  }

  return matched
}

const RequestModal = ({
  fromUser,
  toUser,
  open,
  setOpen,
  requestType = 'send',
}) => {
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [sent, setSent] = React.useState(false)
  const ref = React.useRef(null)
  const { t } = useTranslation()

  const closeModal = () => {
    if (loading) {
      return
    }
    setError(null)
    setOpen(false)
  }
  const onAccept = async () => {
    setError(null)
    setLoading(true)

    try {
      await api.createGivRequest(fromUser.id, toUser.id, requestType)
      // await api.mock({ fail: false , fromUserId: fromUser.id, toUserId: toUser.id, requestType})
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
              <div className='sm:flex sm:items-start justify-center'>
                <div className='mt-3 text-center sm:mt-0 flex justify-center'>
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
                        src={utils.parseUrl(
                          requestType === 'send'
                            ? toUser?.photoURL
                            : fromUser?.photoURL,
                        )}
                        className='flex-shrink-0 object-cover h-20 w-20 text-white rounded shadow-xl'
                        classNameFallback='w-20 opacity-50'
                      />
                      <div ref={ref} className='flex flex-col items-start ml-3'>
                        <Dialog.Title
                          as='h3'
                          className='text-lg leading-6 font-medium text-gray-900'
                        >
                          {requestType === 'send' ? toUser.name : fromUser.name}
                        </Dialog.Title>
                        <p className='text-sm text-left text-gray-500 mt-1'>
                          {requestType === 'send'
                            ? t('Send Giv To User', { name: toUser.name })
                            : t('Receive Giv From User', { name: fromUser.name })}
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
                    className='w-full inline-flex text-base justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-giv-blue font-medium text-white hover:bg-giv-blue-dark focus:outline-none'
                    onClick={onAccept}
                  >
                    {t('Send Request')}
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

export default function RequestSugestion({ fromUser, toUser }) {
  const { t, i18n } = useTranslation()
  const state = useSelector(s => {
    return {
      skillMap: s.skills,
      authUser: s.authUser,
    }
  })
  const [loading, setLoading] = React.useState(true)
  const [fromSkills, setFromSkills] = React.useState([])
  const [requestOpen, setRequestOpen] = React.useState(false)
  const [toInterests, setToInterests] = React.useState([])

  const isFromUserCurrentUser = state.authUser.uid === fromUser.id
  const isToUserCurrentUser = state.authUser.uid === toUser.id
  const requestType = isToUserCurrentUser ? 'receive' : 'send'

  const tagField = i18n.language === 'en' ? 'tagEn' : 'tag'
  //@Todo copy paste, refactor
  const renderTag = s => {
    const skill = state.skillMap[s]
    if (!skill) return s
    return skill[tagField]
  }

  React.useEffect(() => {
    if (!fromUser || !toUser) return

    const run = async () => {
      setLoading(true)
      const fromUserProfile = await api.getUserProfile(fromUser.id)
      const toUserProfile = await api.getUserProfile(toUser.id)
      setFromSkills(fromUserProfile.skills)
      setToInterests(toUserProfile.interests)
      setLoading(false)
    }

    run()
  }, [fromUser, toUser])

  if (loading) return null

  const matched = doesSkillMatch(fromSkills, toInterests)

  // if (!matched) return null

  return (
    <>
      <RequestModal
        requestType={requestType}
        fromUser={fromUser}
        toUser={toUser}
        open={requestOpen}
        setOpen={setRequestOpen}
      />
      <div className='h-full'>
        <div className='h-full shadow-md rounded text-sm border border-giv-blue-dark py-1 flex flex-col justify-between'>
          {matched && (
            <div className='flex flex-col items-center justify-center'>
              <span
                className={`rounded-full leading-none text-white border text-gray-900 py-1 px-2 text-xs border-gray-300 text-center`}
              >
                {renderTag(matched)}
              </span>
            </div>
          )}
          <div className='flex items-center justify-between py-2 px-4'>
            <div className='flex-shrink-0 flex flex-col items-start'>
              <SafeImage
                src={utils.parseUrl(fromUser.photoURL)}
                alt=''
                className='h-10 w-10 object-cover rounded-full shadow-xl mb-2'
              />
              {!isFromUserCurrentUser && (
                <span className='text-xs'>
                  {utils.snipText(fromUser.name, 20)}
                </span>
              )}
            </div>
            <ArrowNarrowRightIcon className='flex-shrink-0 w-5 text-gray-300' />
            <div className='flex-shrink-0 flex flex-col items-end'>
              <SafeImage
                src={utils.parseUrl(toUser.photoURL)}
                alt=''
                className='h-10 w-10 object-cover rounded-full shadow-xl mb-2'
              />
              {!isToUserCurrentUser && (
                <span className='text-xs'>
                  {utils.snipText(toUser.name, 20)}
                </span>
              )}
            </div>
          </div>

          <p className='hidden text-xs text-center font-medium mt-3 mb-2'>
            {t('Skills Match Giv Request', { name: toUser.name })}
          </p>
          <div className='py-2 px-2 flex justify-center items-center'>
            <button
              onClick={() => setRequestOpen(true)}
              className='w-full border border-giv-blue text-giv-blue-dark rounded-full font-medium text-xs rounded flex items-center justify-center px-3 py-1 leading-5'
            >
              {requestType === 'send'
                ? t('Send Giv', { name: toUser.name })
                : t('Receive Giv', { name: fromUser.name })}
              <ChevronRightIcon className='h-4 w-4' />
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
