import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.js';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(form);
      const redirectTo = location.state?.from?.pathname || '/campaigns';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="panel auth-panel">
        <h1>Welcome back</h1>
        <p>Sign in to manage your Click Duplicator campaigns.</p>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Email address</span>
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            <span>Password</span>
            <input type="password" name="password" value={form.password} onChange={handleChange} required />
          </label>
          {error && <div className="alert error">{error}</div>}
          <button type="submit" className="btn-primary" disabled={submitting}>
            {submitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
        <p className="auth-switch">
          New to Click Duplicator? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
