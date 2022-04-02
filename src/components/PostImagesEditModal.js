import { useDispatch } from 'react-redux'
import React from 'react'
import { PlusIcon, XIcon, ChevronLeftIcon } from '@heroicons/react/outline'
import { Dialog, Transition } from '@headlessui/react'
import Spinner from 'components/Spinner'
import api from 'lib/api'
import utils from 'lib/utils'
import { useTranslation } from 'react-i18next'

const PostImagesEditModal = ({
  id,
  initialImages = [],
  editing,
  setEditing,
}) => {
  const { t } = useTranslation()
  const ref = React.useRef()
  const [images, setImages] = React.useState(initialImages)
  const [sending, setSending] = React.useState(false)
  const dispatch = useDispatch()

  const closeModal = () => {
    if (sending) return
    setEditing(false)
  }
  const deleteImage = idx => {
    const newImages = images.filter((img, i) => idx !== i)
    setImages(newImages)
  }

  React.useEffect(() => {
    setImages(initialImages)
  }, [editing, initialImages])

  const handleChange = e => {
    if (!e.target.files.length) return
    //@Todo multiple file support
    const file = e.target.files[0]
    let isDuplicate = false
    images.forEach(i => {
      if (typeof i !== 'string' && i.name === file.name) isDuplicate = true
    })
    if (!isDuplicate) setImages([...images, file])
  }

  const getKey = i => {
    if (typeof i === 'string') {
      return i
    } else {
      //its a file
      return i.name
    }
  }
  const getSrc = i => {
    if (typeof i === 'string') {
      return utils.parseUrl(i)
    } else {
      //its a file
      return URL.createObjectURL(i)
    }
  }
  const onSave = async () => {
    setSending(true)
    const resp = await api.updatePost({
      id,
      images: images.map(i => {
        if (typeof i === 'string') return i
        return { size: i.size, contentType: i.type }
      }),
    })
    if (resp?.uploadData) {
      await Promise.all(
        resp.uploadData.map((ud, idx) => {
          if (!ud) return Promise.resolve()
          return api.uploadToS3(ud, images[idx])
        }),
      )
    }
    const post = await api.getPostById(id, false)
    dispatch({ type: 'edit_post/new_data', post })
    setSending(false)
    closeModal()
  }

  let isAnyFile = false
  images?.forEach(i => {
    if (typeof i !== 'string') isAnyFile = true
  })
  const didChange = images?.length !== initialImages?.length || isAnyFile
  const isValid = images?.length || false //there should be at least 1 image

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
              style={{ height: '90vh', minWidth: '100vw' }}
              ref={ref}
              className='bg-white rounded-lg overflow-hidden w-full pt-3 pb-4 text-left shadow-xl transform transition-all'
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
                      {t('Edit Images')}
                    </Dialog.Title>
                  </div>
                  <div className='flex-1 grid grid-cols-2 gap-x-3 gap-y-1 mt-5 pb-16 pt-6 pl-5 pr-3 text-center overflow-auto'>
                    {images?.map((i, idx) => {
                      return (
                        <div key={getKey(i)} className='relative'>
                          <button
                            onClick={() => deleteImage(idx)}
                            className='animate-jiggle absolute z-10 top-0 right-0 -mr-2.5 -mt-3 p-1.5 bg-red-500 rounded-full text-red-100 shadow'
                          >
                            <XIcon className='h-4 w-4' />
                          </button>

                          <img
                            className='object-cover rounded-md w-full h-52'
                            src={getSrc(i)}
                            alt=''
                          />
                        </div>
                      )
                    })}
                    <label
                      className={`${
                        images?.length < 3
                          ? 'opacity-100'
                          : 'opacity-25 pointer-events-none'
                      } rounded h-52 shadow bg-gray-50 border-2 border-gray-200 flex flex-col items-center justify-center`}
                    >
                      <input
                        onChange={handleChange}
                        type='file'
                        className='hidden'
                        accept='image/*'
                      />
                      <PlusIcon className='h-6 w-6 text-gray-500' />
                      <span className='text-sm text-gray-600 mt-2'>
                        {t('Upload Image')}
                      </span>
                    </label>
                  </div>
                  <div className='fixed bottom-0 w-full border-t border-gray-200 bg-gray-100 px-4 py-3'>
                    {!isValid && (
                      <span className='block text-red-600 pb-2 animate-shake text-center'>
                        {t('Must have at least 1 image')}
                      </span>
                    )}
                    <button
                      onClick={onSave}
                      disabled={sending || !didChange || !isValid}
                      className={`w-full px-5 py-2 font-medium rounded ${
                        didChange && isValid
                          ? 'bg-giv-blue text-white shadow-xl'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {t('Save Images')}
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
export default PostImagesEditModal
