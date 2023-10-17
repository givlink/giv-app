import { useDispatch } from 'react-redux'
import React from 'react'
import { PlusIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import { useTranslation } from 'react-i18next'
import utils from 'lib/utils'
import { Dialog, Transition } from '@headlessui/react'
import Spinner from 'components/Spinner'
import api from 'lib/api'

const EditModal = ({ user, editing, setEditing }) => {
  const { t } = useTranslation()
  const [newImage, setNewImage] = React.useState(null)
  const [sending, setSending] = React.useState(false)
  const dispatch = useDispatch()

  const closeModal = () => {
    if (sending) return
    setEditing(false)
    setNewImage(null)
    dispatch({ type: 'edit_user/reset' })
  }

  const getSrc = img => {
    return img ? URL.createObjectURL(img) : utils.parseUrl(user.photoURL)
  }

  const handleChange = e => {
    if (!e.target.files.length) return
    const file = e.target.files[0]
    setNewImage(file)
  }
  const onSave = async () => {
    setSending(true)
    await api.updateCurrentUserPhoto(newImage)
    //@todo err handling
    //update store with new user data , a bit hacky
    const newUser = await api.getUserProfile(user.id, false)
    dispatch({ type: 'edit_user/new_data', user: newUser })
    setSending(false)
    setNewImage(null)
    closeModal()
  }

  return (
    <Transition.Root show={editing} as={React.Fragment}>
      <Dialog
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
            <div className='bg-white rounded-lg max-w-2xl w-full pt-3 pb-4 text-left shadow-xl transform transition-all'>
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
                      {t('Change Profile Image')}
                    </Dialog.Title>
                  </div>
                  <div className='py-3 px-1 mb-10'>
                    <img
                      src={getSrc(newImage)}
                      className='rounded shadow md:h-96 md:mx-auto'
                      alt=''
                    />
                    <label
                      className={`flex items-center justify-center ${
                        newImage
                          ? 'py-1 text-sm text-gray-600'
                          : 'border border-giv-blue text-giv-blue py-3 '
                      } px-6 w-full mt-4 rounded font-medium `}
                    >
                      <input
                        onChange={handleChange}
                        type='file'
                        className='hidden'
                        accept='image/*'
                      />
                      <PlusIcon className='mr-1 h-4 w-4' />
                      {newImage ? t('Change') : t('Upload Image')}
                    </label>
                  </div>
                  <div className='fixed bottom-0 w-full border-t border-gray-200 bg-gray-100 rounded px-4 py-1'>
                    <button
                      onClick={onSave}
                      className={`w-full px-5 py-3 font-medium rounded ${
                        newImage
                          ? 'opacity-100 bg-giv-blue text-white'
                          : 'opacity-25'
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

export default function EditUser({ user }) {
  const [editing, setEditing] = React.useState(false)
  const { t } = useTranslation()

  if (!user) return null

  return (
    <div>
      <button
        onClick={() => setEditing(true)}
        className='flex items-center justify-center w-full text-sm py-2'
      >
        {t('Change Image')}
      </button>
      <EditModal editing={editing} setEditing={setEditing} user={user} />
    </div>
  )
}
