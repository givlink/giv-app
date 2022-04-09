import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon } from '@heroicons/react/outline'
const ImageModal = ({ open, setOpen, src }) => {
  const cancelButtonRef = React.useRef(null)
  const closeModal = () => setOpen(false)
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
          <Transition.Child as={React.Fragment}>
            <Dialog.Overlay className='fixed inset-0 bg-gray-500 opacity-75 transition-opacity' />
          </Transition.Child>
          {/* This element is to trick the browser into centering the modal contents. */}
          <span
            className='hidden sm:inline-block sm:align-middle sm:h-screen'
            aria-hidden='true'
          >
            &#8203;
          </span>
          <Transition.Child as={React.Fragment}>
            <div className='z-10'>
              <img src={src} alt='' className='h-full w-full rounded' />
              <div>
                <button
                  onClick={closeModal}
                  className='mt-2 bg-white rounded-full p-2'
                >
                  <XIcon className='h-8 w-8 text-gray-600' />
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default function MessageImageView({ src }) {
  const [open, setOpen] = React.useState(false)
  return (
    <>
      <ImageModal src={src} open={open} setOpen={setOpen} />
      <button onClick={() => setOpen(true)}>
        <img
          src={src}
          alt=''
          style={{ maxHeight: '140px', maxWidth: '160px' }}
          className='rounded shadow object-cover'
        />
      </button>
    </>
  )
}
