import React from 'react';
import '../styles/EmptyState.css';

function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">🏋️</div>
      <h3 className="empty-title">No workouts yet</h3>
      <p className="empty-sub">
        Add your first workout above to start building your weekly split.
      </p>
    </div>
  );
}

export default EmptyState;
