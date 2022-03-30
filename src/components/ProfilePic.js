import { useLocation } from '@reach/router'
import { useSelector } from 'react-redux'
import EditProfilePic from 'components/EditProfilePic'
import SafeImage from 'components/SafeImage'

const ProfilePic = props => {
  const loc = useLocation()
  const currUser = useSelector(s => s.user)
  const isMyPage = loc.pathname === `/users/${currUser?.id}`
  return (
    <div>
      <SafeImage
        src={props.src}
        className='h-32 w-32 shadow-xl object-cover object-top rounded-xl mx-auto sm:h-48 sm:w-48 md:h-64 md:w-64'
      />
      {isMyPage && <EditProfilePic user={currUser} />}
    </div>
  )
}

export default ProfilePic
