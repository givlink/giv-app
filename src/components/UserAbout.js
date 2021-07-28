import React from "react";
import UserAboutEditModal from "components/UserAboutEditModal";

const UserInterests = ({ user, editable = false }) => {
  const [editing, setEditing] = React.useState(false);
  return (
    <div className="mt-4">
      <UserAboutEditModal
        initialIntro={user.intro}
        id={user.id}
        editing={editing}
        setEditing={setEditing}
      />
      <div className="mb-1 px-4 border-b flex items-center justify-between">
        <span className="font-medium py-2">About</span>

        {editable && (
          <button
            onClick={() => setEditing(true)}
            className="underline pl-4 pr-2 py-2 text-sm text-gray-600 flex leading-none items-center"
          >
            Edit
          </button>
        )}
      </div>
      <div className="pt-2">
        <p className="whitespace-pre-line leading-7 px-4">{user?.intro}</p>
      </div>
    </div>
  );
};

export default UserInterests;
