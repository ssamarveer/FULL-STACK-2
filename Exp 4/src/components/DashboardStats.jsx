import React, { useMemo } from "react";

const DashboardStats = React.memo(function DashboardStats({ posts }) {
  const stats = useMemo(() => ({
    total: posts.length,
    scheduled: posts.filter(p => p.status === "Scheduled").length,
    published: posts.filter(p => p.status === "Published").length,
    draft: posts.filter(p => p.status === "Draft").length
  }), [posts]);

  return (
    <div className="stats-grid">
      <div className="stat-card"><span>Total Posts</span><strong>{stats.total}</strong></div>
      <div className="stat-card"><span>Scheduled</span><strong>{stats.scheduled}</strong></div>
      <div className="stat-card"><span>Published</span><strong>{stats.published}</strong></div>
      <div className="stat-card"><span>Drafts</span><strong>{stats.draft}</strong></div>
    </div>
  );
});

export default DashboardStats;