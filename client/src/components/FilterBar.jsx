import React from 'react';
import '../styles/FilterBar.css';

const MUSCLE_GROUPS = [
  'Chest',
  'Back',
  'Shoulders',
  'Biceps',
  'Triceps',
  'Legs',
  'Abs',
  'Cardio',
  'Plyometrics',
  'Full Body',
];

const DIFFICULTIES = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

function FilterBar({
  search,
  setSearch,
  filterDate,
  setFilterDate,
  filterMuscle,
  setFilterMuscle,
  filterDifficultyMin,
  setFilterDifficultyMin,
  filterDifficultyMax,
  setFilterDifficultyMax,
}) {
  const hasFilters =
    search ||
    filterDate ||
    filterMuscle ||
    filterDifficultyMin !== '' ||
    filterDifficultyMax !== '';

  function clearFilters() {
    setSearch('');
    setFilterDate('');
    setFilterMuscle('');
    setFilterDifficultyMin('');
    setFilterDifficultyMax('');
  }

  return (
    <div className="filter-panel">
      <div className="filter-field filter-field--search">
        <label htmlFor="filter-search">
          Search
        </label>

        <input
          id="filter-search"
          type="text"
          placeholder="Workout or exercise..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="filter-date">
          Date Performed
        </label>

        <input
          id="filter-date"
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
        />
      </div>

      <div className="filter-field">
        <label htmlFor="filter-muscle">
          Muscle Group
        </label>

        <select
          id="filter-muscle"
          value={filterMuscle}
          onChange={(e) => setFilterMuscle(e.target.value)}
        >
          <option value="">All Groups</option>

          {MUSCLE_GROUPS.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      <div className="filter-field filter-field--difficulty">
        <label>
          Difficulty
        </label>

        <div className="difficulty-filter">
          <select
            value={filterDifficultyMin}
            onChange={(e) =>
              setFilterDifficultyMin(e.target.value)
            }
            aria-label="Minimum difficulty"
          >
            <option value="">Min</option>

            {DIFFICULTIES.map((difficulty) => (
              <option
                key={difficulty}
                value={difficulty}
              >
                {difficulty}
              </option>
            ))}
          </select>

          <span>to</span>

          <select
            value={filterDifficultyMax}
            onChange={(e) =>
              setFilterDifficultyMax(e.target.value)
            }
            aria-label="Maximum difficulty"
          >
            <option value="">Max</option>

            {DIFFICULTIES.map((difficulty) => (
              <option
                key={difficulty}
                value={difficulty}
              >
                {difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-clear-wrapper">
        {hasFilters && (
          <button
            type="button"
            className="filter-clear"
            onClick={clearFilters}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default FilterBar;