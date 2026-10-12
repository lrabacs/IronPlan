import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import WorkoutForm from './components/WorkoutForm.jsx';
import FilterBar from './components/FilterBar.jsx';
import WorkoutList from './components/WorkoutList.jsx';
import { getAllWorkouts, createWorkout, updateWorkout, deleteWorkout } from './api/workouts.js';
import './styles/App.css';

function App() {
  // --- Data state ---
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  // --- Edit state ---
  // When editingWorkout is set, the form switches to edit mode
  const [editingWorkout, setEditingWorkout] = useState(null);

  // --- Filter state ---
  const [filterDay, setFilterDay] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('');
  const [filterDifficulty, setFilterDifficulty] = useState('');

  // --- Fetch workouts on mount ---
  useEffect(() => {
    fetchWorkouts();
  }, []);

  async function fetchWorkouts() {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllWorkouts();
      setWorkouts(data);
    } catch (err) {
      setError('Could not load workouts. Is the server running?');
    } finally {
      setLoading(false);
    }
  }

  // --- Create or Update ---
  async function handleSave(formData) {
    setError(null);

    try {
      if (editingWorkout) {
        const updated = await updateWorkout(editingWorkout._id, formData);

        setWorkouts((prev) =>
          prev.map((w) => (w._id === updated._id ? updated : w))
        );

        showSuccess('Workout updated!');
        setEditingWorkout(null);
      } else {
        const created = await createWorkout(formData);

        setWorkouts((prev) => [created, ...prev]);

        showSuccess('Workout added!');
      }

      setFormOpen(false);
      return true;
    } catch (err) {
      setError(err.message || 'Failed to save workout.');
      return false;
    }
  }

  // --- Delete ---
  async function handleDelete(id) {
    if (!window.confirm('Delete this workout? This cannot be undone.')) return;
    setError(null);
    try {
      await deleteWorkout(id);
      setWorkouts((prev) => prev.filter((w) => w._id !== id));
      showSuccess('Workout deleted.');
    } catch (err) {
      setError(err.message || 'Failed to delete workout.');
    }
  }

  // --- Edit: populate form ---
  function handleEdit(workout) {
    setEditingWorkout(workout);
    setFormOpen(true);

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  function handleAddWorkout() {
    if (formOpen) {
      setFormOpen(false);
      setEditingWorkout(null);
    } else {
      setEditingWorkout(null);
      setFormOpen(true);
    }
  }

  function handleCancelEdit() {
    setEditingWorkout(null);
    setFormOpen(false);
  }

  // --- Success toast ---
  function showSuccess(msg) {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 3000);
  }

  // --- Client-side filtering ---
  const filtered = workouts.filter((w) => {
    if (filterDay && w.day !== filterDay) return false;
    if (filterMuscle && w.muscleGroup !== filterMuscle) return false;
    if (filterDifficulty && w.difficulty !== filterDifficulty) return false;
    return true;
  });

  return (
    <div className="app">
      <Header
        onAddWorkout={handleAddWorkout}
        formOpen={formOpen}
      />

      <main className="main-content">
        {/* Success / Error banners */}
        {successMsg && <div className="banner banner--success">{successMsg}</div>}
        {error && <div className="banner banner--error">{error}</div>}

        {/* Workout Form (create + edit) */}
        {formOpen && (
          <section className="section">
            <WorkoutForm
              onSave={handleSave}
              editingWorkout={editingWorkout}
              onCancelEdit={handleCancelEdit}
            />
          </section>
        )}  

        {/* Filter bar + workout cards */}
        <section className="section">
          <div className="list-header">
            <h2 className="section-title">Your Workouts</h2>
            <span className="workout-count">
              {filtered.length} of {workouts.length} shown
            </span>
          </div>

          <FilterBar
            workouts={workouts}
            filterDay={filterDay}
            filterMuscle={filterMuscle}
            filterDifficulty={filterDifficulty}
            onFilterDay={setFilterDay}
            onFilterMuscle={setFilterMuscle}
            onFilterDifficulty={setFilterDifficulty}
          />

          <WorkoutList
            workouts={filtered}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <footer className="footer">
        <p>IronPlan &mdash; Plan your week. Own your gains.</p>
      </footer>
    </div>
  );
}

export default App;
