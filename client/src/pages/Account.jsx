import { useEffect, useState } from 'react';

import api from '../api/client.js';
import { useAuth } from '../hooks/useAuth.js';

const Account = () => {
  const { user, refresh } = useAuth();
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadAccount = async () => {
      try {
        setLoading(true);
        const { data } = await api.get('/account');
        setAccount(data.account);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load account details');
      } finally {
        setLoading(false);
      }
    };

    loadAccount();
  }, []);

  const handlePlanChange = async (event) => {
    const plan = event.target.value;
    try {
      const { data } = await api.patch('/account/plan', { plan });
      setAccount(data.account);
      await refresh();
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update plan.');
    }
  };

  if (loading) {
    return (
      <div className="page container">
        <div className="panel">
          <p>Loading account details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page container">
        <div className="panel">
          <p className="alert error">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <h1>Your Account</h1>
      <div className="panel account-card">
        <div>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
        <div className="account-plan">
          <strong>Current plan:</strong> <span className="plan-name">{account.plan}</span>
          <span className="plan-limit">
            Campaign limit: {account.isUnlimitedPlan ? 'Unlimited' : account.planLimit}
          </span>
        </div>
        <div className="plan-actions">
          <label>
            Change plan
            <select value={account.plan} onChange={handlePlanChange}>
              <option value="free">Free</option>
              <option value="standard">Standard</option>
              <option value="pro">Pro</option>
              <option value="unlimited">Unlimited</option>
            </select>
          </label>
          <a className="btn-secondary" href={account.upgradeUrl} target="_blank" rel="noreferrer">
            Upgrade options
          </a>
        </div>
      </div>
    </div>
  );
};

export default Account;
