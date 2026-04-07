import React, { useContext, useState } from 'react';
import api from '../services/api';
import { AuthContext } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const styles = `
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
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .lg-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  /* ── Noise overlay ── */
  .lg-noise {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(198,241,53,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(198,241,53,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  /* ── Topbar ── */
  .lg-topbar {
    position: relative;
    z-index: 10;
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 2rem;
    border-bottom: 1px solid var(--border);
  }

  .lg-logo {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    text-decoration: none;
  }

  .lg-logo-mark {
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

  .lg-logo:hover .lg-logo-mark {
    transform: rotate(-6deg) scale(1.08);
    box-shadow: 0 4px 16px rgba(198,241,53,0.35);
  }

  .lg-logo-name {
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--text);
  }

  /* ── Main 2-col layout ── */
  .lg-main {
    position: relative;
    z-index: 1;
    flex: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: calc(100vh - 64px);
  }

  @media (max-width: 820px) {
    .lg-main { grid-template-columns: 1fr; }
    .lg-left  { display: none; }
  }

  /* ── Left panel ── */
  .lg-left {
    position: relative;
    overflow: hidden;
    background: var(--surface);
    border-right: 1px solid var(--border);
    display: flex;
    align-items: flex-end;
    padding: 3rem;
  }

  .lg-left-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(198,241,53,0.04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(198,241,53,0.04) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .lg-left-glow {
    position: absolute;
    top: -100px; left: -100px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(198,241,53,0.1) 0%, transparent 65%);
    pointer-events: none;
    animation: orbFloat 9s ease-in-out infinite alternate;
  }

  @keyframes orbFloat {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(25px,20px) scale(1.05); }
  }

  .lg-left-content {
    position: relative;
    z-index: 1;
    animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.2s;
  }

  .lg-quote {
    font-family: var(--font-head);
    font-size: 1.45rem;
    font-weight: 700;
    line-height: 1.45;
    color: var(--text);
    letter-spacing: -0.02em;
    margin-bottom: 1rem;
    max-width: 380px;
  }

  .lg-quote-author {
    font-size: 0.82rem;
    color: var(--lime);
    font-weight: 600;
    letter-spacing: 0.04em;
    margin-bottom: 2.5rem;
  }

  .lg-stats {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 1rem 1.5rem;
  }

  .lg-stat {
    display: flex;
    flex-direction: column;
    gap: 0.2rem;
  }

  .lg-stat-val {
    font-family: var(--font-head);
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--lime);
  }

  .lg-stat-label {
    font-size: 0.72rem;
    color: var(--muted);
    letter-spacing: 0.04em;
  }

  .lg-stat-sep {
    width: 1px;
    height: 36px;
    background: var(--border);
  }

  /* ── Right panel ── */
  .lg-right {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 3rem 2rem;
  }

  .lg-form-wrap {
    width: 100%;
    max-width: 400px;
    animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.15s;
  }

  /* ── Form Header ── */
  .lg-form-header {
    margin-bottom: 2rem;
  }

  .lg-eyebrow {
    display: inline-block;
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    color: var(--lime);
    background: rgba(198,241,53,0.08);
    border: 1px solid rgba(198,241,53,0.25);
    padding: 0.22rem 0.7rem;
    border-radius: 999px;
    margin-bottom: 1rem;
  }

  .lg-form-title {
    font-family: var(--font-head);
    font-size: 2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 0.4rem;
  }

  .lg-form-sub {
    font-size: 0.9rem;
    color: var(--muted);
  }

  /* ── Form Fields ── */
  .lg-form {
    display: flex;
    flex-direction: column;
    gap: 1.1rem;
    margin-bottom: 1.5rem;
  }

  .lg-field {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }

  .lg-label {
    font-size: 0.8rem;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.03em;
  }

  .lg-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .lg-forgot {
    font-size: 0.78rem;
    color: var(--lime);
    text-decoration: none;
    transition: opacity 0.15s;
  }

  .lg-forgot:hover { opacity: 0.75; }

  .lg-input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.72rem 1rem;
    font-size: 0.92rem;
    font-family: var(--font-body);
    color: var(--text);
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
  }

  .lg-input::placeholder { color: var(--muted); opacity: 0.6; }

  .lg-input:focus {
    border-color: rgba(198,241,53,0.4);
    box-shadow: 0 0 0 3px rgba(198,241,53,0.08);
  }

  .lg-input-wrap {
    position: relative;
  }

  .lg-input-pw {
    padding-right: 4.5rem;
  }

  .lg-toggle-pw {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted);
    font-family: var(--font-body);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    transition: color 0.15s;
  }

  .lg-toggle-pw:hover { color: var(--lime); }

  /* ── Submit ── */
  .lg-submit {
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
    transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
    margin-top: 0.4rem;
  }

  .lg-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    background: #d4f94a;
    box-shadow: 0 8px 28px rgba(198,241,53,0.28);
  }

  .lg-submit:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ── Register line ── */
  .lg-register-line {
    text-align: center;
    font-size: 0.84rem;
    color: var(--muted);
  }

  .lg-register-link {
    color: var(--lime);
    text-decoration: none;
    font-weight: 600;
    transition: opacity 0.15s;
  }

  .lg-register-link:hover { opacity: 0.75; }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        toast.success('Login Successful');
        navigate('/');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login Failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg-root">
      <style>{styles}</style>
      <div className="lg-noise" />

      <nav className="lg-topbar">
        <Link to="/" className="lg-logo">
          <span className="lg-logo-mark">₹</span>
          <span className="lg-logo-name">FinTrack</span>
        </Link>
      </nav>

      <main className="lg-main">

        <div className="lg-left">
          <div className="lg-left-grid" />
          <div className="lg-left-glow" />
          <div className="lg-left-content">
            <blockquote className="lg-quote">
              "A budget is telling your money where to go instead of wondering where it went."
            </blockquote>
            <p className="lg-quote-author">— Dave Ramsey</p>

            <div className="lg-stats">
              {[
                { val: "₹0", label: "Hidden fees" },
                { val: "100%", label: "In your control" },
                { val: "Free", label: "Always" },
              ].map((s, i) => (
                <React.Fragment key={i}>
                  {i > 0 && <div className="lg-stat-sep" />}
                  <div className="lg-stat">
                    <span className="lg-stat-val">{s.val}</span>
                    <span className="lg-stat-label">{s.label}</span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="lg-right">
          <div className="lg-form-wrap">

            <div className="lg-form-header">
              <span className="lg-eyebrow">SIGN IN</span>
              <h2 className="lg-form-title">Welcome back</h2>
              <p className="lg-form-sub">Sign in to your FinTrack account</p>
            </div>

            <form onSubmit={handleSubmit} className="lg-form">

              <div className="lg-field">
                <label className="lg-label">Email Address</label>
                <input
                  type="email"
                  className="lg-input"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="lg-field">
                <div className="lg-label-row">
                  <label className="lg-label">Password</label>
                  <Link to="/forgot-password" className="lg-forgot">Forgot password?</Link>
                </div>

                <div className="lg-input-wrap">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    className="lg-input lg-input-pw"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />

                  <button
                    type="button"
                    className="lg-toggle-pw"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              <button type="submit" className="lg-submit" disabled={isLoading}>
                {isLoading ? "Loading..." : "Sign in →"}
              </button>

            </form>

            <p className="lg-register-line">
              Don't have an account?{" "}
              <Link to="/register" className="lg-register-link">
                Create one free
              </Link>
            </p>

          </div>
        </div>

      </main>
    </div>
  );
};

export default Login;