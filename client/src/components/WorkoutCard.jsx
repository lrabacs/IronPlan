import React from 'react';
import '../styles/WorkoutCard.css';

// Difficulty maps to a badge colour class
const DIFFICULTY_CLASS = {
  Beginner: 'badge--beginner',
  Intermediate: 'badge--intermediate',
  Advanced: 'badge--advanced',
};

// Day maps to a short abbreviation shown in the card accent
const DAY_SHORT = {
  Monday: 'MON',
  Tuesday: 'TUE',
  Wednesday: 'WED',
  Thursday: 'THU',
  Friday: 'FRI',
  Saturday: 'SAT',
  Sunday: 'SUN',
};

function WorkoutCard({ workout, onEdit, onDelete }) {
  const { title, day, muscleGroup, exercises, sets, reps, notes, difficulty } = workout;

  // Split exercises string into individual chips
  const exerciseList = exercises
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean);

  return (
    <div className="workout-card">
      {/* Top accent strip with day abbreviation */}
      <div className="card-accent">
        <span className="card-day-short">{DAY_SHORT[day] || day}</span>
      </div>

      <div className="card-body">
        {/* Header row */}
        <div className="card-header">
          <h3 className="card-title">{title}</h3>
          <span className={`badge ${DIFFICULTY_CLASS[difficulty] || 'badge--beginner'}`}>
            {difficulty}
          </span>
        </div>

        {/* Meta badges */}
        <div className="card-meta">
          <span className="meta-pill">{day}</span>
          <span className="meta-pill">{muscleGroup}</span>
          <span className="meta-pill">{sets} sets × {reps} reps</span>
        </div>

        {/* Exercise list */}
        <div className="card-exercises">
          {exerciseList.map((ex, i) => (
            <span key={i} className="exercise-chip">{ex}</span>
          ))}
        </div>

        {/* Notes */}
        {notes && (
          <p className="card-notes">
            <span className="notes-label">Notes: </span>{notes}
          </p>
        )}
      </div>

      {/* Action buttons */}
      <div className="card-actions">
        <button
          className="btn btn--edit"
          onClick={() => onEdit(workout)}
          aria-label={`Edit ${title}`}
        >
          Edit
        </button>
        <button
          className="btn btn--delete"
          onClick={() => onDelete(workout._id)}
          aria-label={`Delete ${title}`}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default WorkoutCard;
