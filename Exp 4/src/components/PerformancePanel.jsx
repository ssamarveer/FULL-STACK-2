import React, { useEffect, useState } from "react";

export default function PerformancePanel({ posts }) {
  const [renders, setRenders] = useState(0);
  useEffect(() => setRenders(v => v + 1), [posts]);
  return (
    <section className="panel performance">
      <h2>Performance Optimization</h2>
      <p>This project demonstrates component memoization, memoized calculations, stable callbacks, and efficient Redux state updates.</p>
      <div className="performance-grid">
        <div><strong>{posts.length}</strong><span>Visible Events</span></div>
        <div><strong>{renders}</strong><span>Panel Updates</span></div>
        <div><strong>React.memo</strong><span>Component Optimization</span></div>
        <div><strong>useMemo</strong><span>Calculation Optimization</span></div>
        <div><strong>useCallback</strong><span>Stable Handlers</span></div>
      </div>
    </section>
  );
}