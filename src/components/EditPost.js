import React from "react";
import { PencilIcon, PhotographIcon } from "@heroicons/react/outline";
import PostDetailEditModal from "components/PostDetailEditModal";

export default function EditPost({ id, post }) {
  const [editing, setEditing] = React.useState(false);

  return (
    <div className="flex justify-between mb-4">
      <button
        onClick={() => setEditing(true)}
        className="underline flex items-center underline rounded pr-4 py-1.5 text-sm font-medium leading-none"
      >
        <PhotographIcon className="h-5 w-5 mr-1" />
        Edit Image
      </button>
      <button
        onClick={() => setEditing(true)}
        className="underline flex items-center underline rounded pl-4 py-1.5 text-sm font-medium leading-none"
      >
        <PencilIcon className="h-4 w-4 mr-1" />
        Edit Post
      </button>
      <PostDetailEditModal
        initialTitle={post.title}
        initialMessage={post.message}
        editing={editing}
        setEditing={setEditing}
        id={id}
      />
    </div>
  );
}
