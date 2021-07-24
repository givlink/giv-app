import { useSelector } from 'react-redux'

const SkillTagList = ({ skills = [], limit = 5, size = 'normal' }) => {
  const skillMap = useSelector((s) => s.skills)

  const renderTag = (s) => {
    const skill = skillMap[s]
    if (!skill) return s
    return skill.tag
  }

  const sizes = {
    normal: 'py-1 px-2 text-xs border-gray-300 rounded',
    medium: 'py-1 px-2 text-sm border-gray-400 rounded-full',
    large: 'py-2 px-3 text-sm border-gray-400 rounded-full',
  }

  const limited = [...skills].slice(0, limit)
  return (
    <ul className="inline-flex flex-wrap -m-0.5">
      {limited.map((s) => (
        <li key={s} className={`m-0.5 text-white border text-gray-900 ${sizes[size]} text-center`}>
          {renderTag(s)}
        </li>
      ))}
    </ul>
  )
}

export default SkillTagList
