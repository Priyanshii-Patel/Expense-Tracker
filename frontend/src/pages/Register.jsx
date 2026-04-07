import React, { useContext, useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import api from "../services/api";

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

  .rg-root {
    min-height: 100vh;
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  .rg-noise {
    position: fixed;
    inset: 0;
    z-index: 0;
    background-image:
      linear-gradient(rgba(198,241,53,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(198,241,53,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  .rg-root::before {
    content: '';
    position: fixed;
    top: -150px; right: -150px;
    width: 500px; height: 500px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(198,241,53,0.06) 0%, transparent 65%);
    pointer-events: none;
    z-index: 0;
    animation: orbFloat 10s ease-in-out infinite alternate;
  }

  @keyframes orbFloat {
    from { transform: translate(0,0) scale(1); }
    to   { transform: translate(20px,20px) scale(1.05); }
  }

  /* ── Topbar ── */
  .rg-topbar {
    position: relative;
    z-index: 10;
    height: 64px;
    display: flex;
    align-items: center;
    padding: 0 2rem;
    border-bottom: 1px solid var(--border);
  }

  .rg-logo {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    text-decoration: none;
  }

  .rg-logo-mark {
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

  .rg-logo:hover .rg-logo-mark {
    transform: rotate(-6deg) scale(1.08);
    box-shadow: 0 4px 16px rgba(198,241,53,0.35);
  }

  .rg-logo-name {
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--text);
  }

  /* ── Page body ── */
  .rg-body {
    position: relative;
    z-index: 1;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }

  /* ── Card ── */
  .rg-card {
    width: 100%;
    max-width: 460px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.2rem;
    box-shadow:
      0 0 0 1px rgba(198,241,53,0.05),
      0 24px 64px rgba(0,0,0,0.5);
    animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }

  /* ── Header ── */
  .rg-eyebrow {
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

  .rg-title {
    font-family: var(--font-head);
    font-size: 1.85rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 0.35rem;
  }

  .rg-sub {
    font-size: 0.88rem;
    color: var(--muted);
    margin-bottom: 1.75rem;
  }

  /* ── Form ── */
  .rg-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .rg-field {
    display: flex;
    flex-direction: column;
    gap: 0.42rem;
  }

  .rg-label {
    font-size: 0.78rem;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.03em;
  }

  .rg-input {
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

  .rg-input::placeholder { color: var(--muted); opacity: 0.55; }

  .rg-input:focus {
    border-color: rgba(198,241,53,0.4);
    box-shadow: 0 0 0 3px rgba(198,241,53,0.07);
  }

  .rg-input-wrap {
    position: relative;
  }

  .rg-input-pw { padding-right: 4.5rem; }

  .rg-toggle-pw {
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

  .rg-toggle-pw:hover { color: var(--lime); }

  /* ── Strength Bar ── */
  .rg-strength-wrap {
    margin-top: 0.35rem;
  }

  .rg-strength-bar-bg {
    height: 4px;
    background: rgba(255,255,255,0.07);
    border-radius: 2px;
    overflow: hidden;
    margin-bottom: 0.3rem;
  }

  .rg-strength-bar-fill {
    height: 100%;
    border-radius: 2px;
    transition: width 0.35s ease, background 0.35s ease;
  }

  .rg-strength-text {
    font-size: 0.71rem;
    font-weight: 600;
    letter-spacing: 0.04em;
  }

  /* ── Mismatch ── */
  .rg-mismatch {
    font-size: 0.75rem;
    color: var(--red-dim);
    margin-top: 0.3rem;
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }

  .rg-mismatch::before {
    content: '✕';
    font-size: 0.65rem;
  }

  /* ── Submit ── */
  .rg-submit {
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

  .rg-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    background: #d4f94a;
    box-shadow: 0 8px 28px rgba(198,241,53,0.28);
  }

  .rg-submit:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  /* ── Login line ── */
  .rg-login-line {
    text-align: center;
    font-size: 0.84rem;
    color: var(--muted);
    margin-top: 1.25rem;
  }

  .rg-login-link {
    color: var(--lime);
    text-decoration: none;
    font-weight: 600;
    transition: opacity 0.15s;
  }

  .rg-login-link:hover { opacity: 0.75; }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const getStrengthColor = (s) => {
  if (s <= 25)  return '#ff5a5a';
  if (s <= 50)  return '#f5a623';
  if (s <= 75)  return '#4be08a';
  return '#c6f135';
};

const getStrengthLabel = (s) => {
  if (s <= 25)  return 'Weak';
  if (s <= 50)  return 'Fair';
  if (s <= 75)  return 'Good';
  return 'Strong';
};

const Register = () => {
  const { login } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "password") calculateStrength(value);
  };

  const calculateStrength = (pw) => {
    let s = 0;
    if (pw.length > 8) s += 25;
    if (pw.length > 10) s += 25;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) s += 25;
    if (/\d/.test(pw)) s += 15;
    if (/[!@#$%^&*]/.test(pw)) s += 10;
    setPasswordStrength(Math.min(s, 100));
  };

  const validateForm = () => {
    if (!formData.name.trim()) { toast.error("Name is required"); return false; }
    if (formData.name.length > 25) { toast.error("Name must be less than 25 characters"); return false; }
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/;
    if (!emailPattern.test(formData.email)) { toast.error("Enter valid email"); return false; }
    if (formData.password.length < 8) { toast.error("Password must be at least 8 characters"); return false; }
    if (formData.password !== formData.confirmPassword) { toast.error("Passwords do not match"); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);
    try {
      const res = await api.post('/auth/register', {
        name: formData.name.trim(),
        email: formData.email.toLowerCase(),
        password: formData.password
      });
      if (res?.data?.success) {
        login(res.data.token, res.data.user);
        toast.success("Registration Successful");
        navigate('/');
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error?.response?.data?.msg || "Registration Failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rg-root">
      <style>{styles}</style>
      <div className="rg-noise" />

      <nav className="rg-topbar">
        <Link to="/" className="rg-logo">
          <span className="rg-logo-mark">₹</span>
          <span className="rg-logo-name">FinTrack</span>
        </Link>
      </nav>

      <div className="rg-body">
        <div className="rg-card">
          <span className="rg-eyebrow">CREATE ACCOUNT</span>
          <h2 className="rg-title">Join FinTrack</h2>
          <p className="rg-sub">Free forever. No credit card needed.</p>

          <form onSubmit={handleSubmit} className="rg-form">

            <div className="rg-field">
              <label className="rg-label">Full Name</label>
              <input
                type="text"
                name="name"
                className="rg-input"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="rg-field">
              <label className="rg-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="rg-input"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="rg-field">
              <label className="rg-label">Password</label>
              <div className="rg-input-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="rg-input rg-input-pw"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="rg-toggle-pw" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {formData.password && (
                <div className="rg-strength-wrap">
                  <div className="rg-strength-bar-bg">
                    <div
                      className="rg-strength-bar-fill"
                      style={{
                        width: `${passwordStrength}%`,
                        background: getStrengthColor(passwordStrength)
                      }}
                    />
                  </div>
                  <span className="rg-strength-text" style={{ color: getStrengthColor(passwordStrength) }}>
                    {getStrengthLabel(passwordStrength)}
                  </span>
                </div>
              )}
            </div>

            <div className="rg-field">
              <label className="rg-label">Confirm Password</label>
              <div className="rg-input-wrap">
                <input
                  type={showConfirm ? "text" : "password"}
                  name="confirmPassword"
                  className="rg-input rg-input-pw"
                  placeholder="Repeat your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button type="button" className="rg-toggle-pw" onClick={() => setShowConfirm(!showConfirm)}>
                  {showConfirm ? "Hide" : "Show"}
                </button>
              </div>
              {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                <p className="rg-mismatch">Passwords do not match</p>
              )}
            </div>

            <button type="submit" className="rg-submit" disabled={isLoading || passwordStrength < 50}>
              {isLoading ? "Creating account..." : "Create Account →"}
            </button>

          </form>

          <p className="rg-login-line">
            Already have an account?{" "}
            <Link to="/login" className="rg-login-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;