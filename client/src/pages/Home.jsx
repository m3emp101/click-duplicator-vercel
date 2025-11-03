import { Link } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth.js';

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="page">
      <section className="hero">
        <div className="container hero-content">
          <span className="badge">Campaign Experience Manager</span>
          <h1>Duplicate your best converting funnel with smart popups.</h1>
          <p>
            Build squeeze, delay, and exit experiences in minutes. Click Duplicator helps you orchestrate every
            interaction from a single dashboard.
          </p>
          <div className="hero-actions">
            <Link to={isAuthenticated ? '/campaigns' : '/register'} className="btn-primary">
              {isAuthenticated ? 'Manage Campaigns' : 'Start for Free'}
            </Link>
            <Link to="/help" className="btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="container features">
        <h2>Everything in one place</h2>
        <div className="feature-grid">
          <article>
            <h3>Event-driven popups</h3>
            <p>Delay and exit popups trigger automatically with configurable timing and follow-up destinations.</p>
          </article>
          <article>
            <h3>Preview friendly</h3>
            <p>Share campaign preview URLs that mirror the live behaviour before you go public.</p>
          </article>
          <article>
            <h3>Plan limits enforced</h3>
            <p>Stay within the quotas for Free, Standard, Pro, and Unlimited plans with upgrade options ready.</p>
          </article>
        </div>
      </section>
    </div>
  );
};

export default Home;
