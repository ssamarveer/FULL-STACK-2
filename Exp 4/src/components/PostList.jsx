import React, { useMemo } from "react";

const PostList = React.memo(function PostList({ posts, onEdit }) {
  const sorted = useMemo(() => [...posts].sort((a,b) => new Date(a.start)-new Date(b.start)), [posts]);
  return (
    <section className="panel">
      <div className="panel-title"><h2>Scheduled Posts</h2><span>{sorted.length} visible</span></div>
      {sorted.length === 0 ? <p className="empty">No posts match the selected filters.</p> :
        <div className="post-list">
          {sorted.map(post => (
            <button className="post-card" key={post.id} onClick={() => onEdit(post)}>
              <div>
                <strong>{post.title}</strong>
                <small>{post.platform} · {new Date(post.start).toLocaleString()}</small>
              </div>
              <span className={`badge ${post.status.toLowerCase()}`}>{post.status}</span>
            </button>
          ))}
        </div>}
    </section>
  );
});

export default PostList;