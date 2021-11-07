import React from 'react'
import { useSelector } from 'react-redux'
import UserCircleItem from 'components/UserCircleItem'

export default function Recommendations({ type, label, label2 }) {
  const state = useSelector(s => {
    return {
      recommendations: s.recommendations || {},
      loading: s.recommendationsLoading,
    }
  })

  const getLabel = () => {
    if (label) return label
    switch (type) {
      case 'matchingYourInterests':
        return '受け取ってみませんか？'
      case 'matchingYourSkills':
        return '贈ってみませんか？'
      case 'similarInterests':
        return 'あなたと同じ興味/関心を持つメンバー'
      default:
        return ''
    }
  }

  const getLabel2 = () => {
    if (label2) return label2
    switch (type) {
      case 'matchingYourInterests':
        return 'あなたが興味/関心あるギブを提供できるメンバー'
      case 'matchingYourSkills':
        return 'あなたのギブに興味/関心があるメンバー'
      default:
        return ''
    }
  }

  if (state.loading) return null
  const users = state.recommendations[type] || []
  if (!users.length) return null
  return (
    <div className=''>
      <h3 className='text-sm font-bold'>{getLabel()}</h3>
      <span className='text-giv-blue-dark text-sm font-medium'>{getLabel2()}</span>
      <ul className='grid grid-cols-3 sm:grid-cols-4 gap-3 sm:gap-4'>
        {users.map((item, idx) => (
          <li key={idx}>
            <UserCircleItem user={item} />
          </li>
        ))}
      </ul>
    </div>
  )
}
