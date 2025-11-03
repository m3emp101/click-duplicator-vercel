import { NavLink, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.js';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <header className="app-header">
      <div className="container header-content">
        <button
          type="button"
          className="brand"
          onClick={() => navigate('/')}
        >
          <span className="brand-logo" aria-hidden="true">CD</span>
          <span className="brand-name">Click Duplicator</span>
        </button>
        <nav className="main-nav">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/help">Help</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/campaigns">Campaigns</NavLink>
              <NavLink to="/account">Account</NavLink>
              <button type="button" className="link-button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/register" className="cta">
                Get Started
              </NavLink>
            </>
          )}
        </nav>
        {isAuthenticated && (
          <div className="user-chip" title={`Signed in as ${user.email}`}>
            <span className="avatar">{user.name?.[0]?.toUpperCase() ?? 'C'}</span>
            <div className="user-meta">
              <span className="user-name">{user.name}</span>
              <span className="user-plan">Plan: {user.plan}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
