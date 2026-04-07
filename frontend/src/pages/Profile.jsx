import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

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

  .profile-root {
    min-height: 100vh;
    background-color: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    overflow-x: hidden;
    position: relative;
  }

  .profile-root::before,
  .profile-root::after {
    content: '';
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .profile-root::before {
    width: 600px; height: 600px;
    top: -200px; right: -150px;
    background: radial-gradient(circle, rgba(198,241,53,0.06) 0%, transparent 65%);
    animation: orbFloat 10s ease-in-out infinite alternate;
  }

  .profile-root::after {
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

  .profile-wrapper {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    padding: 7rem 2rem 4rem;
  }

  .profile-page-title {
    font-family: var(--font-head);
    font-size: clamp(1.8rem, 4vw, 2.8rem);
    font-weight: 800;
    letter-spacing: -0.03em;
    color: var(--text);
    margin-bottom: 2.5rem;
    text-align: center;
    animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.1s;
  }

  .profile-page-title .accent {
    color: var(--lime);
    position: relative;
    display: inline-block;
  }

  .profile-page-title .accent::after {
    content: '';
    position: absolute;
    bottom: 4px; left: 0; right: 0;
    height: 3px;
    background: var(--lime);
    opacity: 0.3;
    border-radius: 2px;
  }

  .profile-layout {
    display: grid;
    grid-template-columns: 280px 1fr;
    gap: 1.5rem;
    align-items: start;
  }

  @media (max-width: 700px) {
    .profile-layout { grid-template-columns: 1fr; }
  }

  .profile-card {
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
    transition: border-color 0.2s;
  }

  .profile-card::before {
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

  /* Left identity card */
  .identity-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.6rem;
    text-align: center;
    animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.2s;
  }

  .avatar-ring {
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--lime) 0%, var(--lime-dim) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: var(--font-head);
    font-size: 1.5rem;
    font-weight: 800;
    color: #0b0e14;
    margin-bottom: 0.4rem;
    box-shadow: 0 0 24px rgba(198,241,53,0.25);
  }

  .identity-name {
    font-family: var(--font-head);
    font-size: 1.05rem;
    font-weight: 700;
    color: var(--text);
  }

  .identity-email {
    font-size: 0.82rem;
    color: var(--muted);
  }

  .role-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    margin-top: 0.4rem;
    padding: 0.3rem 0.75rem;
    border: 1px solid rgba(198,241,53,0.3);
    background: rgba(198,241,53,0.08);
    border-radius: 999px;
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--lime);
  }

  .role-badge::before {
    content: '';
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--lime);
    box-shadow: 0 0 6px var(--lime);
  }

  /* Right column */
  .profile-right {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
  }

  /* Details card */
  .details-card {
    animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.3s;
  }

  .card-section-label {
    font-family: var(--font-head);
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 1rem;
  }

  .detail-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.65rem 0.75rem;
    border-radius: 10px;
    background: rgba(255,255,255,0.02);
    border: 1px solid transparent;
    margin-bottom: 0.5rem;
    transition: background 0.15s, border-color 0.15s;
  }

  .detail-row:last-child { margin-bottom: 0; }

  .detail-row:hover {
    background: rgba(255,255,255,0.05);
    border-color: var(--border);
  }

  .detail-key {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--muted);
    letter-spacing: 0.06em;
    text-transform: uppercase;
    width: 70px;
    flex-shrink: 0;
  }

  .detail-val {
    font-size: 0.88rem;
    color: var(--text);
    font-weight: 500;
  }

  /* Actions card */
  .actions-card {
    animation: fadeSlideUp 0.7s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.4s;
  }

  .action-btn-primary {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.78rem 1.4rem;
    background: var(--lime);
    color: #0b0e14;
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 0.88rem;
    border-radius: 10px;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s;
    margin-bottom: 0.65rem;
  }

  .action-btn-primary:hover {
    transform: translateY(-2px);
    background: #d4f94a;
    box-shadow: 0 10px 30px rgba(198,241,53,0.28);
  }

  .action-btn-ghost {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 0.78rem 1.4rem;
    background: transparent;
    color: var(--red-dim);
    font-family: var(--font-head);
    font-size: 0.88rem;
    font-weight: 700;
    border: 1px solid rgba(255,90,90,0.25);
    border-radius: 10px;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.18s, border-color 0.18s, background 0.18s;
  }

  .action-btn-ghost:hover {
    background: rgba(255,90,90,0.07);
    border-color: rgba(255,90,90,0.5);
  }

  /* Not signed in state */
  .not-signed-in {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
  }

  .not-signed-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 20px;
    padding: 2.5rem 2rem;
    text-align: center;
    max-width: 320px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.5);
    animation: fadeSlideUp 0.6s cubic-bezier(0.22,1,0.36,1) both;
  }

  .not-signed-card h2 {
    font-family: var(--font-head);
    font-size: 1.3rem;
    font-weight: 800;
    margin-bottom: 0.5rem;
  }

  .not-signed-card p {
    color: var(--muted);
    font-size: 0.88rem;
    margin-bottom: 1.5rem;
  }

  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return (
      <div className="profile-root">
        <style>{styles}</style>
        <div className="grid-bg" />
        <div className="not-signed-in">
          <div className="not-signed-card">
            <h2>Not signed in</h2>
            <p>You need to login first</p>
            <Link to="/login" className="action-btn-primary">
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const initials = user.name
    ? user.name.split(" ").map(w => w[0]).join("").toUpperCase()
    : "?";

  return (
    <div className="profile-root">
      <style>{styles}</style>
      <div className="grid-bg" />

      <div className="profile-wrapper">
        <h1 className="profile-page-title">
          Your <span className="accent">Profile</span>
        </h1>

        <div className="profile-layout">
          {/* Left — Identity Card */}
          <div className="profile-card identity-card">
            <div className="avatar-ring">{initials}</div>
            <div className="identity-name">{user.name}</div>
            <div className="identity-email">{user.email}</div>
            {user.role && (
              <span className="role-badge">{user.role}</span>
            )}
          </div>

          {/* Right column */}
          <div className="profile-right">
            {/* Account Details */}
            <div className="profile-card details-card">
              <div className="card-section-label">Account Details</div>
              <div className="detail-row">
                <span className="detail-key">Name</span>
                <span className="detail-val">{user.name}</span>
              </div>
              <div className="detail-row">
                <span className="detail-key">Email</span>
                <span className="detail-val">{user.email}</span>
              </div>
              {user.role && (
                <div className="detail-row">
                  <span className="detail-key">Role</span>
                  <span className="detail-val">{user.role}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="profile-card actions-card">
              <div className="card-section-label">Actions</div>
              <Link to="/forgot-password" className="action-btn-primary">
                Change Password
              </Link>
              <button onClick={handleLogout} className="action-btn-ghost">
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;