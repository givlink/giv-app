import { useSelector } from 'react-redux'
import React from 'react'
import {
  PlusIcon,
  XMarkIcon,
  ChevronLeftIcon,
} from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'
import { navigate } from '@reach/router'
import Spinner from 'components/Spinner'
import Steps from 'components/InviteSteps'
import api from 'lib/api'
import { useTranslation } from 'react-i18next'

const Modal = ({ open, setOpen, giv, giver, markRead }) => {
  const { t } = useTranslation()
  const state = useSelector(s => ({
    activeGroup: s.activeGroup,
  }))
  const ref = React.useRef()
  const [step, setStep] = React.useState(0)
  const [post, setPost] = React.useState(null)
  const [images, setImages] = React.useState([])
  const [title, setTitle] = React.useState('')
  const [message, setMessage] = React.useState('')
  const [sending, setSending] = React.useState(false)

  const closeModal = () => {
    if (sending) return
    if (step === 2) return //since complete
    setOpen(false)
  }
  const goBack = () => {
    if (step === 1) {
      setStep(0)
    } else {
      closeModal()
    }
  }
  const onChange = e => {
    if (e.target.name === 'title') setTitle(e.target.value)
    if (e.target.name === 'message') setMessage(e.target.value)
  }

  const handleFileChange = e => {
    if (!e.target.files.length) return
    //@Todo multiple file support
    const file = e.target.files[0]
    let isDuplicate = false
    images.forEach(i => {
      if (i.name === file.name) isDuplicate = true
    })
    if (!isDuplicate) setImages([...images, file])
  }
  const deleteImage = idx => {
    const newImages = images.filter((img, i) => idx !== i)
    setImages(newImages)
  }

  const onNext = async () => {
    if (step === 0) {
      setStep(1)
    } else {
      setSending(true)

      const data = {
        title,
        message,
        images,
        giv,
        giver,
        activeGroup: state.activeGroup,
      }
      //@todo err handling
      const p = await api.createPost(data)
      markRead()
      setSending(false)
      setPost(p)
      setStep(2)
      //reset everything
      setTitle('')
      setMessage('')
      setImages([])
    }
  }

  const isValid = () => {
    if (step === 0) {
      return title !== '' && message !== ''
    }
    if (step === 1) {
      return images.length > 0
    }

    return false
  }

  return (
    <Transition.Root show={open} as={React.Fragment}>
      <Dialog
        initialFocus={ref}
        as='div'
        static
        className='fixed z-10 inset-0 overflow-y-auto'
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
            <div
              style={{ height: step === 2 ? '30vh' : '85vh', minWidth: '90vw' }}
              ref={ref}
              className='bg-white rounded-lg overflow-hidden max-w-2xl w-full pt-3 pb-4 text-left shadow-xl transform transition-all'
            >
              {sending ? (
                <button className='flex items-center justify-center h-full w-full'>
                  <Spinner />
                </button>
              ) : (
                <div className='flex flex-col h-full'>
                  <div className='flex items-center mx-2'>
                    {step <= 1 && (
                      <button
                        type='button'
                        className='shadow-lg inline-flex justify-center rounded-full border border-transparent shadow-sm p-1 bg-gray-300 text-base font-medium text-gray-500 hover:bg-gray-400 focus:outline-none'
                        onClick={goBack}
                      >
                        <ChevronLeftIcon className='h-5 w-5' />
                      </button>
                    )}
                    <Dialog.Title
                      as='h3'
                      className='flex-1 text-center mr-4 text-sm leading-6 font-medium text-gray-900'
                    >
                      {step === 0 &&
                        t('Create Post Modal Title', { name: giver?.name })}
                      {step === 1 && t('Upload Images (Upto 3)')}
                    </Dialog.Title>
                  </div>
                  <div
                    className={`flex-1 flex flex-col mt-5 ${
                      step === 2 ? 'pb-4' : 'pb-12'
                    } px-3 text-center overflow-auto`}
                  >
                    {step === 2 && (
                      <div className='flex flex-col items-center justify-center flex-1'>
                        <div className='w-full flex items-center justify-center'>
                          <img
                            className='h-12 w-12 animate-wobble-slow'
                            src='/icons/tama_def.png'
                            alt='tama'
                          />
                          <span className='mx-2 text-center text-sm leading-none text-giv-blue font-bold'>
                            {t('Post Created')}
                          </span>
                          <img
                            className='h-12 w-12 animate-wobble-slow'
                            src='/icons/piyo_def.png'
                            alt='poyo'
                          />
                        </div>
                        <button
                          onClick={() => {
                            markRead()
                            navigate(`/posts/${post?.id}`)
                          }}
                          className='mt-12 text-base font-medium block w-2/3 rounded px-8 py-3 shadow bg-giv-blue text-white flex items-center justify-center'
                        >
                          {t('View Post')}
                        </button>
                      </div>
                    )}
                    {step === 0 && (
                      <>
                        <label className='flex flex-col items-start'>
                          <span className='text-sm text-gray-800 font-medium'>
                            {t('Title')}
                          </span>
                          <input
                            value={title}
                            name='title'
                            onChange={onChange}
                            placeholder={t('TitlePlaceholder')}
                            className='mt-1 w-full border border-gray-300 px-3 py-2 rounded'
                          />
                        </label>
                        <label className='mt-4 mb-6 flex-1 flex flex-col items-start'>
                          <span className='text-sm text-gray-800 font-medium'>
                            {t('Message')}
                          </span>
                          <textarea
                            name='message'
                            value={message}
                            onChange={onChange}
                            placeholder='以下を内容等を参考に自由に書いてね！
-このgivを受け取った理由や背景
-実際givを受けてみた感想
-givを受けた後の結果や周囲の評価
-どんな人にこのgivが適しているか等'
                            className='h-full resize-none mt-1 w-full border border-gray-300 px-3 py-2 rounded'
                          />
                        </label>
                      </>
                    )}
                    {step === 1 && (
                      <div className='flex-1 grid grid-cols-2 gap-x-3 gap-y-1 mt-5 pb-16 pt-6 pl-5 pr-3 text-center overflow-auto'>
                        {images.map((i, idx) => {
                          return (
                            <div key={i.name} className='relative'>
                              <button
                                onClick={() => deleteImage(idx)}
                                className='animate-jiggle absolute z-10 top-0 right-0 -mr-2.5 -mt-3 p-1.5 bg-red-500 rounded-full text-red-100 shadow'
                              >
                                <XMarkIcon className='h-4 w-4' />
                              </button>

                              <img
                                className='object-cover rounded-md w-full h-52'
                                src={URL.createObjectURL(i)}
                                alt=''
                              />
                            </div>
                          )
                        })}
                        <label
                          className={`${
                            images.length < 3
                              ? 'opacity-100'
                              : 'opacity-25 pointer-events-none'
                          } rounded h-52 shadow bg-gray-50 border-2 border-gray-200 flex flex-col items-center justify-center`}
                        >
                          <input
                            onChange={handleFileChange}
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
                    )}
                    {step === 1 && (
                      <button
                        onClick={onNext}
                        className='pb-8 text-sm text-gray-500'
                      >
                        {t('Skip Images')}
                      </button>
                    )}
                  </div>
                  {step <= 1 && (
                    <div className='fixed bottom-0 w-full rounded-b-lg border-t border-gray-200 bg-gray-100 px-4 py-3'>
                      <div className='pb-3 flex justify-center'>
                        <Steps activeStepIndex={step} steps={[1, 2]} />
                      </div>
                      <button
                        onClick={onNext}
                        disabled={sending || !isValid()}
                        className={`w-full px-5 py-2 font-medium rounded ${
                          isValid()
                            ? 'bg-giv-blue text-white shadow-xl'
                            : 'bg-gray-200 text-gray-600'
                        }`}
                      >
                        {step >= 1 ? t('Create') : t('Next')}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}
export default Modal
