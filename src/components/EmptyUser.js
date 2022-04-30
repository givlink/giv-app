import { useTranslation } from 'react-i18next'
const EmptyUser = () => {
  const { t } = useTranslation()
  return (
    <div className='flex flex-col items-center justify-center pt-20'>
      <img
        className='w-24 h-24 animate-wobble-slow opacity-50'
        src='/icons/tama_def_sleepy.png'
        alt=''
      />
      <span className='text-sm text-gray-500 pt-2'>{t('User Not Found')}</span>
    </div>
  )
}

export default EmptyUser
