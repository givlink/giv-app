import React from 'react'
import UserAboutEditModal from 'components/UserAboutEditModal'
import { useTranslation } from 'react-i18next'

const UserAbout = ({ user, editable = false }) => {
  const [editing, setEditing] = React.useState(false)
  const { t } = useTranslation()
  return (
    <div className='mt-4'>
      <UserAboutEditModal
        initialIntro={user.intro}
        id={user.id}
        editing={editing}
        setEditing={setEditing}
      />
      <div className='mb-1 px-4 border-b flex items-center justify-between'>
        <span className='font-medium py-2'>{t('About')}</span>

        {editable && (
          <button
            onClick={() => setEditing(true)}
            className='underline pl-4 pr-2 py-2 text-sm text-gray-600 flex leading-none items-center'
          >
            {t('Edit')}
          </button>
        )}
      </div>
      <div className='pt-2'>
        <p className='whitespace-pre-line leading-7 px-4 text-sm sm:text-base font-light'>
          {user?.intro}
        </p>
      </div>
    </div>
  )
}

export default UserAbout
