import React, { useEffect, useState } from "react";
import api from "../services/api";

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const budgetStyles = `
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

  .bu-root {
    min-height: 100vh;
    background-color: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    overflow-x: hidden;
    position: relative;
  }

  .bu-root::before, .bu-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .bu-root::before {
    width: 600px; height: 600px;
    top: -200px; right: -150px;
    background: radial-gradient(circle, rgba(198,241,53,0.06) 0%, transparent 65%);
    animation: orbFloat 10s ease-in-out infinite alternate;
  }

  .bu-root::after {
    width: 500px; height: 500px;
    bottom: -150px; left: -100px;
    background: radial-gradient(circle, rgba(90,110,255,0.05) 0%, transparent 65%);
    animation: orbFloat 13s ease-in-out infinite alternate-reverse;
  }

  @keyframes orbFloat {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(30px,20px) scale(1.06); }
  }

  .bu-grid-bg {
    position: fixed; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(198,241,53,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(198,241,53,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .bu-grid-bg::after {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 75% 40%, rgba(198,241,53,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 20% 70%, rgba(100,120,255,0.04) 0%, transparent 70%);
  }

  .bu-main {
    position: relative; z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 7rem 2rem 4rem;
  }

  /* ── Header ── */
  .bu-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 0.75rem;
    animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.05s;
  }

  .bu-eyebrow {
    font-family: var(--font-head);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--lime);
    display: block;
    margin-bottom: 0.3rem;
  }

  .bu-title {
    font-family: var(--font-head);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
  }

  .bu-period-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0.85rem;
    border: 1px solid rgba(198,241,53,0.3);
    background: rgba(198,241,53,0.07);
    border-radius: 999px;
    font-family: var(--font-head);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--lime);
    animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.1s;
  }

  .bu-divider {
    height: 1px;
    background: var(--border);
    margin-bottom: 2rem;
    animation: fadeSlideUp 0.5s ease both;
    animation-delay: 0.1s;
  }

  /* ── Layout ── */
  .bu-layout {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  @media (max-width: 800px) {
    .bu-layout { grid-template-columns: 1fr; }
  }

  /* ── Card ── */
  .bu-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 1.6rem;
    box-shadow:
      0 0 0 1px rgba(198,241,53,0.06),
      0 24px 64px rgba(0,0,0,0.5),
      inset 0 0 80px rgba(198,241,53,0.02);
    position: relative;
    overflow: hidden;
    animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.15s;
  }

  .bu-card::before {
    content: '';
    position: absolute;
    top: -60%; left: -60%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%);
    transform: skewX(-15deg);
    animation: shimmer 4s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes shimmer {
    0%        { left: -60%; }
    60%, 100% { left: 140%; }
  }

  .bu-card-title {
    font-family: var(--font-head);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 1.25rem;
    display: block;
  }

  /* ── Form ── */
  .bu-form { display: flex; flex-direction: column; gap: 1rem; }

  .bu-field { display: flex; flex-direction: column; gap: 0.4rem; }

  .bu-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .bu-input, .bu-select {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.72rem 1rem;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 0.9rem;
    outline: none;
    transition: border-color 0.18s, background 0.18s;
    width: 100%;
    appearance: none;
    -webkit-appearance: none;
  }

  .bu-input::placeholder { color: var(--muted); }

  .bu-input:focus, .bu-select:focus {
    border-color: rgba(198,241,53,0.4);
    background: rgba(198,241,53,0.03);
  }

  .bu-input::-webkit-inner-spin-button,
  .bu-input::-webkit-outer-spin-button { -webkit-appearance: none; }

  .bu-select-wrap {
    position: relative;
  }

  .bu-select-wrap::after {
    content: '▾';
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
    font-size: 0.8rem;
  }

  .bu-select option {
    background: #161b27;
    color: var(--text);
  }

  .bu-submit {
    width: 100%;
    padding: 0.78rem 1.4rem;
    background: var(--lime);
    color: #0b0e14;
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 0.88rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    margin-top: 0.25rem;
    transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
  }

  .bu-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    background: #d4f94a;
    box-shadow: 0 10px 30px rgba(198,241,53,0.25);
  }

  .bu-submit:disabled { opacity: 0.4; cursor: not-allowed; }

  /* ── Stats grid ── */
  .bu-stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
  }

  .bu-stat {
    background: rgba(255,255,255,0.02);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.85rem 1rem;
    transition: border-color 0.18s, transform 0.18s;
  }

  .bu-stat:hover {
    border-color: rgba(198,241,53,0.18);
    transform: translateY(-2px);
  }

  .bu-stat-label {
    font-size: 0.66rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    display: block;
    margin-bottom: 0.35rem;
  }

  .bu-stat-value {
    font-family: var(--font-head);
    font-size: 1.15rem;
    font-weight: 800;
    letter-spacing: -0.02em;
    display: block;
  }

  .bu-stat-value.limit  { color: var(--lime); }
  .bu-stat-value.spent  { color: var(--red-dim); }
  .bu-stat-value.remain { color: var(--green-dim); }
  .bu-stat-value.usage  { color: var(--text); }

  /* ── Progress bar ── */
  .bu-progress-label {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .bu-progress-text {
    font-family: var(--font-head);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .bu-progress-pct {
    font-family: var(--font-head);
    font-size: 0.82rem;
    font-weight: 800;
    transition: color 0.3s;
  }

  .bu-progress-track {
    height: 8px;
    background: rgba(255,255,255,0.06);
    border-radius: 999px;
    overflow: hidden;
  }

  .bu-progress-fill {
    height: 100%;
    border-radius: 999px;
    transition: width 0.9s cubic-bezier(0.22,1,0.36,1);
  }

  .bu-progress-fill.safe    { background: linear-gradient(90deg, var(--green-dim), #82efb0); }
  .bu-progress-fill.warning { background: linear-gradient(90deg, #f0c040, #f8e070); }
  .bu-progress-fill.danger  { background: linear-gradient(90deg, var(--red-dim), #ff8a8a); }

  /* ── Warning banner ── */
  .bu-warning-banner {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-top: 1rem;
    padding: 0.7rem 0.9rem;
    border-radius: 10px;
    font-size: 0.82rem;
    font-weight: 600;
    animation: fadeSlideUp 0.4s ease both;
  }

  .bu-warning-banner.warning {
    background: rgba(240,192,64,0.08);
    border: 1px solid rgba(240,192,64,0.25);
    color: #f0c040;
  }

  .bu-warning-banner.danger {
    background: rgba(255,90,90,0.08);
    border: 1px solid rgba(255,90,90,0.25);
    color: var(--red-dim);
  }

  /* ── Empty state ── */
  .bu-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 3rem 1rem;
    color: var(--muted);
    text-align: center;
  }

  .bu-empty-icon {
    font-size: 2rem;
    margin-bottom: 0.25rem;
    opacity: 0.5;
  }

  .bu-empty p {
    font-size: 0.88rem;
    line-height: 1.7;
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const Budget = () => {
  const [month, setMonth]             = useState(new Date().getMonth() + 1);
  const [year, setYear]               = useState(new Date().getFullYear());
  const [limitAmount, setLimitAmount] = useState("");
  const [budget, setBudget]           = useState(null);
  const [status, setStatus]           = useState(null);
  const [submitting, setSubmitting]   = useState(false);

  const fetchBudget = async () => {
    try {
      const res = await api.get(`/budget/get-budget`, { params: { month, year } });
      setBudget(res.data.budget);
    } catch {
      setBudget(null);
    }
  };

  const fetchStatus = async () => {
    try {
      const res = await api.get(`/budget/budget-status`, { params: { month, year } });
      setStatus(res.data);
    } catch {
      setStatus(null);
    }
  };

  useEffect(() => {
    fetchBudget();
    fetchStatus();
  }, [month, year]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!limitAmount) return;
    setSubmitting(true);
    try {
      if (budget) {
        await api.put(`/budget/update-budget/${budget._id}`, {
          limitAmount: Number(limitAmount)
        });
      } else {
        await api.post(`/budget/set-budget`, {
          month, year, limitAmount: Number(limitAmount)
        });
      }
      setLimitAmount("");
      fetchBudget();
      fetchStatus();
    } catch (err) {
      console.log(err.response?.data?.message);
    } finally {
      setSubmitting(false);
    }
  };

  const limit     = status?.budget    ?? 0;
  const spent     = status?.expense   ?? 0;
  const remaining = status?.remaining ?? 0;

  const progress = limit > 0 ? Math.min(100, (spent / limit) * 100) : 0;

  const progressClass =
    progress >= 90 ? "danger" :
    progress >= 70 ? "warning" : "safe";

  const progressColor =
    progress >= 90 ? "var(--red-dim)" :
    progress >= 70 ? "#f0c040" : "var(--green-dim)";

  return (
    <div className="bu-root">
      <style>{budgetStyles}</style>
      <div className="bu-grid-bg" />

      <main className="bu-main">

        {/* ── Header ── */}
        <div className="bu-header">
          <div>
            <span className="bu-eyebrow">Planning</span>
            <h1 className="bu-title">Budget</h1>
          </div>
          <span className="bu-period-badge">
            {MONTHS[month - 1]} {year}
          </span>
        </div>

        <div className="bu-divider" />

        <div className="bu-layout">

          {/* ── Form Card ── */}
          <div className="bu-card">
            <span className="bu-card-title">
              {budget ? "Update Budget" : "Set Budget"}
            </span>

            <form onSubmit={handleSubmit} className="bu-form">

              <div className="bu-field">
                <label className="bu-label">Month</label>
                <div className="bu-select-wrap">
                  <select
                    className="bu-select"
                    value={month}
                    onChange={e => setMonth(Number(e.target.value))}
                  >
                    {MONTHS.map((m, i) => (
                      <option key={i} value={i + 1}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="bu-field">
                <label className="bu-label">Year</label>
                <input
                  type="number"
                  className="bu-input"
                  value={year}
                  onChange={e => setYear(Number(e.target.value))}
                />
              </div>

              <div className="bu-field">
                <label className="bu-label">Budget Limit (₹)</label>
                <input
                  type="number"
                  className="bu-input"
                  placeholder="Enter amount"
                  value={limitAmount}
                  onChange={e => setLimitAmount(e.target.value)}
                />
              </div>

              <button
                type="submit"
                className="bu-submit"
                disabled={submitting || !limitAmount}
              >
                {submitting ? "Saving…" : budget ? "Update Budget" : "Set Budget"}
              </button>

            </form>
          </div>

          {/* ── Stats Card ── */}
          <div className="bu-card">
            <span className="bu-card-title">Budget Overview</span>

            {status ? (
              <>
                <div className="bu-stats">
                  <div className="bu-stat">
                    <span className="bu-stat-label">Limit</span>
                    <span className="bu-stat-value limit">
                      ₹{limit.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="bu-stat">
                    <span className="bu-stat-label">Spent</span>
                    <span className="bu-stat-value spent">
                      ₹{spent.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="bu-stat">
                    <span className="bu-stat-label">Remaining</span>
                    <span className="bu-stat-value remain">
                      ₹{remaining.toLocaleString("en-IN")}
                    </span>
                  </div>

                  <div className="bu-stat">
                    <span className="bu-stat-label">Usage</span>
                    <span className="bu-stat-value usage">
                      {progress.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="bu-progress-label">
                  <span className="bu-progress-text">Budget used</span>
                  <span className="bu-progress-pct" style={{ color: progressColor }}>
                    {progress.toFixed(1)}%
                  </span>
                </div>

                <div className="bu-progress-track">
                  <div
                    className={`bu-progress-fill ${progressClass}`}
                    style={{ width: `${progress}%` }}
                  />
                </div>

                {/* Warning banner */}
                {progress >= 70 && (
                  <div className={`bu-warning-banner ${progressClass}`}>
                    <span>{progress >= 90 ? "⚠️" : "💡"}</span>
                    <span>
                      {progress >= 90
                        ? `Budget almost exhausted! Only ₹${remaining.toLocaleString("en-IN")} left.`
                        : `You've used ${progress.toFixed(0)}% of your budget. Spend carefully.`
                      }
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="bu-empty">
                <div className="bu-empty-icon">📊</div>
                <p>No budget set for<br />{MONTHS[month - 1]} {year}</p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Budget;