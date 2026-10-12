import React, { useEffect, useRef, useState } from 'react';
import Header from './components/Header.jsx';
import WorkoutForm from './components/WorkoutForm.jsx';
import FilterBar from './components/FilterBar.jsx';
import WorkoutList from './components/WorkoutList.jsx';
import {
  getAllWorkouts,
  createWorkout,
  updateWorkout,
  deleteWorkout
} from './api/workouts.js';
import './styles/App.css';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [formOpen, setFormOpen] = useState(false);

  const successTimeoutRef = useRef(null);

  const [editingWorkout, setEditingWorkout] = useState(null);

  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [filterMuscle, setFilterMuscle] = useState('');
  const [filterDifficultyMin, setFilterDifficultyMin] = useState('');
  const [filterDifficultyMax, setFilterDifficultyMax] = useState('');

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        clearTimeout(successTimeoutRef.current);
      }
    };
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

  function showSuccess(message) {
    setSuccessMsg(message);

    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }

    successTimeoutRef.current = setTimeout(() => {
      setSuccessMsg('');
      successTimeoutRef.current = null;
    }, 3000);
  }

  const filtered = workouts.filter((workout) => {
    const searchTerm = search.trim().toLowerCase();

    if (searchTerm) {
      const titleMatches = workout.title
        .toLowerCase()
        .includes(searchTerm);

      const exerciseMatches = workout.exercises.some((exercise) =>
        exercise.name
          .toLowerCase()
          .includes(searchTerm)
      );

      if (!titleMatches && !exerciseMatches) {
        return false;
      }
    }

    if (
      filterDate &&
      workout.date !== filterDate
    ) {
      return false;
    }

    if (
      filterMuscle &&
      !workout.muscleGroups.includes(filterMuscle)
    ) {
      return false;
    }

    if (
      filterDifficultyMin !== '' &&
      workout.difficulty < Number(filterDifficultyMin)
    ) {
      return false;
    }

    if (
      filterDifficultyMax !== '' &&
      workout.difficulty > Number(filterDifficultyMax)
    ) {
      return false;
    }

    return true;
  });

  return (
    <div className="app">
      <Header
        onAddWorkout={handleAddWorkout}
        formOpen={formOpen}
      />

      <main className="main-content">
        {successMsg && <div className="banner banner--success">{successMsg}</div>}
        {error && <div className="banner banner--error">{error}</div>}

        {formOpen && (
          <section className="section">
            <WorkoutForm
              onSave={handleSave}
              editingWorkout={editingWorkout}
              onCancelEdit={handleCancelEdit}
            />
          </section>
        )}

        <section className="section">
          <div className="list-header">
            <h2 className="section-title">Your Workouts</h2>
            <span className="workout-count">
              {filtered.length} of {workouts.length} shown
            </span>
          </div>

          <FilterBar
            search={search}
            setSearch={setSearch}
            filterDate={filterDate}
            setFilterDate={setFilterDate}
            filterMuscle={filterMuscle}
            setFilterMuscle={setFilterMuscle}
            filterDifficultyMin={filterDifficultyMin}
            setFilterDifficultyMin={setFilterDifficultyMin}
            filterDifficultyMax={filterDifficultyMax}
            setFilterDifficultyMax={setFilterDifficultyMax}
          />

          <WorkoutList
            workouts={filtered}
            hasWorkouts={workouts.length > 0}
            loading={loading}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>

      <footer className="footer">
        <p>IronPlan &mdash; Track your training. See your progress.</p>
      </footer>
    </div>
  );
}

export default App;
