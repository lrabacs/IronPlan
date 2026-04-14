import React from 'react';
import '../styles/FilterBar.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

function FilterBar({
  workouts,
  filterDay,
  filterMuscle,
  filterDifficulty,
  onFilterDay,
  onFilterMuscle,
  onFilterDifficulty,
}) {
  // Derive unique muscle groups from existing workouts for the filter dropdown
  const muscleGroups = [...new Set(workouts.map((w) => w.muscleGroup))].sort();

  const hasActiveFilter = filterDay || filterMuscle || filterDifficulty;

  function clearAll() {
    onFilterDay('');
    onFilterMuscle('');
    onFilterDifficulty('');
  }

  return (
    <div className="filter-bar">
      <div className="filter-controls">
        {/* Day filter */}
        <select
          className="filter-select"
          value={filterDay}
          onChange={(e) => onFilterDay(e.target.value)}
          aria-label="Filter by day"
        >
          <option value="">All Days</option>
          {DAYS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Muscle group filter — built from real data */}
        <select
          className="filter-select"
          value={filterMuscle}
          onChange={(e) => onFilterMuscle(e.target.value)}
          aria-label="Filter by muscle group"
        >
          <option value="">All Muscle Groups</option>
          {muscleGroups.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        {/* Difficulty filter */}
        <select
          className="filter-select"
          value={filterDifficulty}
          onChange={(e) => onFilterDifficulty(e.target.value)}
          aria-label="Filter by difficulty"
        >
          <option value="">All Difficulties</option>
          {DIFFICULTIES.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Clear filters button — only shown when a filter is active */}
        {hasActiveFilter && (
          <button className="btn btn--ghost btn--sm" onClick={clearAll}>
            Clear Filters ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterBar;
