import React from 'react'
import { Link } from '@reach/router'
import utils from 'lib/utils'
import SafeImage from 'components/SafeImage'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const randomMatchingSkill = user => {
  if (!user || !user.skills || !user.skills.length) {
    return ''
  }
  //random from array
  const id = user.skills[Math.floor(Math.random() * user.skills.length)]
  return id
}

export default function UserCircleItem({ user }) {
  const { i18n } = useTranslation()
  const skillMap = useSelector(s => s.skills)

  const tagField = i18n.language === 'en' ? 'tagEn' : 'tag'
  const renderTag = s => {
    const skill = skillMap[s]
    if (!skill) return s
    return skill[tagField]
  }

  return (
    <Link to={`/users/${user?.id}`}>
      <div className='h-48 w-full flex flex-col'>
        <SafeImage
          src={utils.parseUrl(user?.photoURL)}
          className='mx-auto h-full w-full object-cover object-top rounded-md shadow overflow-hidden'
        />
        <div className='h-12 mt-auto flex flex-col items-center'>
          <span className='text-center text-xs pt-2 pb-1 truncate'>
            {utils.snipText(user?.name, 14)}
          </span>

          <span className='rounded-full leading-none text-white border text-gray-900 py-1 px-2 text-xs border-gray-300 text-center'>
            {utils.snipText(renderTag(randomMatchingSkill(user)), 10)}
          </span>
        </div>
      </div>
    </Link>
  )
}
