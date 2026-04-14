import React from 'react';
import '../styles/Header.css';

function Header() {
  return (
    <header className="hero">
      <div className="hero-inner">
        <div className="hero-logo">
          <span className="logo-mark">IP</span>
          <span className="logo-text">IronPlan</span>
        </div>
        <h1 className="hero-title">Plan Your Week. Own Your Gains.</h1>
        <p className="hero-subtitle">
          Build your workout split, track your exercises, and stay consistent.
        </p>
        <div className="hero-tags">
          <span className="hero-tag">Full Body</span>
          <span className="hero-tag">Push · Pull · Legs</span>
          <span className="hero-tag">Track Your Split</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
