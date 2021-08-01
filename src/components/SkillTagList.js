import { useSelector } from 'react-redux'
import { useTranslation } from 'react-i18next'

const SkillTagList = ({ skills = [], limit = 5, size = 'normal' }) => {
  const { t, i18n } = useTranslation()
  const skillMap = useSelector(s => s.skills)

  const tagField = i18n.language === 'en' ? 'tagEn' : 'tag'
  const renderTag = s => {
    const skill = skillMap[s]
    if (!skill) return s
    return skill[tagField]
  }

  const sizes = {
    normal: 'py-1 px-2 text-xs border-gray-300',
    medium: 'py-1 px-2 text-sm border-gray-400',
    large: 'py-1.5 px-3 text-sm border-gray-400',
  }

  const limited = [...skills].slice(0, limit)
  return (
    <ul className='inline-flex flex-wrap -m-0.5'>
      {limited.map(s => (
        <li
          key={s}
          className={`m-0.5 rounded-full leading-none text-white border text-gray-900 ${sizes[size]} text-center`}
        >
          {renderTag(s)}
        </li>
      ))}
    </ul>
  )
}

export default SkillTagList
