import React, { useEffect, useState } from 'react';
import api from "../services/api";

const categories = [
  "Food", "Rent", "Travels", "Bills", "Groceries",
  "Transport", "Shopping", "Entertainment",
  "Medical", "Education", "Others"
];

const expenseStyles = `
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

  .ex-root {
    min-height: 100vh;
    background-color: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    overflow-x: hidden;
    position: relative;
  }

  .ex-root::before, .ex-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .ex-root::before {
    width: 600px; height: 600px;
    top: -200px; right: -150px;
    background: radial-gradient(circle, rgba(198,241,53,0.06) 0%, transparent 65%);
    animation: orbFloat 10s ease-in-out infinite alternate;
  }

  .ex-root::after {
    width: 500px; height: 500px;
    bottom: -150px; left: -100px;
    background: radial-gradient(circle, rgba(90,110,255,0.05) 0%, transparent 65%);
    animation: orbFloat 13s ease-in-out infinite alternate-reverse;
  }

  @keyframes orbFloat {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(30px,20px) scale(1.06); }
  }

  .ex-grid-bg {
    position: fixed; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(198,241,53,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(198,241,53,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .ex-grid-bg::after {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 75% 40%, rgba(198,241,53,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 20% 70%, rgba(100,120,255,0.04) 0%, transparent 70%);
  }

  .ex-main {
    position: relative; z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 7rem 2rem 4rem;
  }

  /* ── Header ── */
  .ex-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 0.75rem;
    animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.05s;
  }

  .ex-eyebrow {
    font-family: var(--font-head);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--lime);
    display: block;
    margin-bottom: 0.3rem;
  }

  .ex-title {
    font-family: var(--font-head);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
  }

  .ex-total-badge {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.2rem;
  }

  .ex-total-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .ex-total-value {
    font-family: var(--font-head);
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--red-dim);
    letter-spacing: -0.02em;
  }

  .ex-divider {
    height: 1px;
    background: var(--border);
    margin-bottom: 2rem;
    animation: fadeSlideUp 0.5s ease both;
    animation-delay: 0.1s;
  }

  /* ── Layout ── */
  .ex-layout {
    display: grid;
    grid-template-columns: 360px 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  @media (max-width: 800px) {
    .ex-layout { grid-template-columns: 1fr; }
  }

  /* ── Card ── */
  .ex-card {
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

  .ex-card::before {
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
    0%       { left: -60%; }
    60%, 100%{ left: 140%; }
  }

  .ex-card-title {
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
  .ex-form { display: flex; flex-direction: column; gap: 1rem; }

  .ex-field { display: flex; flex-direction: column; gap: 0.4rem; }

  .ex-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .ex-input {
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

  .ex-input::placeholder { color: var(--muted); }

  .ex-input:focus {
    border-color: rgba(198,241,53,0.4);
    background: rgba(198,241,53,0.03);
  }

  .ex-input::-webkit-inner-spin-button,
  .ex-input::-webkit-outer-spin-button { -webkit-appearance: none; }

  /* Select wrapper with custom arrow */
  .ex-select-wrap {
    position: relative;
  }

  .ex-select-wrap::after {
    content: '▾';
    position: absolute;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
    color: var(--muted);
    pointer-events: none;
    font-size: 0.8rem;
  }

  .ex-input option {
    background: #161b27;
    color: var(--text);
  }

  /* Category pill tags row */
  .ex-category-tag {
    display: inline-flex;
    align-items: center;
    padding: 0.18rem 0.55rem;
    background: rgba(198,241,53,0.08);
    border: 1px solid rgba(198,241,53,0.2);
    border-radius: 999px;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--lime);
  }

  .ex-form-actions { display: flex; gap: 0.75rem; margin-top: 0.25rem; }

  .ex-submit {
    flex: 1;
    padding: 0.78rem 1.4rem;
    background: var(--lime);
    color: #0b0e14;
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 0.88rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
  }

  .ex-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    background: #d4f94a;
    box-shadow: 0 10px 30px rgba(198,241,53,0.25);
  }

  .ex-submit:disabled { opacity: 0.4; cursor: not-allowed; }

  .ex-cancel {
    padding: 0.78rem 1.1rem;
    background: transparent;
    color: var(--muted);
    font-family: var(--font-head);
    font-size: 0.88rem;
    font-weight: 700;
    border: 1px solid var(--border);
    border-radius: 10px;
    cursor: pointer;
    transition: color 0.18s, border-color 0.18s;
  }

  .ex-cancel:hover {
    color: var(--text);
    border-color: rgba(255,255,255,0.18);
  }

  /* ── List ── */
  .ex-list-title {
    font-family: var(--font-head);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 1rem;
  }

  .ex-empty {
    color: var(--muted);
    font-size: 0.88rem;
    text-align: center;
    padding: 2.5rem 0;
  }

  .ex-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.75rem 0.85rem;
    border-radius: 12px;
    background: rgba(255,255,255,0.02);
    border: 1px solid transparent;
    margin-bottom: 0.5rem;
    transition: background 0.15s, border-color 0.15s;
    animation: fadeSlideUp 0.5s ease both;
  }

  .ex-item:last-child { margin-bottom: 0; }

  .ex-item:hover {
    background: rgba(255,255,255,0.05);
    border-color: var(--border);
  }

  .ex-item-source {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text);
    margin-bottom: 0.3rem;
  }

  .ex-item-meta {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .ex-item-date {
    font-size: 0.72rem;
    color: var(--muted);
  }

  .ex-item-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .ex-item-amount {
    font-family: var(--font-head);
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--red-dim);
    min-width: 80px;
    text-align: right;
  }

  .ex-btn-edit {
    padding: 0.35rem 0.75rem;
    background: rgba(255,255,255,0.05);
    color: var(--muted);
    font-family: var(--font-head);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    border: 1px solid var(--border);
    border-radius: 7px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
  }

  .ex-btn-edit:hover {
    color: var(--lime);
    border-color: rgba(198,241,53,0.3);
    background: rgba(198,241,53,0.06);
  }

  .ex-btn-delete {
    padding: 0.35rem 0.75rem;
    background: transparent;
    color: var(--muted);
    font-family: var(--font-head);
    font-size: 0.72rem;
    font-weight: 700;
    border: 1px solid transparent;
    border-radius: 7px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
  }

  .ex-btn-delete:hover {
    color: var(--red-dim);
    border-color: rgba(255,90,90,0.25);
    background: rgba(255,90,90,0.07);
  }

  .ex-btn-delete:disabled { opacity: 0.4; cursor: not-allowed; }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const Expense = () => {
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [expense, setExpense] = useState([]);
  const [editId, setEditId] = useState(null);
  const [visible, setVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchExpense = async () => {
    try {
      const res = await api.get("/expense");
      setExpense(res.data.expenses);
    } catch (err) {
      console.log(err.message);
    } finally {
      setTimeout(() => setVisible(true), 80);
    }
  };

  useEffect(() => { fetchExpense(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !category || !description || !date) return;
    setSubmitting(true);
    try {
      if (editId) {
        await api.put(`/expense/${editId}`, { amount, category, description, date });
        setEditId(null);
      } else {
        await api.post("/expense", { amount, category, description, date });
      }
      setAmount(""); setCategory(""); setDescription(""); setDate("");
      fetchExpense();
    } catch (err) {
      console.log(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/expense/${id}`);
      fetchExpense();
    } catch (err) {
      console.log(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (item) => {
    setAmount(item.amount);
    setCategory(item.category);
    setDescription(item.description);
    setDate(item.date ? item.date.split("T")[0] : "")
    setEditId(item._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancel = () => {
    setEditId(null);
    setAmount(""); setCategory(""); setDescription(""); setDate("");
  };

  const total = expense.reduce((sum, i) => sum + Number(i.amount), 0);

  return (
    <div className="ex-root">
      <style>{expenseStyles}</style>
      <div className="ex-grid-bg" />

      <main className="ex-main">

        {/* Header */}
        <div className="ex-header">
          <div>
            <span className="ex-eyebrow">Tracking</span>
            <h1 className="ex-title">Expenses</h1>
          </div>
          <div className="ex-total-badge">
            <span className="ex-total-label">Total</span>
            <span className="ex-total-value">
              ₹{total.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="ex-divider" />

        <div className="ex-layout">

          {/* ── Form Card ── */}
          <div className="ex-card">
            <span className="ex-card-title">
              {editId ? "Edit Expense" : "Add Expense"}
            </span>

            <form onSubmit={handleSubmit} className="ex-form">

              {/* Amount */}
              <div className="ex-field">
                <label className="ex-label">Amount</label>
                <input
                  type="number"
                  className="ex-input"
                  placeholder="0"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                />
              </div>

              {/* Category */}
              <div className="ex-field">
                <label className="ex-label">Category</label>
                <div className="ex-select-wrap">
                  <select
                    className="ex-input"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                  >
                    <option value="">Select category…</option>
                    {categories.map((cat, i) => (
                      <option key={i} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div className="ex-field">
                <label className="ex-label">Description</label>
                <input
                  type="text"
                  className="ex-input"
                  placeholder="e.g. Weekly groceries"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
              </div>

              <div className="ex-field">
                <label className="ex-label">Date</label>
                <input
                  type="date"
                  className="ex-input"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                />
              </div>

              <div className="ex-form-actions">
                <button
                  type="submit"
                  className="ex-submit"
                  disabled={submitting || !amount || !category || !description}
                >
                  {submitting ? "Saving…" : editId ? "Update" : "Add Expense"}
                </button>

                {editId && (
                  <button
                    type="button"
                    className="ex-cancel"
                    onClick={handleCancel}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* ── List Card ── */}
          <div className="ex-card">
            <div className="ex-list-title">
              Expense List ({expense.length})
            </div>

            {expense.length === 0 ? (
              <p className="ex-empty">No expenses found</p>
            ) : (
              expense.map((item, idx) => (
                <div
                  key={item._id}
                  className="ex-item"
                  style={{ animationDelay: `${0.05 * idx}s` }}
                >
                  <div>
                    <div className="ex-item-source">{item.description}</div>
                    <div className="ex-item-meta">
                      <span className="ex-category-tag">{item.category}</span>
                      <span className="ex-item-date">
                        {new Date(item.date).toLocaleDateString("en-IN")}
                      </span>
                    </div>
                  </div>

                  <div className="ex-item-right">
                    <span className="ex-item-amount">
                      ₹{Number(item.amount).toLocaleString("en-IN")}
                    </span>
                    <button
                      className="ex-btn-edit"
                      onClick={() => handleEdit(item)}
                    >
                      Edit
                    </button>
                    <button
                      className="ex-btn-delete"
                      onClick={() => handleDelete(item._id)}
                      disabled={deletingId === item._id}
                    >
                      {deletingId === item._id ? "Deleting…" : "Delete"}
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default Expense;