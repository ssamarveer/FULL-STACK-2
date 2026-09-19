import React, { useCallback, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DashboardStats from "./components/DashboardStats";
import FilterBar from "./components/FilterBar";
import CalendarView from "./components/CalendarView";
import PostList from "./components/PostList";
import PostModal from "./components/PostModal";
import PerformancePanel from "./components/PerformancePanel";
import { addPost, updatePost, deletePost, reschedulePost } from "./store/postsSlice";
import "./App.css";

export default function App() {
  const dispatch = useDispatch();
  const posts = useSelector(s => s.posts.items);
  const [platform, setPlatform] = useState("All");
  const [status, setStatus] = useState("All");
  const [modalPost, setModalPost] = useState(null);
  const [createStart, setCreateStart] = useState(null);
  const [view, setView] = useState("calendar");

  const filteredPosts = useMemo(() => posts.filter(p =>
    (platform === "All" || p.platform === platform) &&
    (status === "All" || p.status === status)
  ), [posts, platform, status]);

  const savePost = useCallback(post => {
    if (posts.some(p => p.id === post.id)) dispatch(updatePost(post));
    else dispatch(addPost(post));
    setModalPost(null);
    setCreateStart(null);
  }, [dispatch, posts]);

  const removePost = useCallback(id => {
    dispatch(deletePost(id));
    setModalPost(null);
  }, [dispatch]);

  const handleSelect = useCallback((start, end) => {
    const toLocal = d => {
      const pad = n => String(n).padStart(2, "0");
      return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    };
    setCreateStart({ start: toLocal(start), end: toLocal(end || new Date(start.getTime()+3600000)) });
    setModalPost({ id: null, title: "", content: "", platform: "Instagram", status: "Scheduled",
      start: start.toISOString(), end: (end || new Date(start.getTime()+3600000)).toISOString() });
  }, []);

  const handleEventChange = useCallback((id, start, end) => {
    dispatch(reschedulePost({
      id,
      start: start?.toISOString(),
      end: end?.toISOString()
    }));
  }, [dispatch]);

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">Post<span>Flow</span></div>
        <p className="brand-sub">Social Content Scheduler</p>
        <nav>
          <button className={view === "calendar" ? "active" : ""} onClick={() => setView("calendar")}>📅 Calendar</button>
          <button className={view === "posts" ? "active" : ""} onClick={() => setView("posts")}>📝 Posts</button>
          <button className={view === "performance" ? "active" : ""} onClick={() => setView("performance")}>⚡ Performance</button>
          <button onClick={() => setView("testing")}>✓ Testing</button>
        </nav>
        <div className="sidebar-note"><strong>Experiment</strong><p>Interactive calendar + performance optimization + testing.</p></div>
      </aside>

      <main className="main">
        <header className="header">
          <div><p className="eyebrow">UNIVERSITY PRACTICAL</p><h1>Interactive Post Scheduler</h1><p>Plan, schedule and manage social media content visually.</p></div>
          <button className="primary add" onClick={() => setModalPost(null)}>＋ Add Post</button>
        </header>

        <DashboardStats posts={posts} />

        <FilterBar platform={platform} status={status} setPlatform={setPlatform} setStatus={setStatus} />

        {view === "calendar" && <CalendarView posts={filteredPosts} onSelect={handleSelect} onEventClick={setModalPost} onEventChange={handleEventChange} />}
        {view === "posts" && <PostList posts={filteredPosts} onEdit={setModalPost} />}
        {view === "performance" && <PerformancePanel posts={filteredPosts} />}
        {view === "testing" && (
          <section className="panel">
            <h2>Testing Strategy</h2>
            <p>The project includes automated tests for rendering, form validation, post creation/editing, filtering and dashboard statistics.</p>
            <pre>{`npm test\n\nExample test areas:\n✓ Component rendering\n✓ Form validation\n✓ User interactions\n✓ State updates\n✓ Filtering\n✓ Dashboard statistics`}</pre>
          </section>
        )}

        {view === "calendar" && <PostList posts={filteredPosts} onEdit={setModalPost} />}
      </main>

      {modalPost && <PostModal
        post={modalPost.id ? modalPost : null}
        onSave={savePost}
        onDelete={removePost}
        onCancel={() => { setModalPost(null); setCreateStart(null); }}
      />}
    </div>
  );
}