import React from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { XIcon, DownloadIcon } from '@heroicons/react/outline'
import utils from 'lib/utils'

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
          <Transition.Child as={React.Fragment}>
            <div
              className='relative z-10 overflow-hidden flex flex-col items-center justify-center'
              style={{ maxWidth: '95vw', maxHeight: '90vh' }}
            >
              <img
                src={utils.parseUrl(src)}
                alt=''
                className='rounded overflow-hidden mx-auto mt-6'
              />
              <div className='w-full max-w-md flex items-center justify-between'>
                <a
                  href={utils.parseUrl(src)}
                  rel='noreferrer'
                  target='_blank'
                  className='mt-2 bg-white rounded-full p-2'
                >
                  <DownloadIcon className='h-8 w-8 text-gray-600' />
                </a>
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
