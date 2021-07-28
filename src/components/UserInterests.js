import React from "react";
import SkillTagList from "components/SkillTagList";
import UserInterestsEditModal from "components/UserInterestsEditModal";

const UserInterests = ({ user, editable = false }) => {
  const [editing, setEditing] = React.useState(false);
  let skillMap = {};
  user.interests.forEach((s) => (skillMap[s] = true));
  return (
    <div className="mt-4">
      <UserInterestsEditModal
        userSkills={skillMap}
        id={user.id}
        editing={editing}
        setEditing={setEditing}
      />
      <div className="mb-1 px-4 border-b flex items-center justify-between">
        <span className="font-medium py-2">Interests</span>

        {editable && (
          <button
            onClick={() => setEditing(true)}
            className="underline pl-4 pr-2 py-2 text-sm text-gray-600 flex leading-none items-center"
          >
            Edit
          </button>
        )}
      </div>
      <div className="pl-4 pr-1 pt-2">
        <SkillTagList
          skills={user.interests}
          size={user.interests.length > 20 ? "normal" : "large"}
          limit={100}
        />
      </div>
    </div>
  );
};

export default UserInterests;
