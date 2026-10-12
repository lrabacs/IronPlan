import React from 'react';

function ExerciseEditor({
  exercise,
  exerciseIndex,
  totalExercises,
  expanded,
  onToggle,
  onChange,
  onMoveUp,
  onMoveDown,
  onRemove,
}) {

  function handleExerciseChange(field, value) {
    onChange(exerciseIndex, {
      ...exercise,
      [field]: value,
    });
  }

  function handleSetChange(setIndex, field, value) {
    const updatedSets = exercise.sets.map((set, index) =>
      index === setIndex
        ? {
          ...set,
          [field]: value,
        }
        : set
    );

    handleExerciseChange('sets', updatedSets);
  }

  function addSet() {
    handleExerciseChange('sets', [
      ...exercise.sets,
      {
        reps: '',
        weight: '',
        weightUnit: 'lb',
      },
    ]);
  }

  function removeSet(setIndex) {
    if (exercise.sets.length === 1) {
      return;
    }

    handleExerciseChange(
      'sets',
      exercise.sets.filter((_, index) => index !== setIndex)
    );
  }

  return (
    <div className="exercise-editor">
      <div className="exercise-editor-header">
        <button
          type="button"
          className="exercise-collapse-toggle"
          onClick={onToggle}
          aria-expanded={expanded}
        >
          <div className="exercise-header-text">
            <span className="exercise-number">
              Exercise {exerciseIndex + 1}
            </span>

            <strong className="exercise-name-preview">
              {exercise.name.trim()}
            </strong>
          </div>

          <div className="exercise-header-summary">
            <span>
              {exercise.sets.length}{' '}
              {exercise.sets.length === 1 ? 'set' : 'sets'}
            </span>

            <span className="collapse-icon">
              {expanded ? '▾' : '▸'}
            </span>
          </div>
        </button>

        <div className="exercise-order-actions">
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => onMoveUp(exerciseIndex)}
            disabled={exerciseIndex === 0}
          >
            ↑
          </button>

          <button
            type="button"
            className="btn btn--ghost btn--sm"
            onClick={() => onMoveDown(exerciseIndex)}
            disabled={exerciseIndex === totalExercises - 1}
          >
            ↓
          </button>

          <button
            type="button"
            className="btn btn--delete btn--sm"
            onClick={() => onRemove(exerciseIndex)}
            disabled={totalExercises === 1}
          >
            Remove
          </button>
        </div>
      </div>

      {expanded && (
        <div className="exercise-editor-body">
          <div className="form-group form-group--full">
            <label htmlFor={`exercise-${exerciseIndex}`}>
              Exercise Name
            </label>

            <input
              id={`exercise-${exerciseIndex}`}
              type="text"
              placeholder="e.g. Bench Press"
              value={exercise.name}
              onChange={(e) =>
                handleExerciseChange('name', e.target.value)
              }
            />
          </div>

          <div className="exercise-sets">
            <div className="set-header">
              <span>Set</span>
              <span>Weight</span>
              <span>Unit</span>
              <span>Reps</span>
              <span />
            </div>

            {exercise.sets.map((set, setIndex) => (
              <div
                className="set-entry"
                key={setIndex}
              >
                <span className="set-number">
                  {setIndex + 1}
                </span>

                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="Weight"
                  value={set.weight}
                  onChange={(e) =>
                    handleSetChange(
                      setIndex,
                      'weight',
                      e.target.value
                    )
                  }
                  aria-label={`Weight for set ${setIndex + 1}`}
                />

                <select
                  value={set.weightUnit}
                  onChange={(e) =>
                    handleSetChange(
                      setIndex,
                      'weightUnit',
                      e.target.value
                    )
                  }
                  aria-label={`Weight unit for set ${setIndex + 1}`}
                >
                  <option value="lb">lb</option>
                  <option value="kg">kg</option>
                </select>

                <input
                  type="number"
                  min="1"
                  placeholder="Reps"
                  value={set.reps}
                  onChange={(e) =>
                    handleSetChange(
                      setIndex,
                      'reps',
                      e.target.value
                    )
                  }
                  aria-label={`Reps for set ${setIndex + 1}`}
                />

                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => removeSet(setIndex)}
                  disabled={exercise.sets.length === 1}
                  aria-label={`Remove set ${setIndex + 1}`}
                >
                  Remove
                </button>
              </div>
            ))}

            <button
              type="button"
              className="btn btn--ghost btn--sm"
              onClick={addSet}
            >
              + Add Set
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor={`rest-${exerciseIndex}`}>
                Rest Time
              </label>

              <input
                id={`rest-${exerciseIndex}`}
                type="number"
                min="0"
                placeholder="Optional"
                value={exercise.restTime}
                onChange={(e) =>
                  handleExerciseChange(
                    'restTime',
                    e.target.value
                  )
                }
              />
            </div>

            <div className="form-group">
              <label htmlFor={`rest-unit-${exerciseIndex}`}>
                Rest Unit
              </label>

              <select
                id={`rest-unit-${exerciseIndex}`}
                value={exercise.restUnit}
                onChange={(e) =>
                  handleExerciseChange(
                    'restUnit',
                    e.target.value
                  )
                }
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
              </select>
            </div>
          </div>

          <div className="form-group form-group--full">
            <label htmlFor={`exercise-notes-${exerciseIndex}`}>
              Exercise Notes
              <span className="optional"> (optional)</span>
            </label>

            <textarea
              id={`exercise-notes-${exerciseIndex}`}
              rows="2"
              placeholder="e.g. controlled eccentric, paused reps"
              value={exercise.notes}
              onChange={(e) =>
                handleExerciseChange(
                  'notes',
                  e.target.value
                )
              }
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ExerciseEditor;