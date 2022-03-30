import React from 'react'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

//@Todo copy paste
const makeOptions = (map, type, category) => {
  const result = []

  category.forEach(ac => {
    const itemsInCategory = []
    Object.values(map).forEach(i => {
      if (i.category === ac.id) {
        itemsInCategory.push(i)
      }
    })
    const item = [ac, itemsInCategory]
    if (itemsInCategory.length) result.push(item)
  })
  return result
}

const Page3 = ({ activeStepIndex = 0, handleNext }) => {
  const { t, i18n } = useTranslation()
  const [name, setName] = React.useState('')
  const [job, setJob] = React.useState('')
  const [intro, setIntro] = React.useState('')
  const [area, setArea] = React.useState('tokyo')

  const state = useSelector(s => ({
    authLoading: s.authLoading,
    authUser: s.authUser,
    areaCategories: s.areaCategories,
    areaMap: s.areas,
  }))

  const tagField = i18n.language === 'en' ? 'tagEn' : 'tag'

  const handleChange = e => {
    if (e.target.name === 'name') setName(e.target.value)
    if (e.target.name === 'job') setJob(e.target.value)
    if (e.target.name === 'intro') setIntro(e.target.value)
    if (e.target.name === 'area') setArea(e.target.value)
  }

  const isValid = intro !== ''

  const onSubmit = async () => {
    handleNext({
      job,
      name: name || state.authUser?.displayName,
      photoURL: state.authUser?.photoURL || '',
      intro,
      area,
    })
  }

  return (
    <div className='flex-1 flex flex-col w-full px-5'>
      <label className='flex flex-col'>
        <span className='font-medium'>{t('Name')}</span>
        <input
          name='name'
          onChange={handleChange}
          value={name || state.authUser?.displayName}
          placeholder={t('Name')}
          className={`mt-1 text-lg border border-gray-300 py-2 px-3 rounded`}
        />
      </label>
      <label className='mt-6 flex flex-col'>
        <span className='font-medium'>{t('Job')}</span>
        <input
          name='job'
          value={job}
          onChange={handleChange}
          className='mt-1 text-lg border border-gray-300 py-2 px-3 rounded'
        />
      </label>
      <label className='mt-6 flex flex-col'>
        <span className='font-medium'>{t('Area')}</span>
        <select
          name='area'
          value={area}
          onChange={handleChange}
          className='border border-gray-200 rounded h-12 px-3 py-2'
        >
          {makeOptions(state.areaMap, 'area', state.areaCategories).map(
            ([cat, areas]) => {
              return (
                <optgroup key={cat.id} label={cat[tagField]}>
                  {areas.map(s => (
                    <option key={s.id} className='block pl-1 py-1' value={s.id}>
                      {s[tagField]}
                    </option>
                  ))}
                </optgroup>
              )
            },
          )}
        </select>
      </label>
      <label className='mt-6 mb-6 flex-1 flex flex-col'>
        <span className='font-medium'>{t('Intro')}</span>
        <textarea
          name='intro'
          value={intro}
          onChange={handleChange}
          className='h-full resize-none mt-1 text-base border border-gray-300 py-2 px-3 rounded'
        />
      </label>
      <div className='flex items-center justify-center'>
        <button
          onClick={onSubmit}
          disabled={!isValid}
          className={`${
            isValid
              ? 'bg-giv-blue text-white shadow-xl'
              : 'bg-gray-200 text-gray-600 opacity-75'
          } text-sm shadow-xl px-6 py-3 w-2/3 rounded-lg font-medium mt-0 mb-8 transition duration-150`}
        >
          {t('Next')}
        </button>
      </div>
    </div>
  )
}

export default Page3
