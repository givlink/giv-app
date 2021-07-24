import utils from 'lib/utils'
import { Link } from '@reach/router'
import { ChevronRightIcon } from '@heroicons/react/outline'
import SkillTagList from 'components/SkillTagList'


export default function UserListCard({ user }) {
  return (
    <Link to={`/users/${user.id}`}>
      <div className="bg-white flex items-center ml-2 py-3">
        <img
          src={utils.parseUrl(user.photoURL)}
          className="h-20 w-20 object-cover border-2 border-gray-200 mr-2 rounded-full"
        />
        <div>
          <h4 className="font-medium text-lg">{user.name}</h4>
          <SkillTagList skills={user.skills} />
        </div>
      </div>
    </Link>
  )
}
