import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from "react-toastify";
import api from '../services/api';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg:        #0b0e14;
    --surface:   #161b27;
    --border:    rgba(255,255,255,0.07);
    --lime:      #c6f135;
    --text:      #e8ecf4;
    --muted:     #6b7590;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .fp-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .fp-noise {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(198,241,53,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(198,241,53,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .fp-root::before {
    content: '';
    position: fixed;
    top: -150px; left: -150px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(198,241,53,0.055) 0%, transparent 65%);
    pointer-events: none;
    z-index: 0;
    animation: orbFloat 11s ease-in-out infinite alternate;
  }

  @keyframes orbFloat {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(25px,15px) scale(1.06); }
  }

  .fp-topbar {
    position: relative;
    z-index: 10;
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 2rem;
    border-bottom: 1px solid var(--border);
  }

  .fp-logo {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    text-decoration: none;
  }

  .fp-logo-mark {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    background: var(--lime);
    color: #0b0e14;
    font-family: var(--font-head);
    font-weight: 800;
    font-size: 0.95rem;
    border-radius: 8px;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .fp-logo:hover .fp-logo-mark {
    transform: rotate(-6deg) scale(1.08);
    box-shadow: 0 4px 16px rgba(198,241,53,0.35);
  }

  .fp-logo-name {
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--text);
  }

  .fp-body {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .fp-card {
    width: 100%;
    max-width: 420px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.2rem;
    box-shadow:
      0 0 0 1px rgba(198,241,53,0.05),
      0 24px 64px rgba(0,0,0,0.5);
    animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }

  /* ── Icon ── */
  .fp-icon-wrap {
    width: 48px; height: 48px;
    background: rgba(198,241,53,0.1);
    border: 1px solid rgba(198,241,53,0.2);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.25rem;
    font-size: 1.4rem;
  }

  .fp-eyebrow {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: var(--lime);
    background: rgba(198,241,53,0.08);
    border: 1px solid rgba(198,241,53,0.25);
    padding: 0.22rem 0.7rem;
    border-radius: 999px;
    margin-bottom: 0.85rem;
  }

  .fp-title {
    font-family: var(--font-head);
    font-size: 1.85rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 0.4rem;
  }

  .fp-sub {
    font-size: 0.88rem;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 1.75rem;
  }

  /* ── Form ── */
  .fp-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .fp-field {
    display: flex;
    flex-direction: column;
    gap: 0.42rem;
  }

  .fp-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.03em;
  }

  .fp-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.72rem 1rem;
    font-size: 0.9rem;
    font-family: var(--font-body);
    color: var(--text);
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
  }

  .fp-input::placeholder { color: var(--muted); opacity: 0.55; }

  .fp-input:focus {
    border-color: rgba(198,241,53,0.4);
    box-shadow: 0 0 0 3px rgba(198,241,53,0.07);
  }

  .fp-submit {
    width: 100%;
    padding: 0.82rem;
    background: var(--lime);
    color: #0b0e14;
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 0.95rem;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    transition: transform 0.18s, box-shadow 0.18s, background 0.18s, opacity 0.18s;
  }

  .fp-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    background: #d4f94a;
    box-shadow: 0 8px 28px rgba(198,241,53,0.28);
  }

  .fp-submit:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  /* ── Sent state ── */
  .fp-sent {
    text-align: center;
    animation: fadeSlideUp 0.5s ease both;
  }

  .fp-sent-icon {
    width: 56px; height: 56px;
    background: rgba(75,224,138,0.1);
    border: 1px solid rgba(75,224,138,0.25);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    margin: 0 auto 1.2rem;
  }

  .fp-sent-title {
    font-family: var(--font-head);
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--text);
    margin-bottom: 0.5rem;
  }

  .fp-sent-sub {
    font-size: 0.88rem;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 1.5rem;
  }

  .fp-try-again {
    background: transparent;
    border: 1px solid var(--border);
    color: var(--muted);
    font-family: var(--font-body);
    font-size: 0.85rem;
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    cursor: pointer;
    transition: color 0.15s, border-color 0.15s;
  }

  .fp-try-again:hover {
    color: var(--text);
    border-color: rgba(255,255,255,0.18);
  }

  /* ── Footer link ── */
  .fp-back {
    display: flex;
    justify-content: center;
    margin-top: 1.4rem;
  }

  .fp-back-link {
    font-size: 0.84rem;
    color: var(--muted);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    transition: color 0.15s;
  }

  .fp-back-link:hover { color: var(--lime); }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/resetpassword", { email });
      if (res.data.success) {
        toast.success("Reset link sent, check your email");
        setSent(true);
        setEmail('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Reset link failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fp-root">
      <style>{styles}</style>
      <div className="fp-noise" />

      <nav className="fp-topbar">
        <Link to="/" className="fp-logo">
          <span className="fp-logo-mark">₹</span>
          <span className="fp-logo-name">FinTrack</span>
        </Link>
      </nav>

      <div className="fp-body">
        <div className="fp-card">
          {!sent ? (
            <>
              <div className="fp-icon-wrap">🔑</div>
              <span className="fp-eyebrow">ACCOUNT RECOVERY</span>
              <h2 className="fp-title">Forgot Password?</h2>
              <p className="fp-sub">Enter your email address and we'll send you a link to reset your password.</p>

              <form onSubmit={handleSubmit} className="fp-form">
                <div className="fp-field">
                  <label className="fp-label">Email Address</label>
                  <input
                    type="email"
                    className="fp-input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="fp-submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Reset Link →"}
                </button>
              </form>
            </>
          ) : (
            <div className="fp-sent">
              <div className="fp-sent-icon">✉️</div>
              <h3 className="fp-sent-title">Check your inbox</h3>
              <p className="fp-sent-sub">We've sent a password reset link to your email. It may take a minute to arrive.</p>
              <button className="fp-try-again" onClick={() => setSent(false)}>
                Try a different email
              </button>
            </div>
          )}

          <div className="fp-back">
            <Link to="/login" className="fp-back-link">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;