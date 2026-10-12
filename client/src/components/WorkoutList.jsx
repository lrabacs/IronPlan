import React from 'react';
import WorkoutCard from './WorkoutCard.jsx';
import EmptyState from './EmptyState.jsx';
import '../styles/WorkoutList.css';

function formatMonthHeading(dateString) {
  const [year, month] = dateString.split('-');

  return new Date(
    Number(year),
    Number(month) - 1,
    1
  ).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
}

function WorkoutList({
  workouts,
  loading,
  onEdit,
  onDelete,
}) {
  if (loading) {
    return (
      <div className="list-status">
        Loading workouts...
      </div>
    );
  }

  if (workouts.length === 0) {
    return <EmptyState />;
  }

  const sortedWorkouts = [...workouts].sort((a, b) => {
    const dateComparison =
      (b.date || '').localeCompare(a.date || '');

    if (dateComparison !== 0) {
      return dateComparison;
    }

    return (b.startTime || '').localeCompare(
      a.startTime || ''
    );
  });

  const groupedWorkouts = [];

  for (const workout of sortedWorkouts) {
    const monthKey = workout.date.slice(0, 7);

    let group = groupedWorkouts.find(
      (item) => item.key === monthKey
    );

    if (!group) {
      group = {
        key: monthKey,
        label: formatMonthHeading(workout.date),
        workouts: [],
      };

      groupedWorkouts.push(group);
    }

    group.workouts.push(workout);
  }

  return (
    <div className="workout-history">
      {groupedWorkouts.map((group) => (
        <section
          className="workout-month"
          key={group.key}
        >
          <div className="workout-month-header">
            <h3>{group.label}</h3>

            <span>
              {group.workouts.length}{' '}
              {group.workouts.length === 1
                ? 'workout'
                : 'workouts'}
            </span>
          </div>

          <div className="workout-grid">
            {group.workouts.map((workout) => (
              <WorkoutCard
                key={workout._id}
                workout={workout}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

export default WorkoutList;