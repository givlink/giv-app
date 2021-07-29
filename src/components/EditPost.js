import React from "react";
import { PencilIcon, PhotographIcon } from "@heroicons/react/outline";
import PostDetailEditModal from "components/PostDetailEditModal";
import PostImagesEditModal from "components/PostImagesEditModal";

export default function EditPost({ id, post }) {
  const [editing, setEditing] = React.useState(false);
  const [editingImage, setEditingImage] = React.useState(false);

  return (
    <div className="flex justify-between mb-4">
      <button
        onClick={() => setEditingImage(true)}
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
      <PostImagesEditModal
        initialImages={post.images}
        editing={editingImage}
        setEditing={setEditingImage}
        id={id}
      />
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
