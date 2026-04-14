import React, { useState, useEffect } from 'react';
import '../styles/WorkoutForm.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body', 'Push', 'Pull'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

const EMPTY_FORM = {
  title: '',
  day: '',
  muscleGroup: '',
  exercises: '',
  sets: '',
  reps: '',
  notes: '',
  difficulty: '',
};

function WorkoutForm({ onSave, editingWorkout, onCancelEdit }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState('');

  // When editingWorkout changes, fill the form with its data
  useEffect(() => {
    if (editingWorkout) {
      setForm({
        title: editingWorkout.title || '',
        day: editingWorkout.day || '',
        muscleGroup: editingWorkout.muscleGroup || '',
        exercises: editingWorkout.exercises || '',
        sets: editingWorkout.sets?.toString() || '',
        reps: editingWorkout.reps?.toString() || '',
        notes: editingWorkout.notes || '',
        difficulty: editingWorkout.difficulty || '',
      });
      setFormError('');
    } else {
      setForm(EMPTY_FORM);
      setFormError('');
    }
  }, [editingWorkout]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    if (!form.title.trim()) return 'Title is required.';
    if (!form.day) return 'Day is required.';
    if (!form.muscleGroup) return 'Muscle group is required.';
    if (!form.exercises.trim()) return 'Exercises are required.';
    if (!form.sets || isNaN(form.sets) || Number(form.sets) < 1) return 'Sets must be a number ≥ 1.';
    if (!form.reps || isNaN(form.reps) || Number(form.reps) < 1) return 'Reps must be a number ≥ 1.';
    if (!form.difficulty) return 'Difficulty is required.';
    return null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    if (err) {
      setFormError(err);
      return;
    }
    setFormError('');
    onSave({
      ...form,
      sets: Number(form.sets),
      reps: Number(form.reps),
    });
    if (!editingWorkout) {
      setForm(EMPTY_FORM); // Clear form after create
    }
  }

  const isEditing = !!editingWorkout;

  return (
    <div className={`workout-form-card ${isEditing ? 'editing' : ''}`}>
      <div className="form-card-header">
        <h2 className="form-title">
          {isEditing ? '✏️ Edit Workout' : '+ Add Workout'}
        </h2>
        {isEditing && (
          <button className="btn btn--ghost" onClick={onCancelEdit} type="button">
            Cancel
          </button>
        )}
      </div>

      {formError && <p className="form-error">{formError}</p>}

      <form onSubmit={handleSubmit} className="workout-form" noValidate>
        {/* Row 1: Title + Day */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Workout Title</label>
            <input
              id="title"
              name="title"
              type="text"
              placeholder="e.g. Push Day, Leg Power"
              value={form.title}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="day">Day</label>
            <select id="day" name="day" value={form.day} onChange={handleChange}>
              <option value="">Select day…</option>
              {DAYS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 2: Muscle Group + Difficulty */}
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="muscleGroup">Muscle Group</label>
            <select id="muscleGroup" name="muscleGroup" value={form.muscleGroup} onChange={handleChange}>
              <option value="">Select group…</option>
              {MUSCLE_GROUPS.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="difficulty">Difficulty</label>
            <select id="difficulty" name="difficulty" value={form.difficulty} onChange={handleChange}>
              <option value="">Select difficulty…</option>
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Row 3: Sets + Reps */}
        <div className="form-row form-row--short">
          <div className="form-group">
            <label htmlFor="sets">Sets</label>
            <input
              id="sets"
              name="sets"
              type="number"
              min="1"
              placeholder="e.g. 4"
              value={form.sets}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="reps">Reps</label>
            <input
              id="reps"
              name="reps"
              type="number"
              min="1"
              placeholder="e.g. 10"
              value={form.reps}
              onChange={handleChange}
            />
          </div>
        </div>

        {/* Exercises */}
        <div className="form-group form-group--full">
          <label htmlFor="exercises">Exercises</label>
          <input
            id="exercises"
            name="exercises"
            type="text"
            placeholder="e.g. Bench Press, Incline Press, Cable Fly"
            value={form.exercises}
            onChange={handleChange}
          />
        </div>

        {/* Notes */}
        <div className="form-group form-group--full">
          <label htmlFor="notes">Notes <span className="optional">(optional)</span></label>
          <textarea
            id="notes"
            name="notes"
            rows="2"
            placeholder="e.g. increase weight next week, rest 90s between sets"
            value={form.notes}
            onChange={handleChange}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="btn btn--primary">
            {isEditing ? 'Save Changes' : 'Add Workout'}
          </button>
          {isEditing && (
            <button type="button" className="btn btn--ghost" onClick={onCancelEdit}>
              Cancel Edit
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default WorkoutForm;
