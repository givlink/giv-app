import Icon from './Icon'
import useOnClickOutside from '../hooks/use-on-click-outside'
import React from 'react'
import * as api from 'lib/api'

const EmojiButton = ({
  icon,
  variant = 'solid',
  onSelect = () => {},
  className = 'text-gray-400 hover:text-giv-blue',
}) => {
  return (
    <button
      onClick={() => onSelect(icon)}
      className={`flex items-center justify-center hover:bg-gray-50 h-10 w-10 ${className}`}
    >
      <Icon name={icon} variant={variant} />
    </button>
  )
}

export default function CommentReaction({ commentId, onSelect = () => {} }) {
  const ref = React.useRef()

  const [open, setOpen] = React.useState(false)

  const _onSelect = v => {
    api.reactOnComment({ commentId, icon: v })
    onSelect(v)
    setOpen(false)
  }

  useOnClickOutside(ref, () => {
    setOpen(false)
  })
  return (
    <div className='relative'>
      {open && (
        <div
          ref={ref}
          className='absolute bottom-full flex gap-1 items-center bg-white border border-gray-200 shadow-xl rounded px-3 py-1'
        >
          <EmojiButton
            onSelect={_onSelect}
            icon='Heart'
            className='text-red-600'
          />
          <EmojiButton
            onSelect={_onSelect}
            icon='ThumbUp'
            className='text-giv-blue-dark'
          />
          <EmojiButton
            onSelect={_onSelect}
            icon='EmojiHappy'
            className='text-giv-blue'
          />
        </div>
      )}
      <button
        onClick={() => setOpen(!open)}
        className='py-1 rounded-full text-xs text-gray-400 hover:text-giv-blue'
      >
        <Icon name='EmojiHappy' size='sm' />
      </button>
    </div>
  )
}
