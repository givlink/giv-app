import Icon from './Icon'
import useOnClickOutside from '../hooks/use-on-click-outside'
import { useTranslation } from 'react-i18next'
import React from 'react'

const iconClasses = {
  FaceSmile: {
    variant: 'outline',
    className: 'text-giv-blue',
  },
  Heart: {
    variant: 'solid',
    className: 'text-red-600',
  },
  ThumbUp: {
    variant: 'solid',
    className: 'text-giv-blue-dark',
  },
}

export default function CommentReactionList({ reactions = [] }) {
  const { t } = useTranslation()
  const ref = React.useRef()

  const [open, setOpen] = React.useState(false)

  useOnClickOutside(ref, () => setOpen(false))

  if (!reactions) return null

  const iconMap = {}
  reactions.forEach(r => {
    if (!iconMap[r.icon]) {
      iconMap[r.icon] = 0
    }
    iconMap[r.icon] += 1
  })

  return (
    <div className='relative'>
      {open && (
        <div
          ref={ref}
          className='absolute bottom-full w-64 flex flex-col gap-2 bg-white border border-gray-200 shadow-xl rounded px-4 pb-5'
        >
          <div className='flex items-center justify-between pt-2 pb-3'>
            <span className='font-medium text-sm text-gray-500'>
              {t('Reactions')}
            </span>
            <button className='rounded-full p-2' onClick={() => setOpen(false)}>
              <Icon name='XMark' size='xs' />
            </button>
          </div>
          {reactions.map((r, idx) => (
            <div
              key={idx}
              className='flex text-sm items-center justify-between'
            >
              <span>{r.name}</span>
              <Icon name={r.icon} size='sm' {...iconClasses[r.icon]} />
            </div>
          ))}
        </div>
      )}
      <button
        disabled={open}
        onClick={() => setOpen(!open)}
        className='mt-0.5 flex gap-1 items-center opacity-75 hover:opacity-100'
      >
        {Object.entries(iconMap).map(([i, value], idx) => (
          <span
            key={idx}
            className='leading-none text-xs flex items-center rounded-full px-2 py-px'
          >
            <Icon name={i} {...iconClasses[i]} size='sm' />
            <span className='mt-1 pl-1'>{value}</span>
          </span>
        ))}
      </button>
    </div>
  )
}
