import React from "react";
import PostForm from "./PostForm";

export default function PostModal({ post, onSave, onDelete, onCancel }) {
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true">
      <div className="modal">
        <PostForm initialPost={post} onSave={onSave} onDelete={onDelete} onCancel={onCancel} />
      </div>
    </div>
  );
}