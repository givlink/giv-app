import * as icons from '@heroicons/react/24/outline'
import * as iconsSolid from '@heroicons/react/24/solid'

//Refer to https://heroicons.dev for icon names

const sizeClasses = {
  xs: 'h-4 w-4',
  sm: 'h-5 w-5',
  base: 'h-6 w-6',
  md: 'h-7 w-7',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12',
}

export default function Icon({
  name = 'ViewList',
  size = 'base',
  variant = 'outline',
  className = '',
}) {
  const iconMap = variant === 'outline' ? icons : iconsSolid
  const Comp = iconMap[`${name}Icon`] || iconMap['ViewListIcon']
  return <Comp className={`${sizeClasses[size]} ${className}`} />
}
