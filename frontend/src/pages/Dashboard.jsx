import React, { useEffect, useState } from 'react';
import api from "../services/api";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const dashStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg:        #0b0e14;
    --surface:   #161b27;
    --surface2:  #1c2335;
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

  /* ── Root ── */
  .dash-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    position: relative;
    overflow-x: hidden;
  }

  /* ── Grid background ── */
  .dash-grid-bg {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(198,241,53,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(198,241,53,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .dash-grid-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 55% 45% at 80% 10%, rgba(198,241,53,0.05) 0%, transparent 65%),
      radial-gradient(ellipse 40% 50% at 15% 80%, rgba(90,110,255,0.04) 0%, transparent 65%);
  }

  /* ── Wrapper ── */
  .dash-wrapper {
    position: relative;
    z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 6rem 2rem 4rem;
    animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }

  /* ── Eyebrow + Title ── */
  .dash-eyebrow {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    padding: 0.3rem 0.8rem;
    border: 1px solid rgba(198,241,53,0.3);
    background: rgba(198,241,53,0.07);
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--lime);
    margin-bottom: 0.85rem;
  }

  .dash-eyebrow::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--lime);
    box-shadow: 0 0 6px var(--lime);
    animation: pulseDot 2s ease-in-out infinite;
  }

  @keyframes pulseDot {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.65); }
  }

  .dash-title {
    font-family: var(--font-head);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 1.75rem;
    line-height: 1.1;
  }

  .dash-title .accent {
    color: var(--lime);
    position: relative;
    display: inline-block;
  }

  .dash-title .accent::after {
    content: '';
    position: absolute;
    bottom: 2px; left: 0; right: 0;
    height: 3px;
    background: var(--lime);
    opacity: 0.28;
    border-radius: 2px;
  }

  /* ── Month / Year Selector ── */
  .dash-filters {
    display: flex;
    align-items: center;
    gap: 0.65rem;
    margin-bottom: 1.75rem;
    flex-wrap: wrap;
  }

  .dash-select,
  .dash-year-input {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 0.88rem;
    font-weight: 500;
    padding: 0.55rem 0.9rem;
    outline: none;
    cursor: pointer;
    transition: border-color 0.18s, box-shadow 0.18s;
    appearance: none;
    -webkit-appearance: none;
  }

  .dash-select {
    padding-right: 2.2rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7590' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
  }

  .dash-year-input {
    width: 90px;
    text-align: center;
  }

  /* Remove number input arrows */
  .dash-year-input::-webkit-outer-spin-button,
  .dash-year-input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  .dash-year-input[type=number] { -moz-appearance: textfield; }

  .dash-select:focus,
  .dash-year-input:focus {
    border-color: rgba(198,241,53,0.4);
    box-shadow: 0 0 0 3px rgba(198,241,53,0.07);
  }

  .dash-select option,
  .dash-year-input option {
    background: var(--surface2);
    color: var(--text);
  }

  /* ── Stats Grid ── */
  .dash-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
    margin-bottom: 1.75rem;
  }

  @media (max-width: 700px) {
    .dash-stats { grid-template-columns: 1fr; }
  }

  .dash-stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.5rem 1.4rem;
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
    position: relative;
    overflow: hidden;
    transition: border-color 0.2s, transform 0.2s;
    animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }

  .dash-stat-card:nth-child(1) { animation-delay: 0.1s; }
  .dash-stat-card:nth-child(2) { animation-delay: 0.2s; }
  .dash-stat-card:nth-child(3) { animation-delay: 0.3s; }

  .dash-stat-card:hover {
    border-color: rgba(198,241,53,0.18);
    transform: translateY(-2px);
  }

  .dash-stat-card::before {
    content: '';
    position: absolute;
    top: 0; right: 0;
    width: 80px; height: 80px;
    border-radius: 0 16px 0 80px;
    opacity: 0.06;
    transition: opacity 0.2s;
  }

  .dash-stat-card:hover::before { opacity: 0.12; }

  .dash-stat-card:nth-child(1)::before { background: var(--green-dim); }
  .dash-stat-card:nth-child(2)::before { background: var(--red-dim); }
  .dash-stat-card:nth-child(3)::before { background: var(--lime); }

  .stat-card-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .stat-card-value {
    font-family: var(--font-head);
    font-size: clamp(1.5rem, 2.5vw, 2rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    line-height: 1;
  }

  .stat-card-value.income  { color: var(--green-dim); }
  .stat-card-value.expense { color: var(--red-dim); }
  .stat-card-value.balance { color: var(--lime); }

  /* ── Chart Card ── */
  .dash-chart-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 1.6rem;
    box-shadow:
      0 0 0 1px rgba(198,241,53,0.04),
      0 20px 60px rgba(0,0,0,0.4);
    animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.4s;
    position: relative;
    overflow: hidden;
  }

  .dash-chart-card::before {
    content: '';
    position: absolute;
    top: -60%; left: -60%;
    width: 60%; height: 200%;
    background: linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.025) 50%, transparent 60%);
    transform: skewX(-15deg);
    animation: shimmer 5s ease-in-out infinite;
    pointer-events: none;
  }

  @keyframes shimmer {
    0%       { left: -60%; }
    60%, 100%{ left: 140%; }
  }

  .dash-chart-label {
    display: block;
    font-family: var(--font-head);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 1.25rem;
  }

  .dash-chart-card canvas {
    height: 280px !important;
    position: relative;
    z-index: 1;
  }

  /* ── Loading state ── */
  .dash-loading {
    height: 280px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.88rem;
    color: var(--muted);
    gap: 0.6rem;
  }

  .dash-loading::before {
    content: '';
    width: 16px; height: 16px;
    border: 2px solid var(--border);
    border-top-color: var(--lime);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* ── Keyframes ── */
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

const Dashboard = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);

  // ✅ NEW: month & year state
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());

  // ✅ UPDATED: now sends month & year
  const fetchDashboard = async () => {
    try {
      const res = await api.get(`/dashboard?month=${month}&year=${year}`);

      setTotalIncome(res.data.totalIncome);
      setTotalExpense(res.data.totalExpense);
      setBalance(res.data.remainingBalance);

    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED: refetch when month/year changes
  useEffect(() => {
    fetchDashboard();
  }, [month, year]);

  const chartData = {
    labels: ["Income", "Expense"],
    datasets: [{
      label: "Amount (₹)",
      data: [totalIncome, totalExpense],
      backgroundColor: ["rgba(75,224,138,0.75)", "rgba(255,90,90,0.75)"],
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: {
          color: "#6b7590",
          font: { family: "'DM Sans', sans-serif", size: 12 }
        }
      },
      tooltip: {
        backgroundColor: "#161b27",
        borderColor: "rgba(255,255,255,0.07)",
        borderWidth: 1,
        titleColor: "#e8ecf4",
        bodyColor: "#6b7590",
      }
    },
    scales: {
      x: {
        ticks: { color: "#6b7590", font: { family: "'DM Sans', sans-serif" } },
        grid: { color: "rgba(255,255,255,0.04)" }
      },
      y: {
        ticks: { color: "#6b7590", font: { family: "'DM Sans', sans-serif" } },
        grid: { color: "rgba(255,255,255,0.04)" }
      }
    }
  };

  return (
    <div className="dash-root">
      <style>{dashStyles}</style>
      <div className="dash-grid-bg" />

      <div className="dash-wrapper">
        <span className="dash-eyebrow">Overview</span>
        <h1 className="dash-title">
          Your <span className="accent">Dashboard</span>
        </h1>

        {/* ✅ NEW: Month & Year Selector */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
          <select
            className="dash-select"
            value={month}
            onChange={(e) => setMonth(Number(e.target.value))}
          >
            {MONTHS.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>

          <input
            type="number"
            className="dash-year-input"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          />
        </div>

        {/* Stats */}
        <div className="dash-stats">
          <div className="dash-stat-card">
            <span className="stat-card-label">Total Income</span>
            <span className="stat-card-value income">
              ₹{totalIncome.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="dash-stat-card">
            <span className="stat-card-label">Total Expense</span>
            <span className="stat-card-value expense">
              ₹{totalExpense.toLocaleString("en-IN")}
            </span>
          </div>

          <div className="dash-stat-card">
            <span className="stat-card-label">Balance</span>
            <span className="stat-card-value balance">
              ₹{balance.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Chart */}
        <div className="dash-chart-card">
          <span className="dash-chart-label">Income vs Expense</span>

          {loading ? (
            <div className="dash-loading">Loading chart…</div>
          ) : (
            <Bar data={chartData} options={chartOptions} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;