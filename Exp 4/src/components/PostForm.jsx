import React, { useState } from "react";

export default function PostForm({ initialPost, onSave, onDelete, onCancel }) {
  const [title, setTitle] = useState(initialPost?.title || "");
  const [content, setContent] = useState(initialPost?.content || "");
  const [platform, setPlatform] = useState(initialPost?.platform || "Instagram");
  const [status, setStatus] = useState(initialPost?.status || "Scheduled");
  const [start, setStart] = useState(initialPost?.start?.slice(0,16) || "");
  const [end, setEnd] = useState(initialPost?.end?.slice(0,16) || "");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();
    if (!title.trim()) return setError("Post title is required.");
    if (!start) return setError("Start date and time are required.");
    if (!end) return setError("End date and time are required.");
    if (new Date(end) <= new Date(start)) return setError("End time must be after start time.");

    onSave({
      id: initialPost?.id || crypto.randomUUID(),
      title: title.trim(), content, platform, status,
      start: new Date(start).toISOString().slice(0,19),
      end: new Date(end).toISOString().slice(0,19)
    });
  }

  return (
    <form className="post-form" onSubmit={submit}>
      <h2>{initialPost ? "Edit Post" : "Create Post"}</h2>
      {error && <div className="error">{error}</div>}
      <label>Title<input aria-label="Post title" value={title} onChange={e => setTitle(e.target.value)} /></label>
      <label>Content<textarea aria-label="Post content" value={content} onChange={e => setContent(e.target.value)} /></label>
      <label>Platform<select value={platform} onChange={e => setPlatform(e.target.value)}>
        <option>Instagram</option><option>Facebook</option><option>Twitter/X</option><option>LinkedIn</option>
      </select></label>
      <label>Status<select value={status} onChange={e => setStatus(e.target.value)}>
        <option>Scheduled</option><option>Published</option><option>Draft</option>
      </select></label>
      <label>Start<input type="datetime-local" value={start} onChange={e => setStart(e.target.value)} /></label>
      <label>End<input type="datetime-local" value={end} onChange={e => setEnd(e.target.value)} /></label>
      <div className="form-actions">
        <button className="primary" type="submit">{initialPost ? "Save Changes" : "Create Post"}</button>
        <button type="button" onClick={onCancel}>Cancel</button>
        {initialPost && <button className="danger" type="button" onClick={() => onDelete(initialPost.id)}>Delete Post</button>}
      </div>
    </form>
  );
}