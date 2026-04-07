import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from "../services/api";

const incomeStyles = `
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

  .in-root {
    min-height: 100vh;
    background-color: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    overflow-x: hidden;
    position: relative;
  }

  .in-root::before, .in-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .in-root::before {
    width: 600px; height: 600px;
    top: -200px; right: -150px;
    background: radial-gradient(circle, rgba(198,241,53,0.06) 0%, transparent 65%);
    animation: orbFloat 10s ease-in-out infinite alternate;
  }

  .in-root::after {
    width: 500px; height: 500px;
    bottom: -150px; left: -100px;
    background: radial-gradient(circle, rgba(90,110,255,0.05) 0%, transparent 65%);
    animation: orbFloat 13s ease-in-out infinite alternate-reverse;
  }

  @keyframes orbFloat {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(30px,20px) scale(1.06); }
  }

  .in-noise {
    position: fixed; inset: 0; z-index: 0;
    background-image:
      linear-gradient(rgba(198,241,53,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(198,241,53,0.03) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .in-noise::after {
    content: '';
    position: absolute; inset: 0;
    background:
      radial-gradient(ellipse 60% 50% at 75% 40%, rgba(198,241,53,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 40% 60% at 20% 70%, rgba(100,120,255,0.04) 0%, transparent 70%);
  }

  .in-main {
    position: relative; z-index: 1;
    max-width: 1100px;
    margin: 0 auto;
    padding: 7rem 2rem 4rem;
  }

  /* Header */
  .in-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 0.75rem;
  }

  .in-eyebrow {
    font-family: var(--font-head);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--lime);
    display: block;
    margin-bottom: 0.3rem;
  }

  .in-title {
    font-family: var(--font-head);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
  }

  .in-total-badge {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 0.2rem;
  }

  .in-total-label {
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .in-total-value {
    font-family: var(--font-head);
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--green-dim);
    letter-spacing: -0.02em;
  }

  .in-divider {
    height: 1px;
    background: var(--border);
    margin-bottom: 2rem;
  }

  /* Layout */
  .in-layout {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  @media (max-width: 800px) {
    .in-layout { grid-template-columns: 1fr; }
  }

  /* Card */
  .in-card {
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
  }

  .in-card::before {
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

  .in-card-header {
    margin-bottom: 1.25rem;
  }

  .in-card-title {
    font-family: var(--font-head);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
  }

  /* Form */
  .in-form { display: flex; flex-direction: column; gap: 1rem; }

  .in-field { display: flex; flex-direction: column; gap: 0.4rem; }

  .in-label {
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--muted);
  }

  .in-input {
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
  }

  .in-input::placeholder { color: var(--muted); }

  .in-input:focus {
    border-color: rgba(198,241,53,0.4);
    background: rgba(198,241,53,0.03);
  }

  /* Remove number spinners */
  .in-input::-webkit-inner-spin-button,
  .in-input::-webkit-outer-spin-button { -webkit-appearance: none; }

  .in-form-actions { display: flex; gap: 0.75rem; }

  .in-submit {
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

  .in-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    background: #d4f94a;
    box-shadow: 0 10px 30px rgba(198,241,53,0.25);
  }

  .in-submit:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  .in-cancel {
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

  .in-cancel:hover {
    color: var(--text);
    border-color: rgba(255,255,255,0.18);
  }

  /* List card title */
  .in-list-title {
    font-family: var(--font-head);
    font-size: 0.78rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 1rem;
  }

  .in-empty {
    color: var(--muted);
    font-size: 0.88rem;
    text-align: center;
    padding: 2rem 0;
  }

  /* List items */
  .in-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.7rem 0.8rem;
    border-radius: 10px;
    background: rgba(255,255,255,0.02);
    border: 1px solid transparent;
    margin-bottom: 0.5rem;
    transition: background 0.15s, border-color 0.15s;
  }

  .in-item:last-child { margin-bottom: 0; }

  .in-item:hover {
    background: rgba(255,255,255,0.05);
    border-color: var(--border);
  }

  .in-item-source {
    font-size: 0.88rem;
    font-weight: 600;
    color: var(--text);
  }

  .in-item-date {
    font-size: 0.73rem;
    color: var(--muted);
    margin-top: 0.15rem;
  }

  .in-item-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .in-item-amount {
    font-family: var(--font-head);
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--green-dim);
    min-width: 80px;
    text-align: right;
  }

  .in-btn-edit {
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

  .in-btn-edit:hover {
    color: var(--lime);
    border-color: rgba(198,241,53,0.3);
    background: rgba(198,241,53,0.06);
  }

  .in-btn-delete {
    padding: 0.35rem 0.75rem;
    background: transparent;
    color: var(--muted);
    font-family: var(--font-head);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    border: 1px solid transparent;
    border-radius: 7px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s, background 0.15s;
  }

  .in-btn-delete:hover {
    color: var(--red-dim);
    border-color: rgba(255,90,90,0.25);
    background: rgba(255,90,90,0.07);
  }

  .in-btn-confirm {
    padding: 0.35rem 0.75rem;
    background: rgba(255,90,90,0.15);
    color: var(--red-dim);
    font-family: var(--font-head);
    font-size: 0.72rem;
    font-weight: 700;
    border: 1px solid rgba(255,90,90,0.3);
    border-radius: 7px;
    cursor: pointer;
  }

  .in-btn-no {
    padding: 0.35rem 0.75rem;
    background: transparent;
    color: var(--muted);
    font-family: var(--font-head);
    font-size: 0.72rem;
    font-weight: 700;
    border: 1px solid var(--border);
    border-radius: 7px;
    cursor: pointer;
  }

  /* Animations */
  .in-hidden { opacity: 0; transform: translateY(18px); }
  .in-fade-in { animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both; }
  .in-fade-up { animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both; animation-delay: 0.15s; }
  .in-line-in { animation: fadeSlideUp 0.5s ease both; animation-delay: 0.08s; }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const Income = () => {
  const [amount, setAmount]             = useState("");
  const [source, setSource]             = useState("");
  const [income, setIncome]             = useState([]);
  const [editId, setEditId]             = useState(null);
  const [loading, setLoading]           = useState(false);
  const [fetching, setFetching]         = useState(true);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [visible, setVisible]           = useState(false);

  const fetchIncome = async () => {
    setFetching(true);
    try {
      const res = await api.get("/income");
      setIncome(res.data.incomes);
    } catch {
      toast.error("Failed to load income");
    } finally {
      setFetching(false);
      setTimeout(() => setVisible(true), 80);
    }
  };

  useEffect(() => { fetchIncome(); }, []);

  useEffect(() => {
    if (deleteConfirm) {
      const t = setTimeout(() => setDeleteConfirm(null), 3000);
      return () => clearTimeout(t);
    }
  }, [deleteConfirm]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !source) { toast.error("Please fill in all fields"); return; }
    if (Number(amount) <= 0) { toast.error("Amount must be greater than 0"); return; }
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/income/${editId}`, { amount, source });
        toast.success("Income updated");
        setEditId(null);
      } else {
        await api.post("/income", { amount, source });
        toast.success("Income added");
      }
      setAmount(""); setSource("");
      fetchIncome();
    } catch (err) {
      toast.error(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/income/${id}`);
      toast.success("Income deleted");
      setDeleteConfirm(null);
      fetchIncome();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const handleEdit = (item) => {
    setAmount(item.amount); setSource(item.source); setEditId(item._id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancel = () => { setEditId(null); setAmount(""); setSource(""); };

  const totalIncome = income.reduce((sum, item) => sum + Number(item.amount), 0);

  return (
    <div className="in-root">
      <style>{incomeStyles}</style>
      <div className="in-noise" />

      <main className="in-main">
        <div className={`in-header ${visible ? "in-fade-in" : "in-hidden"}`}>
          <div>
            <span className="in-eyebrow">Tracking</span>
            <h1 className="in-title">Income</h1>
          </div>
          <div className="in-total-badge">
            <span className="in-total-label">Total</span>
            <span className="in-total-value">₹{totalIncome.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className={`in-divider ${visible ? "in-line-in" : "in-hidden"}`} />

        <div className="in-layout">
          {/* Form */}
          <div className={`in-card ${visible ? "in-fade-up" : "in-hidden"}`}>
            <div className="in-card-header">
              <span className="in-card-title">{editId ? "Edit Income" : "Add Income"}</span>
            </div>
            <form onSubmit={handleSubmit} className="in-form">
              <div className="in-field">
                <label className="in-label">Amount</label>
                <input type="number" className="in-input" placeholder="0"
                  value={amount} onChange={e => setAmount(e.target.value)} />
              </div>
              <div className="in-field">
                <label className="in-label">Source</label>
                <input type="text" className="in-input" placeholder="Salary / Freelance"
                  value={source} onChange={e => setSource(e.target.value)} />
              </div>
              <div className="in-form-actions">
                <button type="submit" className="in-submit" disabled={loading || !amount || !source}>
                  {loading ? "Processing…" : editId ? "Update" : "Add Income"}
                </button>
                {editId && (
                  <button type="button" className="in-cancel" onClick={handleCancel}>Cancel</button>
                )}
              </div>
            </form>
          </div>

          {/* List */}
          <div className={`in-card ${visible ? "in-fade-up" : "in-hidden"}`}>
            <div className="in-list-title">Income List ({income.length})</div>

            {fetching ? (
              <p className="in-empty">Loading…</p>
            ) : income.length === 0 ? (
              <p className="in-empty">No income added yet</p>
            ) : (
              income.map(item => (
                <div key={item._id} className="in-item">
                  <div>
                    <div className="in-item-source">{item.source}</div>
                    <div className="in-item-date">
                      {item.date ? new Date(item.date).toLocaleDateString('en-IN') : "No date"}
                    </div>
                  </div>
                  <div className="in-item-right">
                    <span className="in-item-amount">₹{Number(item.amount).toLocaleString('en-IN')}</span>
                    <button className="in-btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                    {deleteConfirm === item._id ? (
                      <>
                        <button className="in-btn-confirm" onClick={() => handleDelete(item._id)}>Yes</button>
                        <button className="in-btn-no" onClick={() => setDeleteConfirm(null)}>No</button>
                      </>
                    ) : (
                      <button className="in-btn-delete" onClick={() => setDeleteConfirm(item._id)}>Delete</button>
                    )}
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

export default Income;