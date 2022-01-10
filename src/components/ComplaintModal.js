import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { useTranslation } from 'react-i18next'
import { useLocation } from '@reach/router'
import api from 'lib/api'

const Submitted = () => {
  const { t } = useTranslation()
  return <div className='text-center py-10'>{t('reportContentSubmitted')}</div>
}

const ComplaintModal = ({ open, setOpen , contentPathOverride}) => {
  const loc = useLocation()
  const [description, setDescription] = React.useState('')
  const [category, setCategory] = React.useState('spam')
  const [submitted, setSubmitted] = React.useState(false)
  const { t } = useTranslation()
  const cancelButtonRef = React.useRef(null)
  const closeModal = () => setOpen(false)
  const onSubmit = async e => {
    e.preventDefault()
    const payload = {
      description,
      category,
      contentPath: contentPathOverride || loc.pathname,
    }
    await api.reportContent(payload)
    setSubmitted(true)
  }
  const handleChange = e => {
    if (e.target.name === 'category') setCategory(e.target.value)
    if (e.target.name === 'description') setDescription(e.target.value)
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
              {submitted ? (
                <Submitted />
              ) : (
                <div className='mt-3 py-3'>
                  <p>
                    Report issue with this content. We will investigate this
                    issue.
                  </p>
                  <label className='flex flex-col py-3 space-y-1'>
                    <span className='text-sm font-bold text-gray-600'>
                      Complaint Category
                    </span>
                    <select
                      name='category'
                      onChange={handleChange}
                      value={category}
                      className='rounded border border-gray-400'
                    >
                      <option value='spam'>Spam</option>
                      <option value='harrasment'>Harrasment</option>
                      <option value='copyright'>Copyright violation</option>
                      <option value='others'>Something else</option>
                    </select>
                  </label>
                  <label className='flex flex-col py-3 space-y-1'>
                    <span className='text-sm font-bold text-gray-600'>
                      Describe your issue
                    </span>
                    <textarea
                      name='description'
                      value={description}
                      onChange={handleChange}
                      className='rounded border border-gray-400'
                      rows={8}
                    />
                  </label>
                </div>
              )}
              <div className='mt-5 sm:mt-4 sm:flex sm:justify-between'>
                <button
                  type='button'
                  className='mt-3 w-full inline-flex justify-center rounded border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm'
                  ref={cancelButtonRef}
                  onClick={() => setOpen(false)}
                >
                  {t('Back')}
                </button>
                {!submitted && (
                  <button className='mt-3 w-full inline-flex justify-center rounded border border-red-300 shadow-sm px-4 py-2 bg-red-600 text-base font-bold text-white hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm'>
                    {t('Report Content')}
                  </button>
                )}
              </div>
            </form>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
export default ComplaintModal
