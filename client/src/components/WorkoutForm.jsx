import React, { useEffect, useState } from 'react';
import ExerciseEditor from './ExerciseEditor.jsx';
import '../styles/WorkoutForm.css';

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

function getTodayString() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function createEmptySet() {
  return {
    reps: '',
    weight: '',
    weightUnit: 'lb',
  };
}

function createEmptyExercise() {
  return {
    clientId: crypto.randomUUID(),
    name: '',
    sets: [createEmptySet()],
    restTime: '',
    restUnit: 'minutes',
    notes: '',
  };
}

function createEmptyForm() {
  return {
    title: '',
    date: getTodayString(),
    startTime: '',
    durationHours: '',
    durationMinutes: '',
    difficulty: 5,
    muscleGroups: [],
    exercises: [createEmptyExercise()],
    notes: '',
  };
}

function WorkoutForm({ onSave, editingWorkout, onCancelEdit }) {
  const [form, setForm] = useState(createEmptyForm);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!editingWorkout) {
      setForm(createEmptyForm());
      setFormError('');
      return;
    }

    const totalMinutes = editingWorkout.durationMinutes || 0;

    setForm({
      title: editingWorkout.title || '',
      date: editingWorkout.date || getTodayString(),
      startTime: editingWorkout.startTime || '',
      durationHours:
        totalMinutes > 0 ? String(Math.floor(totalMinutes / 60)) : '',
      durationMinutes:
        totalMinutes > 0 ? String(totalMinutes % 60) : '',
      difficulty: editingWorkout.difficulty || 5,
      muscleGroups: editingWorkout.muscleGroups || [],
      exercises:
        editingWorkout.exercises?.length > 0
          ? editingWorkout.exercises.map((exercise) => ({
            clientId: exercise._id || crypto.randomUUID(),
            name: exercise.name || '',
            sets:
              exercise.sets?.length > 0
                ? exercise.sets.map((set) => ({
                  reps: set.reps?.toString() || '',
                  weight:
                    set.weight != null
                      ? set.weight.toString()
                      : '',
                  weightUnit: set.weightUnit || 'lb',
                }))
                : [createEmptySet()],
            restTime:
              exercise.restTime != null
                ? exercise.restTime.toString()
                : '',
            restUnit: exercise.restUnit || 'minutes',
            notes: exercise.notes || '',
          }))
          : [createEmptyExercise()],
      notes: editingWorkout.notes || '',
    });

    setFormError('');
  }, [editingWorkout]);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function toggleMuscleGroup(group) {
    setForm((prev) => {
      const selected = prev.muscleGroups.includes(group);

      return {
        ...prev,
        muscleGroups: selected
          ? prev.muscleGroups.filter((item) => item !== group)
          : [...prev.muscleGroups, group],
      };
    });
  }

  function handleExerciseChange(index, updatedExercise) {
    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.map((exercise, exerciseIndex) =>
        exerciseIndex === index ? updatedExercise : exercise
      ),
    }));
  }

  function addExercise() {
    setForm((prev) => ({
      ...prev,
      exercises: [...prev.exercises, createEmptyExercise()],
    }));
  }

  function removeExercise(index) {
    if (form.exercises.length === 1) {
      return;
    }

    setForm((prev) => ({
      ...prev,
      exercises: prev.exercises.filter(
        (_, exerciseIndex) => exerciseIndex !== index
      ),
    }));
  }

  function moveExerciseUp(index) {
    if (index === 0) {
      return;
    }

    setForm((prev) => {
      const exercises = [...prev.exercises];

      [exercises[index - 1], exercises[index]] = [
        exercises[index],
        exercises[index - 1],
      ];

      return {
        ...prev,
        exercises,
      };
    });
  }

  function moveExerciseDown(index) {
    if (index === form.exercises.length - 1) {
      return;
    }

    setForm((prev) => {
      const exercises = [...prev.exercises];

      [exercises[index], exercises[index + 1]] = [
        exercises[index + 1],
        exercises[index],
      ];

      return {
        ...prev,
        exercises,
      };
    });
  }

  function validate() {
    if (!form.title.trim()) {
      return 'Workout name is required.';
    }

    if (!form.date) {
      return 'Workout date is required.';
    }

    if (form.muscleGroups.length === 0) {
      return 'Select at least one muscle group.';
    }

    for (let i = 0; i < form.exercises.length; i += 1) {
      const exercise = form.exercises[i];

      if (!exercise.name.trim()) {
        return `Exercise ${i + 1} needs a name.`;
      }

      if (exercise.sets.length === 0) {
        return `${exercise.name} needs at least one set.`;
      }

      for (let j = 0; j < exercise.sets.length; j += 1) {
        const set = exercise.sets[j];

        if (
          !set.reps ||
          Number.isNaN(Number(set.reps)) ||
          Number(set.reps) < 1
        ) {
          return `${exercise.name}, set ${j + 1}: reps must be at least 1.`;
        }

        if (
          set.weight !== '' &&
          (Number.isNaN(Number(set.weight)) ||
            Number(set.weight) < 0)
        ) {
          return `${exercise.name}, set ${j + 1}: weight cannot be negative.`;
        }
      }

      if (
        exercise.restTime !== '' &&
        (Number.isNaN(Number(exercise.restTime)) ||
          Number(exercise.restTime) < 0)
      ) {
        return `${exercise.name}: rest time cannot be negative.`;
      }
    }

    const hours = Number(form.durationHours || 0);
    const minutes = Number(form.durationMinutes || 0);

    if (hours < 0 || minutes < 0 || minutes > 59) {
      return 'Enter a valid workout duration.';
    }

    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const error = validate();

    if (error) {
      setFormError(error);
      return;
    }

    setFormError('');
    setIsSubmitting(true);

    const duration =
      Number(form.durationHours || 0) * 60 +
      Number(form.durationMinutes || 0);

    const workoutData = {
      title: form.title.trim(),
      date: form.date,
      startTime: form.startTime || null,
      durationMinutes: duration > 0 ? duration : null,
      difficulty: Number(form.difficulty),
      muscleGroups: form.muscleGroups,

      exercises: form.exercises.map((exercise) => ({
        name: exercise.name.trim(),

        sets: exercise.sets.map((set) => ({
          reps: Number(set.reps),
          weight:
            set.weight === ''
              ? null
              : Number(set.weight),
          weightUnit: set.weightUnit,
        })),

        restTime:
          exercise.restTime === ''
            ? null
            : Number(exercise.restTime),

        restUnit: exercise.restUnit,
        notes: exercise.notes.trim(),
      })),

      notes: form.notes.trim(),
    };

    try {
      const success = await onSave(workoutData);

      if (success && !editingWorkout) {
        setForm(createEmptyForm());
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  const isEditing = !!editingWorkout;

  return (
    <div className={`workout-form-card ${isEditing ? 'editing' : ''}`}>
      <div className="form-card-header">
        <h2 className="form-title">
          {isEditing ? 'Edit Workout' : 'Log Workout'}
        </h2>

        <button
          type="button"
          className="btn btn--ghost"
          onClick={onCancelEdit}
        >
          Cancel
        </button>
      </div>

      {formError && (
        <p className="form-error">
          {formError}
        </p>
      )}

      <form
        className="workout-form"
        onSubmit={handleSubmit}
        noValidate
      >
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">
              Workout Name
            </label>

            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Push Day"
              value={form.title}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="date">
              Date
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="startTime">
              Start Time
              <span className="optional"> (optional)</span>
            </label>

            <input
              id="startTime"
              name="startTime"
              type="time"
              value={form.startTime}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>
              Duration
              <span className="optional"> (optional)</span>
            </label>

            <div className="duration-fields">
              <input
                name="durationHours"
                type="number"
                min="0"
                placeholder="Hours"
                value={form.durationHours}
                onChange={handleChange}
                aria-label="Workout duration hours"
              />

              <span>hr</span>

              <input
                name="durationMinutes"
                type="number"
                min="0"
                max="59"
                placeholder="Minutes"
                value={form.durationMinutes}
                onChange={handleChange}
                aria-label="Workout duration minutes"
              />

              <span>min</span>
            </div>
          </div>
        </div>

        <div className="form-group form-group--full">
          <label htmlFor="difficulty">
            Difficulty
          </label>

          <div className="difficulty-value">
            {form.difficulty}/10
          </div>

          <div className="difficulty-slider">
            <span className="difficulty-endpoint">
              1
              <small>Extremely Easy</small>
            </span>

            <input
              id="difficulty"
              name="difficulty"
              type="range"
              min="1"
              max="10"
              step="1"
              value={form.difficulty}
              onChange={handleChange}
            />

            <span className="difficulty-endpoint">
              10
              <small>Max Effort</small>
            </span>
          </div>
        </div>

        <div className="form-group form-group--full">
          <label>
            Muscle Groups
          </label>

          <div className="muscle-group-selector">
            {MUSCLE_GROUPS.map((group) => {
              const selected =
                form.muscleGroups.includes(group);

              return (
                <button
                  key={group}
                  type="button"
                  className={
                    selected
                      ? 'muscle-option muscle-option--selected'
                      : 'muscle-option'
                  }
                  onClick={() =>
                    toggleMuscleGroup(group)
                  }
                >
                  {group}
                </button>
              );
            })}
          </div>
        </div>

        <div className="exercise-section">
          <div className="exercise-section-header">
            <h3>Exercises</h3>

            <span>
              {form.exercises.length}{' '}
              {form.exercises.length === 1
                ? 'exercise'
                : 'exercises'}
            </span>
          </div>

          {form.exercises.map((exercise, index) => (
            <ExerciseEditor
              key={index}
              exercise={exercise}
              exerciseIndex={index}
              totalExercises={form.exercises.length}
              onChange={handleExerciseChange}
              onMoveUp={moveExerciseUp}
              onMoveDown={moveExerciseDown}
              onRemove={removeExercise}
            />
          ))}

          <button
            type="button"
            className="btn btn--ghost"
            onClick={addExercise}
          >
            + Add Exercise
          </button>
        </div>

        <div className="form-group form-group--full">
          <label htmlFor="notes">
            Workout Notes
            <span className="optional"> (optional)</span>
          </label>

          <textarea
            id="notes"
            name="notes"
            rows="3"
            placeholder="How did the workout feel?"
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            className="btn btn--primary"
            disabled={isSubmitting}
          >
            {isSubmitting
              ? 'Saving...'
              : isEditing
                ? 'Save Changes'
                : 'Save Workout'}
          </button>

          <button
            type="button"
            className="btn btn--ghost"
            onClick={onCancelEdit}
            disabled={isSubmitting}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default WorkoutForm;