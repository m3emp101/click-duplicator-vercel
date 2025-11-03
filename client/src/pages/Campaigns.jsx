import { useEffect, useMemo, useState } from 'react';

import api, { API_BASE_URL } from '../api/client.js';
import CampaignForm from '../components/CampaignForm.jsx';
import { useAuth } from '../hooks/useAuth.js';

const cleanupPayload = (values) => {
  const payload = { ...values };
  if (!payload.slug?.trim()) delete payload.slug;
  const optionalUrls = [
    'delayPopupUrl',
    'delayPopupCloseUrl',
    'exitPopupUrl',
    'exitPopupCloseUrl',
  ];
  optionalUrls.forEach((field) => {
    if (!payload[field]) {
      delete payload[field];
    }
  });

  if (payload.delayPopupDelaySeconds !== undefined && payload.delayPopupDelaySeconds !== null) {
    payload.delayPopupDelaySeconds = Number(payload.delayPopupDelaySeconds) || undefined;
    if (!payload.delayPopupDelaySeconds) {
      delete payload.delayPopupDelaySeconds;
    }
  }

  return payload;
};

const Campaigns = () => {
  const { user } = useAuth();
  const [campaigns, setCampaigns] = useState([]);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingCampaign, setEditingCampaign] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [campaignRes, accountRes] = await Promise.all([
          api.get('/campaigns'),
          api.get('/account'),
        ]);
        setCampaigns(campaignRes.data.campaigns);
        setAccount(accountRes.data.account);
      } catch (err) {
        setError(err.response?.data?.message || 'Unable to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const isUnlimitedPlan = account?.isUnlimitedPlan;
  const planLimit = account?.planLimit ?? null;
  const campaignCount = campaigns.length;
  const canCreateMore = isUnlimitedPlan || planLimit === null || campaignCount < planLimit;

  const previewBaseUrl = useMemo(() => {
    const base = API_BASE_URL.replace(/\/?api\/?$/, '');
    return `${base}/api/c`;
  }, []);

  const refreshCampaigns = async () => {
    const { data } = await api.get('/campaigns');
    setCampaigns(data.campaigns);
  };

  const handleCreate = async (values) => {
    try {
      setError(null);
      await api.post('/campaigns', cleanupPayload(values));
      setMessage('Campaign created successfully.');
      await refreshCampaigns();
    } catch (err) {
      setMessage(null);
      setError(err.response?.data?.message || 'Unable to create campaign.');
    }
  };

  const handleUpdate = async (values) => {
    try {
      setError(null);
      await api.patch(`/campaigns/${editingCampaign.id}`, cleanupPayload(values));
      setMessage('Campaign updated successfully.');
      setEditingCampaign(null);
      await refreshCampaigns();
    } catch (err) {
      setMessage(null);
      setError(err.response?.data?.message || 'Unable to update campaign.');
    }
  };

  const handleDelete = async (campaignId) => {
    if (!window.confirm('Delete this campaign? This action cannot be undone.')) return;
    try {
      await api.delete(`/campaigns/${campaignId}`);
      setMessage('Campaign deleted.');
      await refreshCampaigns();
    } catch (err) {
      setMessage(null);
      setError(err.response?.data?.message || 'Unable to delete campaign.');
    }
  };

  const handleClone = async (campaignId) => {
    try {
      await api.post(`/campaigns/${campaignId}/clone`);
      setMessage('Campaign cloned successfully.');
      await refreshCampaigns();
    } catch (err) {
      setMessage(null);
      setError(err.response?.data?.message || 'Unable to clone campaign.');
    }
  };

  const handlePreview = (slug) => {
    const url = `${previewBaseUrl}/${slug}`;
    window.open(url, '_blank', 'noopener');
  };

  if (loading) {
    return (
      <div className="page container">
        <div className="panel">
          <p>Loading campaigns...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page container">
      <div className="page-header">
        <div>
          <h1>Campaigns</h1>
          <p>Manage squeeze, delay, and exit popup experiences.</p>
        </div>
        <div className="plan-summary">
          <span>Plan: {user.plan}</span>
          {(planLimit !== null || isUnlimitedPlan) && (
            <span>
              Campaigns {campaignCount}/{isUnlimitedPlan ? 'Unlimited' : planLimit}
            </span>
          )}
        </div>
      </div>

      {message && <div className="alert success">{message}</div>}
      {error && <div className="alert error">{error}</div>}

      {editingCampaign ? (
        <CampaignForm
          initialValues={editingCampaign}
          onSubmit={handleUpdate}
          onCancel={() => setEditingCampaign(null)}
          mode="edit"
          planLimit={isUnlimitedPlan ? Infinity : planLimit}
          currentCount={campaignCount}
          isSubmitDisabled={false}
        />
      ) : (
        <CampaignForm
          onSubmit={handleCreate}
          planLimit={isUnlimitedPlan ? Infinity : planLimit}
          currentCount={campaignCount}
          mode="create"
          isSubmitDisabled={!canCreateMore}
        />
      )}

      {!canCreateMore && !editingCampaign && (
        <div className="alert warning">
          You have reached the campaign limit for your plan. Upgrade from the <a href="/account">Account</a> page to
          unlock more capacity.
        </div>
      )}

      <section className="panel">
        <h2>Existing Campaigns</h2>
        {campaigns.length === 0 ? (
          <p>No campaigns yet. {canCreateMore ? 'Create your first one above.' : 'Upgrade your plan to add more.'}</p>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Slug</th>
                  <th>Updated</th>
                  <th>Preview</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {campaigns.map((campaign) => (
                  <tr key={campaign.id}>
                    <td>{campaign.name}</td>
                    <td>{campaign.slug}</td>
                    <td>{new Date(campaign.updatedAt).toLocaleString()}</td>
                    <td>
                      <button className="link-button" onClick={() => handlePreview(campaign.slug)}>
                        Open preview
                      </button>
                    </td>
                    <td className="table-actions">
                      <button className="link-button" onClick={() => setEditingCampaign(campaign)}>
                        Edit
                      </button>
                      <button className="link-button" onClick={() => handleClone(campaign.id)}>
                        Clone
                      </button>
                      <button className="link-button danger" onClick={() => handleDelete(campaign.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Campaigns;
