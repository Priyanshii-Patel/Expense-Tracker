import React, { useContext, useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

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

  /* ── Navbar Shell ── */
  .fn-nav {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 2rem;
    background: rgba(11,14,20,0.75);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
    font-family: var(--font-body);
    animation: navSlideDown 0.5s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes navSlideDown {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* subtle lime glow line at bottom */
  .fn-nav::after {
    content: '';
    position: absolute;
    bottom: 0; left: 50%; right: 50%;
    height: 1px;
    background: var(--lime);
    opacity: 0;
    transition: left 0.4s ease, right 0.4s ease, opacity 0.4s ease;
  }

  .fn-nav:hover::after {
    left: 20%; right: 20%;
    opacity: 0.18;
  }

  /* ── Logo ── */
  .fn-logo {
    display: flex;
    align-items: center;
    gap: 0.45rem;
    text-decoration: none;
    flex-shrink: 0;
  }

  .fn-logo-mark {
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

  .fn-logo:hover .fn-logo-mark {
    transform: rotate(-6deg) scale(1.08);
    box-shadow: 0 4px 16px rgba(198,241,53,0.35);
  }

  .fn-logo-name {
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 1.05rem;
    color: var(--text);
    letter-spacing: -0.01em;
  }

  /* ── Center Nav Pills ── */
  .fn-center {
    display: flex;
    align-items: center;
    gap: 0.2rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 0.3rem;
  }

  @media (max-width: 768px) {
    .fn-center { display: none; }
  }

  .fn-pill-link {
    padding: 0.38rem 0.9rem;
    border-radius: 8px;
    font-size: 0.84rem;
    font-weight: 500;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.18s, background 0.18s;
    position: relative;
  }

  .fn-pill-link:hover {
    color: var(--text);
    background: rgba(255,255,255,0.05);
  }

  .fn-pill-link.fn-active {
    color: #0b0e14;
    background: var(--lime);
    font-weight: 600;
  }

  .fn-home-link {
    font-size: 0.88rem;
    color: var(--muted);
    text-decoration: none;
    transition: color 0.18s;
  }

  .fn-home-link:hover { color: var(--text); }

  /* ── Right Side ── */
  .fn-right {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    position: relative;
    flex-shrink: 0;
  }

  /* ── Guest Links ── */
  .fn-guest-link {
    font-size: 0.88rem;
    color: var(--muted);
    text-decoration: none;
    padding: 0.4rem 0.75rem;
    border-radius: 8px;
    transition: color 0.18s, background 0.18s;
  }

  .fn-guest-link:hover {
    color: var(--text);
    background: rgba(255,255,255,0.05);
  }

  .fn-guest-cta {
    display: inline-flex;
    align-items: center;
    padding: 0.42rem 1.1rem;
    background: var(--lime);
    color: #0b0e14;
    font-family: var(--font-head);
    font-weight: 700;
    font-size: 0.84rem;
    border-radius: 8px;
    text-decoration: none;
    transition: transform 0.18s, box-shadow 0.18s, background 0.18s;
  }

  .fn-guest-cta:hover {
    transform: translateY(-1px);
    background: #d4f94a;
    box-shadow: 0 6px 20px rgba(198,241,53,0.28);
  }

  /* ── Avatar Button ── */
  .fn-avatar-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.3rem 0.65rem 0.3rem 0.3rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid var(--border);
    border-radius: 999px;
    cursor: pointer;
    transition: border-color 0.18s, background 0.18s;
    color: var(--text);
  }

  .fn-avatar-btn:hover,
  .fn-avatar-btn.fn-open {
    background: rgba(255,255,255,0.07);
    border-color: rgba(198,241,53,0.25);
  }

  .fn-avatar-circle {
    width: 26px; height: 26px;
    background: var(--lime);
    color: #0b0e14;
    font-family: var(--font-head);
    font-weight: 800;
    font-size: 0.78rem;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .fn-avatar-name {
    font-size: 0.84rem;
    font-weight: 500;
    color: var(--text);
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  @media (max-width: 480px) {
    .fn-avatar-name { display: none; }
  }

  .fn-chevron {
    width: 14px; height: 14px;
    color: var(--muted);
    transition: transform 0.22s ease;
    flex-shrink: 0;
  }

  .fn-chevron.fn-open { transform: rotate(180deg); }

  /* ── Dropdown ── */
  .fn-dropdown-wrap {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 200;
    animation: dropIn 0.22s cubic-bezier(0.22,1,0.36,1) both;
  }

  @keyframes dropIn {
    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .fn-dropdown {
    min-width: 200px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    box-shadow:
      0 0 0 1px rgba(198,241,53,0.06),
      0 16px 48px rgba(0,0,0,0.55);
  }

  .fn-drop-header {
    padding: 0.9rem 1rem 0.7rem;
    border-bottom: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
  }

  .fn-drop-user-name {
    font-family: var(--font-head);
    font-size: 0.9rem;
    font-weight: 700;
    color: var(--text);
  }

  .fn-drop-label {
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    color: var(--muted);
    font-weight: 600;
  }

  .fn-drop-item {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
    color: var(--muted);
    text-decoration: none;
    transition: background 0.15s, color 0.15s;
  }

  .fn-drop-item:hover {
    background: rgba(255,255,255,0.04);
    color: var(--text);
  }

  .fn-drop-item.fn-active {
    color: var(--lime);
    background: rgba(198,241,53,0.07);
  }

  .fn-drop-item.fn-active .fn-drop-dot {
    background: var(--lime);
    box-shadow: 0 0 6px var(--lime);
  }

  .fn-drop-dot {
    width: 5px; height: 5px;
    border-radius: 50%;
    background: var(--muted);
    flex-shrink: 0;
    transition: background 0.15s;
  }

  .fn-drop-sep {
    height: 1px;
    background: var(--border);
    margin: 0.3rem 0;
  }

  .fn-logout-btn {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.65rem 1rem;
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 0.85rem;
    font-family: var(--font-body);
    color: var(--red-dim);
    transition: background 0.15s;
    text-align: left;
  }

  .fn-logout-btn:hover {
    background: rgba(255,90,90,0.07);
  }
`;

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [isMenuOpen]);

  const handleLogout = () => {
    logout();
    toast.success("Logout Successfully");
    navigate("/");
  };

  const navLinks = [
    { to: "/dashboard", label: "Dashboard" },
    { to: "/income", label: "Income" },
    { to: "/expense", label: "Expense" },
    { to: "/budget", label: "Budget" },
    { to: "/profile", label: "Profile" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <style>{styles}</style>
      <nav className="fn-nav">

        {/* Logo */}
        <Link to="/" className="fn-logo">
          <span className="fn-logo-mark">₹</span>
          <span className="fn-logo-name">FinTrack</span>
        </Link>

        {/* Center */}
        {user ? (
          <div className="fn-center">
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`fn-pill-link ${isActive(to) ? "fn-active" : ""}`}
              >
                {label}
              </Link>
            ))}
          </div>
        ) : (
          <Link to="/" className="fn-home-link">Home</Link>
        )}

        {/* Right side */}
        <div className="fn-right" ref={menuRef}>
          {user ? (
            <>
              <button
                className={`fn-avatar-btn ${isMenuOpen ? "fn-open" : ""}`}
                onClick={() => setIsMenuOpen(prev => !prev)}
              >
                <span className="fn-avatar-circle">
                  {user.name?.charAt(0).toUpperCase()}
                </span>
                <span className="fn-avatar-name">{user.name}</span>

                <svg
                  className={`fn-chevron ${isMenuOpen ? "fn-open" : ""}`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isMenuOpen && (
                <div className="fn-dropdown-wrap">
                  <div className="fn-dropdown">
                    <div className="fn-drop-header">
                      <span className="fn-drop-user-name">{user.name}</span>
                      <span className="fn-drop-label">ACCOUNT</span>
                    </div>

                    {navLinks.map(({ to, label }) => (
                      <Link
                        key={to}
                        to={to}
                        className={`fn-drop-item ${isActive(to) ? "fn-active" : ""}`}
                      >
                        <span className="fn-drop-dot" />
                        {label}
                      </Link>
                    ))}

                    <div className="fn-drop-sep" />

                    <button className="fn-logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <Link to="/login" className="fn-guest-link">Login</Link>
              <Link to="/register" className="fn-guest-cta">Get Started</Link>
            </>
          )}
        </div>
      </nav>
    </>
  );
};

export default Navbar;