import React from 'react'
import GivPrefTagList from 'components/GivPrefTagList'
import UserGivPrefsEditModal from 'components/UserGivPrefsEditModal'
import { useTranslation } from 'react-i18next'

const UserInterests = ({ user, type = 'send', editable = false }) => {
  const { t } = useTranslation()
  const [editing, setEditing] = React.useState(false)
  let prefMap = {}

  if (!user) return null
  const prefs = (user?.givPrefs || []).filter(i => i.givType === type)
  prefs.forEach(s => (prefMap[s.id] = true))
  return (
    <div className='mt-4'>
      <UserGivPrefsEditModal
        type={type}
        userPrefs={prefMap}
        id={user.id}
        editing={editing}
        setEditing={setEditing}
      />
      <div className='mb-1 px-4 border-b flex items-center justify-between'>
        <span className='font-medium py-2'>{t(`Giv Prefs ${type}`)}</span>

        {editable && (
          <button
            onClick={() => setEditing(true)}
            className='underline pl-4 pr-2 py-2 text-sm text-gray-600 flex leading-none items-center'
          >
            {t('Edit')}
          </button>
        )}
      </div>
      <div className='pl-4 pr-1 pt-2'>
        <GivPrefTagList prefs={prefs} size='large' limit={100} />
      </div>
    </div>
  )
}

export default UserInterests
