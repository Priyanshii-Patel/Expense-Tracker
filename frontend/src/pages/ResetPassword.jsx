import React, { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from "react-toastify";
import api from "../services/api";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg:        #0b0e14;
    --surface:   #161b27;
    --border:    rgba(255,255,255,0.07);
    --lime:      #c6f135;
    --text:      #e8ecf4;
    --muted:     #6b7590;
    --red-dim:   #ff5a5a;
    --green-dim: #4be08a;
    --font-head: 'Syne', sans-serif;
    --font-body: 'DM Sans', sans-serif;
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  .rp-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .rp-noise {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(198,241,53,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(198,241,53,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .rp-root::before {
    content: '';
    position: fixed;
    bottom: -150px; right: -150px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(198,241,53,0.055) 0%, transparent 65%);
    pointer-events: none;
    z-index: 0;
    animation: orbFloat 11s ease-in-out infinite alternate;
  }

  @keyframes orbFloat {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(-20px,-20px) scale(1.05); }
  }

  .rp-topbar {
    position: relative;
    z-index: 10;
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 2rem;
    border-bottom: 1px solid var(--border);
  }

  .rp-logo {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    text-decoration: none;
  }

  .rp-logo-mark {
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

  .rp-logo:hover .rp-logo-mark {
    transform: rotate(-6deg) scale(1.08);
    box-shadow: 0 4px 16px rgba(198,241,53,0.35);
  }

  .rp-logo-name {
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--text);
  }

  .rp-body {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  .rp-card {
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

  .rp-icon-wrap {
    width: 48px; height: 48px;
    background: rgba(198,241,53,0.1);
    border: 1px solid rgba(198,241,53,0.2);
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 1.25rem;
    font-size: 1.4rem;
  }

  .rp-eyebrow {
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

  .rp-title {
    font-family: var(--font-head);
    font-size: 1.85rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 0.4rem;
  }

  .rp-sub {
    font-size: 0.88rem;
    color: var(--muted);
    line-height: 1.6;
    margin-bottom: 1.75rem;
  }

  .rp-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .rp-field {
    display: flex;
    flex-direction: column;
    gap: 0.42rem;
  }

  .rp-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.03em;
  }

  .rp-input-wrap { position: relative; }

  .rp-input {
    width: 100%;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 0.72rem 4.5rem 0.72rem 1rem;
    font-size: 0.9rem;
    font-family: var(--font-body);
    color: var(--text);
    outline: none;
    transition: border-color 0.18s, box-shadow 0.18s;
  }

  .rp-input::placeholder { color: var(--muted); opacity: 0.55; }

  .rp-input:focus {
    border-color: rgba(198,241,53,0.4);
    box-shadow: 0 0 0 3px rgba(198,241,53,0.07);
  }

  .rp-toggle-pw {
    position: absolute;
    right: 0.75rem;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    font-size: 0.74rem;
    font-weight: 600;
    color: var(--muted);
    font-family: var(--font-body);
    padding: 0.2rem 0.4rem;
    border-radius: 4px;
    transition: color 0.15s;
  }

  .rp-toggle-pw:hover { color: var(--lime); }

  /* ── Strength ── */
  .rp-strength-wrap { margin-top: 0.35rem; }

  .rp-strength-bar-bg {
    height: 4px;
    background: rgba(255,255,255,0.07);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 0.3rem;
  }

  .rp-strength-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.35s ease, background 0.35s ease;
  }

  .rp-strength-text {
    font-size: 0.71rem;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  .rp-mismatch {
    font-size: 0.75rem;
    color: var(--red-dim);
    margin-top: 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .rp-mismatch::before { content: '✕'; font-size: 0.65rem; }

  .rp-submit {
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
    margin-top: 0.5rem;
    transition: transform 0.18s, box-shadow 0.18s, background 0.18s, opacity 0.18s;
  }

  .rp-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    background: #d4f94a;
    box-shadow: 0 8px 28px rgba(198,241,53,0.28);
  }

  .rp-submit:disabled { opacity: 0.45; cursor: not-allowed; }

  /* ── Done state ── */
  .rp-done {
    text-align: center;
    animation: fadeSlideUp 0.5s ease both;
  }

  .rp-done-icon {
    width: 56px; height: 56px;
    background: rgba(75,224,138,0.1);
    border: 1px solid rgba(75,224,138,0.25);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    margin: 0 auto 1.2rem;
    animation: popIn 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes popIn {
    from { transform: scale(0.6); opacity: 0; }
    to   { transform: scale(1); opacity: 1; }
  }

  .rp-done-title {
    font-family: var(--font-head);
    font-size: 1.4rem;
    font-weight: 800;
    color: var(--green-dim);
    margin-bottom: 0.5rem;
  }

  .rp-done-sub {
    font-size: 0.88rem;
    color: var(--muted);
    line-height: 1.6;
  }

  /* ── Invalid state ── */
  .rp-invalid {
    text-align: center;
    animation: fadeSlideUp 0.5s ease both;
  }

  .rp-invalid-icon {
    width: 56px; height: 56px;
    background: rgba(255,90,90,0.1);
    border: 1px solid rgba(255,90,90,0.25);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    margin: 0 auto 1.2rem;
  }

  .rp-invalid-title {
    font-family: var(--font-head);
    font-size: 1.3rem;
    font-weight: 800;
    color: var(--red-dim);
    margin-bottom: 0.5rem;
  }

  .rp-invalid-sub {
    font-size: 0.88rem;
    color: var(--muted);
    margin-bottom: 1.5rem;
  }

  .rp-invalid-link {
    display: inline-flex;
    padding: 0.6rem 1.2rem;
    background: var(--lime);
    color: #0b0e14;
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 0.85rem;
    border-radius: 8px;
    text-decoration: none;
    transition: background 0.15s, transform 0.15s;
  }

  .rp-invalid-link:hover {
    background: #d4f94a;
    transform: translateY(-1px);
  }

  /* ── Back link ── */
  .rp-back {
    display: flex;
    justify-content: center;
    margin-top: 1.4rem;
  }

  .rp-back-link {
    font-size: 0.84rem;
    color: var(--muted);
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.3rem;
    transition: color 0.15s;
  }

  .rp-back-link:hover { color: var(--lime); }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const getStrengthColor = (s) => {
  if (s <= 25) return '#ff5a5a';
  if (s <= 50) return '#f5a623';
  if (s <= 75) return '#4be08a';
  return '#c6f135';
};

const getStrengthLabel = (s) => {
  if (s <= 25) return 'Weak';
  if (s <= 50) return 'Fair';
  if (s <= 75) return 'Good';
  return 'Strong';
};

const ResetPassword = () => {
  const { resettoken } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!resettoken) {
      toast.error('Invalid or missing reset token');
      setTokenValid(false);
    }
  }, [resettoken]);

  const calculateStrength = (val) => {
    let s = 0;
    if (val.length > 8) s += 25;
    if (val.length > 10) s += 25;
    if (/[a-z]/.test(val) && /[A-Z]/.test(val)) s += 25;
    if (/\d/.test(val)) s += 15;
    if (/[!@#$%^&*]/.test(val)) s += 10;
    setPasswordStrength(Math.min(s, 100));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    if (password !== confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      const res = await api.put(`/auth/resetpassword/${resettoken}`, { password });
      if (res.data.success) {
        toast.success('Password reset successfully');
        setDone(true);
        setTimeout(() => navigate('/login'), 2500);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rp-root">
      <style>{styles}</style>
      <div className="rp-noise" />

      <nav className="rp-topbar">
        <Link to="/" className="rp-logo">
          <span className="rp-logo-mark">₹</span>
          <span className="rp-logo-name">FinTrack</span>
        </Link>
      </nav>

      <div className="rp-body">
        <div className="rp-card">

          {!tokenValid ? (
            <div className="rp-invalid">
              <div className="rp-invalid-icon">⚠️</div>
              <h2 className="rp-invalid-title">Invalid or Expired Link</h2>
              <p className="rp-invalid-sub">This reset link is no longer valid. Please request a new one.</p>
              <Link to="/forgot-password" className="rp-invalid-link">Request New Link →</Link>
            </div>

          ) : !done ? (
            <>
              <div className="rp-icon-wrap">🔒</div>
              <span className="rp-eyebrow">SET NEW PASSWORD</span>
              <h2 className="rp-title">Reset Password</h2>
              <p className="rp-sub">Choose a strong new password for your account.</p>

              <form onSubmit={handleSubmit} className="rp-form">

                <div className="rp-field">
                  <label className="rp-label">New Password</label>
                  <div className="rp-input-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="rp-input"
                      placeholder="Enter new password"
                      value={password}
                      onChange={(e) => { setPassword(e.target.value); calculateStrength(e.target.value); }}
                    />
                    <button type="button" className="rp-toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  {password && (
                    <div className="rp-strength-wrap">
                      <div className="rp-strength-bar-bg">
                        <div
                          className="rp-strength-bar-fill"
                          style={{ width: `${passwordStrength}%`, background: getStrengthColor(passwordStrength) }}
                        />
                      </div>
                      <span className="rp-strength-text" style={{ color: getStrengthColor(passwordStrength) }}>
                        {getStrengthLabel(passwordStrength)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="rp-field">
                  <label className="rp-label">Confirm Password</label>
                  <div className="rp-input-wrap">
                    <input
                      type={showConfirm ? "text" : "password"}
                      className="rp-input"
                      placeholder="Repeat new password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <button type="button" className="rp-toggle-pw" onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? "Hide" : "Show"}
                    </button>
                  </div>
                  {confirmPassword && password !== confirmPassword && (
                    <p className="rp-mismatch">Passwords do not match</p>
                  )}
                </div>

                <button type="submit" className="rp-submit" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password →"}
                </button>

              </form>
            </>

          ) : (
            <div className="rp-done">
              <div className="rp-done-icon">✅</div>
              <h3 className="rp-done-title">Password Updated!</h3>
              <p className="rp-done-sub">Your password has been reset successfully. Redirecting you to login...</p>
            </div>
          )}

          {!done && tokenValid && (
            <div className="rp-back">
              <Link to="/login" className="rp-back-link">← Back to Login</Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ResetPassword;