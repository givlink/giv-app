import React from 'react'
import SkillSelector from 'components/SkillSelector'
import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const Page5 = ({ activeStepIndex = 0, handleNext }) => {
  const { t } = useTranslation()
  const [selectedSkills, setSelectedSkills] = React.useState({})

  const state = useSelector(s => ({
    skillMap: s.skills,
    skillCategories: s.skillCategories,
  }))

  const onSubmit = () => {
    handleNext({ interests: Object.keys(selectedSkills) })
  }

  const onSkillClick = (id, selected) => {
    const newSkills = { ...selectedSkills }
    if (selected) {
      newSkills[id] = selected
    } else {
      //remove false keys for easy comparison
      delete newSkills[id]
    }
    setSelectedSkills(newSkills)
  }

  const isValid = Object.keys(selectedSkills).length > 0

  return (
    <div className='flex-1 flex flex-col w-full px-2 overflow-x-hidden'>
      <h4 className='text-center font-bold text-giv-blue-dark mb-6 animate-pulse'>
        {t('Select your Interests')}
      </h4>
      <div className='flex-1 h-full overflow-y-auto overflow-x-hidden'>
        <SkillSelector
          allSkills={state.skillMap}
          skillCategories={state.skillCategories}
          handleClick={onSkillClick}
          userSkills={selectedSkills}
        />
      </div>
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
          {t('Save')}
        </button>
      </div>
    </div>
  )
}

export default Page5
