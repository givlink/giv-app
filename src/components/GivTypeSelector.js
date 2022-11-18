import { useTranslation } from 'react-i18next'

const GivTypeSelector = ({
  userPrefs = {},
  skillCategories = [],
  allTypes = {},
  handleClick,
}) => {
  const { t, i18n } = useTranslation()
  const tagField = i18n.language === 'en' ? 'tagEn' : 'tag'
  const isSelected = id => userPrefs[id]

  const categoryMap = {
    others: { tag: t('Others'), tagEn: 'Others' },
  }
  skillCategories.forEach(c => (categoryMap[c.id] = c))

  return (
    <div className='text-left pl-3 font-medium text-gray-600 mb-6'>
      <ul className='inline-flex flex-wrap -m-0.5'>
        {Object.values(allTypes).map(s => {
          const selected = isSelected(s.id)
          return (
            <button
              key={s.id}
              className={`${
                selected
                  ? 'bg-giv-blue text-white border-giv-blue-dark'
                  : 'text-gray-900 border-gray-300'
              } m-0.5 rounded-full leading-none text-white border text-xs px-3 py-2 text-center`}
              onClick={() => handleClick(s.id, !selected)}
            >
              {s[tagField]}
            </button>
          )
        })}
      </ul>
    </div>
  )
}

export default GivTypeSelector
