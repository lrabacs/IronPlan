import React, { useState } from 'react';
import '../styles/WorkoutCard.css';

function formatDate(dateString) {
  if (!dateString) return '';

  const [year, month, day] = dateString.split('-');

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day)
  ).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

function formatTime(time) {
  if (!time) return null;

  const [hourString, minute] = time.split(':');
  const hour = Number(hourString);

  const suffix = hour >= 12 ? 'PM' : 'AM';
  const displayHour = hour % 12 || 12;

  return `${displayHour}:${minute} ${suffix}`;
}

function formatDuration(minutes) {
  if (!minutes) return null;

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes} min`;
  }

  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${remainingMinutes} min`;
}

function WorkoutCard({ workout, onEdit, onDelete }) {
  const [expanded, setExpanded] = useState(false);

  const {
    title,
    date,
    startTime,
    durationMinutes,
    difficulty,
    muscleGroups = [],
    exercises = [],
    notes
  } = workout;

  const time = formatTime(startTime);
  const duration = formatDuration(durationMinutes);

  return (
    <div className="workout-card">
      <button
        type="button"
        className="card-main"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        <div className="card-date">
          {formatDate(date)}
        </div>

        <div className="card-summary">
          <div className="card-header">
            <h3 className="card-title">{title}</h3>
            <span className="difficulty-score">
              {difficulty}/10
            </span>
          </div>

          {(time || duration) && (
            <div className="card-time">
              {time && <span>{time}</span>}
              {time && duration && <span> • </span>}
              {duration && <span>{duration}</span>}
            </div>
          )}

          <div className="card-meta">
            {muscleGroups.map((group) => (
              <span key={group} className="meta-pill">
                {group}
              </span>
            ))}
          </div>

          <div className="exercise-count">
            {exercises.length}{' '}
            {exercises.length === 1 ? 'exercise' : 'exercises'}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="card-details">
          {exercises.map((exercise, exerciseIndex) => (
            <div
              key={exercise._id || exerciseIndex}
              className="exercise-detail"
            >
              <h4>{exercise.name}</h4>

              <div className="set-list">
                {exercise.sets.map((set, setIndex) => (
                  <div
                    key={set._id || setIndex}
                    className="set-row"
                  >
                    <span>Set {setIndex + 1}</span>

                    <span>
                      {set.weight != null
                        ? `${set.weight} ${set.weightUnit} × `
                        : ''}
                      {set.reps} reps
                    </span>
                  </div>
                ))}
              </div>

              {exercise.restTime != null && (
                <p>
                  Rest: {exercise.restTime} {exercise.restUnit}
                </p>
              )}

              {exercise.notes && (
                <p className="card-notes">
                  {exercise.notes}
                </p>
              )}
            </div>
          ))}

          {notes && (
            <div className="workout-notes">
              <strong>Workout Notes</strong>
              <p>{notes}</p>
            </div>
          )}

          <div className="card-actions">
            <button
              type="button"
              className="btn btn--edit"
              onClick={() => onEdit(workout)}
            >
              Edit
            </button>

            <button
              type="button"
              className="btn btn--delete"
              onClick={() => onDelete(workout._id)}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default WorkoutCard;