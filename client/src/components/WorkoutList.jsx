import React from 'react';
import WorkoutCard from './WorkoutCard.jsx';
import EmptyState from './EmptyState.jsx';
import '../styles/WorkoutList.css';

function WorkoutList({ workouts, loading, onEdit, onDelete }) {
  if (loading) {
    return (
      <div className="list-status">
        <div className="spinner" aria-label="Loading workouts" />
        <p>Loading workouts…</p>
      </div>
    );
  }

  if (workouts.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="workout-grid">
      {workouts.map((workout) => (
        <WorkoutCard
          key={workout._id}
          workout={workout}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default WorkoutList;
