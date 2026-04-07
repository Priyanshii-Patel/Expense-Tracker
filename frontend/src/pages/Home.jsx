import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg:        #0b0e14;
    --surface:   #161b27;
    --border:    rgba(255,255,255,0.07);
    --lime:      #c6f135;
    --lime-dim:  #9ab82a;
    --text:      #e8ecf4;
    --muted:     #6b7590;
    --red-dim:   #ff5a5a;
    --green-dim: #4be08a;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fintrack-root {
    min-height: 100vh;
    background-color: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    overflow-x: hidden;
    position: relative;
  }

  .fintrack-root::before,
  .fintrack-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .fintrack-root::before {
    width: 600px; height: 600px;
    top: -200px; right: -150px;
    background: radial-gradient(circle, rgba(198,241,53,0.06) 0%, transparent 65%);
    animation: orbFloat 10s ease-in-out infinite alternate;
  }

  .fintrack-root::after {
    width: 500px; height: 500px;
    bottom: -150px; left: -100px;
    background: radial-gradient(circle, rgba(90,110,255,0.05) 0%, transparent 65%);
    animation: orbFloat 13s ease-in-out infinite alternate-reverse;
  }

  @keyframes orbFloat {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(30px,20px) scale(1.06); }
  }

  .grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(198,241,53,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(198,241,53,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .grid-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 75% 40%, rgba(198,241,53,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 20% 70%, rgba(100,120,255,0.04) 0%, transparent 70%);
  }

  /* ── Navbar ── */
  .navbar {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2.5rem;
    height: 64px;
    background: rgba(11,14,20,0.7);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }

  /* Logo */
  .logo {
    display: flex;
    align-items: center;
    gap: 0.55rem;
    text-decoration: none;
  }

  .logo-icon {
    width: 34px;
    height: 34px;
    background: var(--lime);
    border-radius: 9px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0b0e14;
    flex-shrink: 0;
    box-shadow: 0 0 16px rgba(198,241,53,0.3);
    transition: box-shadow 0.2s, transform 0.2s;
  }

  .logo:hover .logo-icon {
    box-shadow: 0 0 24px rgba(198,241,53,0.5);
    transform: scale(1.05);
  }

  .logo-text {
    font-family: var(--font-head);
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    color: var(--text);
  }

  /* Nav links */
  .nav-links {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .nav-link {
    padding: 0.48rem 1rem;
    color: var(--muted);
    font-family: var(--font-body);
    font-size: 0.88rem;
    font-weight: 500;
    text-decoration: none;
    border-radius: 8px;
    transition: color 0.18s, background 0.18s;
  }

  .nav-link:hover {
    color: var(--text);
    background: rgba(255,255,255,0.05);
  }

  .btn-nav-register {
    display: inline-flex;
    align-items: center;
    padding: 0.48rem 1.15rem;
    background: var(--lime);
    color: #0b0e14;
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 0.85rem;
    border-radius: 8px;
    text-decoration: none;
    transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
  }

  .btn-nav-register:hover {
    transform: translateY(-1px);
    background: #d4f94a;
    box-shadow: 0 6px 20px rgba(198,241,53,0.3);
  }

  /* ── Hero ── */
  main.hero {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
    min-height: 100vh;
    max-width: 1200px;
    margin: 0 auto;
    padding: 6rem 2rem 4rem;
  }

  @media (max-width: 900px) {
    main.hero { grid-template-columns: 1fr; padding: 5rem 1.5rem 3rem; }
    .hero-visual { order: -1; }
    .navbar { padding: 0 1.25rem; }
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.85rem;
    border: 1px solid rgba(198,241,53,0.35);
    background: rgba(198,241,53,0.07);
    border-radius: 999px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--lime);
    margin-bottom: 1.5rem;
    width: fit-content;
    animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.1s;
  }

  .badge::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--lime);
    box-shadow: 0 0 8px var(--lime);
    animation: pulseDot 2s ease-in-out infinite;
  }

  @keyframes pulseDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.65); }
  }

  .hero-title {
    font-family: var(--font-head);
    font-size: clamp(2.6rem, 5vw, 4.2rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 1.25rem;
    animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.2s;
  }

  .accent {
    color: var(--lime);
    position: relative;
    display: inline-block;
  }

  .accent::after {
    content: '';
    position: absolute;
    bottom: 4px; left: 0; right: 0;
    height: 3px;
    background: var(--lime);
    opacity: 0.3;
    border-radius: 2px;
  }

  .hero-desc {
    font-size: 1.05rem;
    line-height: 1.75;
    color: var(--muted);
    max-width: 420px;
    margin-bottom: 2.25rem;
    animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.3s;
  }

  .hero-actions {
    display: flex;
    gap: 0.85rem;
    flex-wrap: wrap;
    margin-bottom: 1.5rem;
    animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.4s;
  }

  .btn-primary {
    display: inline-flex;
    align-items: center;
    padding: 0.78rem 1.65rem;
    background: var(--lime);
    color: #0b0e14;
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 0.92rem;
    border-radius: 10px;
    text-decoration: none;
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s;
  }

  .btn-primary:hover {
    transform: translateY(-2px);
    background: #d4f94a;
    box-shadow: 0 10px 30px rgba(198,241,53,0.28);
  }

  .btn-ghost {
    display: inline-flex;
    align-items: center;
    padding: 0.78rem 1.4rem;
    background: transparent;
    color: var(--muted);
    font-size: 0.9rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    text-decoration: none;
    transition: color 0.18s, border-color 0.18s, background 0.18s;
  }

  .btn-ghost:hover {
    color: var(--text);
    border-color: rgba(255,255,255,0.18);
    background: rgba(255,255,255,0.04);
  }

  .trust-line {
    font-size: 0.78rem;
    color: var(--muted);
    letter-spacing: 0.04em;
    animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.5s;
  }

  .hero-visual {
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeSlideUp 0.9s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.35s;
  }

  /* ── Dashboard preview card ── */
  .dashboard-card {
    width: 100%;
    max-width: 400px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 1.6rem;
    box-shadow:
      0 0 0 1px rgba(198,241,53,0.06),
      0 24px 64px rgba(0,0,0,0.5),
      inset 0 0 80px rgba(198,241,53,0.03);
    position: relative;
    overflow: hidden;
  }

  .dashboard-card::before {
    content: '';
    position: absolute;
    top: -60%; left: -60%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%);
    transform: skewX(-15deg);
    animation: shimmer 4s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes shimmer {
    0%       { left: -60%; }
    60%, 100%{ left: 140%; }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.25rem;
  }

  .card-label {
    font-family: var(--font-head);
    font-size: 0.8rem;
    font-weight: 700;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .card-month {
    font-size: 0.76rem;
    color: var(--lime);
    background: rgba(198,241,53,0.1);
    border: 1px solid rgba(198,241,53,0.22);
    padding: 0.2rem 0.6rem;
    border-radius: 6px;
    font-weight: 600;
  }

  .card-stats {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 0.7rem;
    margin-bottom: 1.4rem;
  }

  .stat {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.75rem 0.6rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    transition: border-color 0.2s;
  }

  .stat:hover { border-color: rgba(198,241,53,0.22); }

  .stat-label {
    font-size: 0.66rem;
    color: var(--muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    font-weight: 500;
  }

  .stat-value {
    font-family: var(--font-head);
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--text);
  }

  .stat-value.green { color: var(--green-dim); }
  .stat-change { font-size: 0.67rem; font-weight: 600; }
  .stat-change.positive { color: var(--green-dim); }
  .stat-change.negative { color: var(--red-dim); }

  .bar-chart {
    display: flex;
    align-items: flex-end;
    gap: 5px;
    height: 70px;
    margin-bottom: 0.35rem;
  }

  .bar-chart > div {
    flex: 1;
    background: rgba(255,255,255,0.05);
    border-radius: 5px 5px 3px 3px;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }

  .bar-chart > div > div {
    width: 100%;
    background: linear-gradient(to top, var(--lime), var(--lime-dim));
    border-radius: 5px 5px 3px 3px;
    animation: growBar 0.9s cubic-bezier(0.22,1,0.36,1) both;
  }

  .bar-chart > div:nth-child(1) > div { animation-delay: 0.55s; }
  .bar-chart > div:nth-child(2) > div { animation-delay: 0.65s; }
  .bar-chart > div:nth-child(3) > div { animation-delay: 0.75s; }
  .bar-chart > div:nth-child(4) > div { animation-delay: 0.85s; }
  .bar-chart > div:nth-child(5) > div { animation-delay: 0.95s; }
  .bar-chart > div:nth-child(6) > div { animation-delay: 1.05s; }
  .bar-chart > div:nth-child(7) > div { animation-delay: 1.15s; }

  @keyframes growBar {
    from { transform: scaleY(0); transform-origin: bottom; }
    to   { transform: scaleY(1); transform-origin: bottom; }
  }

  .bar-labels {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1.2rem;
  }

  .bar-labels span {
    flex: 1;
    text-align: center;
    font-size: 0.61rem;
    color: var(--muted);
  }

  .recent-list {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
    border-top: 1px solid var(--border);
    padding-top: 1rem;
  }

  .recent-list > div {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    padding: 0.5rem 0.65rem;
    border-radius: 9px;
    background: rgba(255,255,255,0.02);
    border: 1px solid transparent;
    transition: background 0.15s, border-color 0.15s;
    cursor: default;
  }

  .recent-list > div:hover {
    background: rgba(255,255,255,0.05);
    border-color: var(--border);
  }

  .recent-list > div:nth-child(1) { animation: fadeSlideUp 0.5s ease both; animation-delay: 1.0s; }
  .recent-list > div:nth-child(2) { animation: fadeSlideUp 0.5s ease both; animation-delay: 1.1s; }
  .recent-list > div:nth-child(3) { animation: fadeSlideUp 0.5s ease both; animation-delay: 1.2s; }

  .recent-list > div > span:first-child {
    font-size: 1rem;
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,0.05);
    border-radius: 7px;
    flex-shrink: 0;
  }

  .recent-list > div > span:nth-child(2) {
    flex: 1;
    font-size: 0.82rem;
    color: var(--text);
    font-weight: 500;
  }

  .recent-list > div > span:last-child {
    font-family: var(--font-head);
    font-size: 0.82rem;
    font-weight: 700;
  }

  .recent-list > div:nth-child(1) > span:last-child { color: var(--red-dim); }
  .recent-list > div:nth-child(2) > span:last-child { color: var(--green-dim); }
  .recent-list > div:nth-child(3) > span:last-child { color: var(--red-dim); }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const Home = () => {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="fintrack-root">
      <style>{styles}</style>
      <div className="grid-bg" />

      {/* ── Navbar ── */}
      <nav className="navbar">
        <div className="logo">
          <span className="logo-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 17l4-8 4 4 4-6 4 10"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="logo-text">FinTrack</span>
        </div>

        <div className="nav-links">
          <Link to="/login" className="nav-link">Sign in</Link>
          <Link to="/register" className="btn-nav-register">Get started</Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <main className="hero">
        <div className="hero-content">
          <div className="badge">Personal Finance Tracker</div>

          <h1 className="hero-title">
            Know where your <br />
            <span className="accent">money goes.</span>
          </h1>

          <p className="hero-desc">
            Track income, log expenses, and stay on budget —
            all in one clean dashboard. No spreadsheets needed.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn-primary">
              Start for free
            </Link>
            <Link to="/login" className="btn-ghost">
              I already have an account
            </Link>
          </div>

          <p className="trust-line">
            Free to use · No credit card required
          </p>
        </div>

        {/* ── Dashboard preview ── */}
        <div className="hero-visual">
          <div className="dashboard-card">
            <div className="card-header">
              <span className="card-label">Monthly Overview</span>
              <span className="card-month">April 2026</span>
            </div>

            <div className="card-stats">
              <div className="stat income">
                <span className="stat-label">Income</span>
                <span className="stat-value">₹84,500</span>
                <span className="stat-change positive">+12%</span>
              </div>
              <div className="stat expense">
                <span className="stat-label">Expenses</span>
                <span className="stat-value">₹31,200</span>
                <span className="stat-change negative">+4%</span>
              </div>
              <div className="stat balance">
                <span className="stat-label">Balance</span>
                <span className="stat-value green">₹53,300</span>
              </div>
            </div>

            <div className="bar-chart">
              {[60, 80, 45, 90, 55, 70, 38].map((h, i) => (
                <div key={i}><div style={{ height: `${h}%` }} /></div>
              ))}
            </div>

            <div className="bar-labels">
              {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                <span key={d}>{d}</span>
              ))}
            </div>

            <div className="recent-list">
              {[
                { icon: "🛒", label: "Groceries",  amt: "-₹1,200"  },
                { icon: "💼", label: "Salary",     amt: "+₹42,000" },
                { icon: "⚡", label: "Electricity", amt: "-₹850"   },
              ].map((item, i) => (
                <div key={i}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  <span>{item.amt}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;