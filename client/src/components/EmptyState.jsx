import React from 'react';
import '../styles/EmptyState.css';

function EmptyState({ filtered = false }) {
  return (
    <div className="empty-state">
      <h3 className="empty-title">
        {filtered
          ? 'No workouts match your filters'
          : 'No workouts yet'}
      </h3>

      <p className="empty-sub">
        {filtered
          ? 'Try adjusting or clearing your filters.'
          : 'Log your first workout to start building your training history.'}
      </p>
    </div>
  );
}

export default EmptyState;