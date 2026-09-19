import React, { useCallback } from "react";

const FilterBar = React.memo(function FilterBar({ platform, status, setPlatform, setStatus }) {
  const handlePlatform = useCallback(e => setPlatform(e.target.value), [setPlatform]);
  const handleStatus = useCallback(e => setStatus(e.target.value), [setStatus]);

  return (
    <div className="filters">
      <label>Platform
        <select aria-label="Platform filter" value={platform} onChange={handlePlatform}>
          <option>All</option><option>Instagram</option><option>Facebook</option>
          <option>Twitter/X</option><option>LinkedIn</option>
        </select>
      </label>
      <label>Status
        <select aria-label="Status filter" value={status} onChange={handleStatus}>
          <option>All</option><option>Scheduled</option><option>Published</option><option>Draft</option>
        </select>
      </label>
    </div>
  );
});

export default FilterBar;