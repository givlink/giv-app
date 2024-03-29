import { useSelector, useDispatch } from 'react-redux'
import React from 'react'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import GivTypeSelector from 'components/GivTypeSelector'
import Spinner from 'components/Spinner'
import api from 'lib/api'
import { useTranslation } from 'react-i18next'

const didChangeValues = (oldVal, newVal) => {
  const before = JSON.stringify(oldVal)
  const after = JSON.stringify(newVal)
  return before !== after
}

const UserGivPrefsEditModal = ({
  type = 'send',
  id,
  editing,
  setEditing,
  userPrefs = {},
}) => {
  const { t } = useTranslation()
  const [selectedTypes, setSelectedTypes] = React.useState(userPrefs)
  const [sending, setSending] = React.useState(false)

  const ref = React.useRef()
  const dispatch = useDispatch()
  const state = useSelector(s => ({
    user: s.userById[id],
    form: s.userEditForm,
    givTypeMap: s.givTypeMap,
  }))
  // console.log(state)

  const closeModal = () => {
    if (sending) return
    setEditing(false)
    dispatch({ type: 'edit_user/reset' })
  }
  const onTypeClick = (id, selected) => {
    const newVal = { ...selectedTypes }
    if (selected) {
      newVal[id] = selected
    } else {
      //remove false keys for easy comparison
      delete newVal[id]
    }
    setSelectedTypes(newVal)
  }

  const didChange = didChangeValues(userPrefs, selectedTypes)
  const onSave = async () => {
    setSending(true)
    try {
      await api.updateCurrentUser({
        givPrefType: type,
        givPrefs: Object.keys(selectedTypes),
      })
      const user = await api.getUserProfile(id, false)
      dispatch({ type: 'edit_user/new_data', user })
      closeModal()
    } catch (err) {
      window.alert(err.message)
    } finally {
      setSending(false)
    }
  }

  return (
    <Transition.Root show={editing} as={React.Fragment}>
      <Dialog
        as='div'
        static
        className='fixed z-10 inset-0 overflow-y-auto'
        initialFocus={ref}
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
              style={{ height: '300px', width: '400px' }}
              className='bg-white overflow-hidden rounded-lg max-w-2xl w-full pt-3 pb-4 text-left shadow-xl transform transition-all'
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
                      {t('Edit Your Giv Type')}
                    </Dialog.Title>
                  </div>
                  <div className='flex-1 flex flex-col mt-5 pb-12 px-3 text-center overflow-auto'>
                    <GivTypeSelector
                      allTypes={state.givTypeMap}
                      userPrefs={selectedTypes}
                      handleClick={onTypeClick}
                    />
                  </div>
                  <div className='fixed bottom-0 w-full border-t border-gray-200 bg-gray-100 px-4 py-3'>
                    <button
                      onClick={onSave}
                      disabled={!didChange}
                      className={`w-full px-5 py-2 font-medium rounded ${
                        didChange
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
export default UserGivPrefsEditModal
