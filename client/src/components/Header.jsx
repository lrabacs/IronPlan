import React from 'react';
import '../styles/Header.css';

function Header({ onAddWorkout, formOpen }) {
  return (
    <header className="hero">
      <div className="hero-inner">
        <div className="hero-logo">
          <span className="logo-mark">IP</span>
          <span className="logo-text">IronPlan</span>
        </div>

        <h1 className="hero-title">Track Your Training. See Your Progress.</h1>

        <p className="hero-subtitle">
          Log workouts, exercises, sets, and performance over time.
        </p>

        <button
          type="button"
          className="btn btn--primary"
          onClick={onAddWorkout}
        >
          {formOpen ? 'Close Workout Form' : '+ Add Workout'}
        </button>
      </div>
    </header>
  );
}

export default Header;