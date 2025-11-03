import { useEffect, useState } from 'react';

const defaultValues = {
  name: '',
  slug: '',
  pageTitle: '',
  squeezePageUrl: '',
  delayPopupUrl: '',
  delayPopupDelaySeconds: 15,
  delayPopupCloseUrl: '',
  exitPopupUrl: '',
  exitPopupCloseUrl: '',
  backgroundColor: '#1d4ed8',
};

const CampaignForm = ({ initialValues, onSubmit, onCancel, mode = 'create', planLimit, currentCount, isSubmitDisabled }) => {
  const [formValues, setFormValues] = useState({ ...defaultValues, ...initialValues });
  const [errors, setErrors] = useState({});
  const isEdit = mode === 'edit';

  useEffect(() => {
    setFormValues({ ...defaultValues, ...initialValues });
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: name === 'delayPopupDelaySeconds' ? Number(value) : value,
    }));
  };

  const validate = () => {
    const nextErrors = {};
    if (!formValues.name.trim()) nextErrors.name = 'Campaign name is required';
    if (!formValues.pageTitle.trim()) nextErrors.pageTitle = 'Page title is required';
    if (!formValues.squeezePageUrl.trim()) nextErrors.squeezePageUrl = 'Squeeze page URL is required';
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;
    onSubmit?.(formValues);
  };

  const remaining = planLimit === Infinity ? 'Unlimited' : `${planLimit - (currentCount ?? 0)} remaining`;

  return (
    <form className="panel" onSubmit={handleSubmit}>
      <div className="panel-header">
        <div>
          <h2>{isEdit ? 'Edit Campaign' : 'Create Campaign'}</h2>
          <p>Define the behaviour for your campaign popups and destinations.</p>
        </div>
        {planLimit && (
          <div className="plan-badge" title="Campaign allowance for your plan">
            Plan limit: {planLimit === Infinity ? 'Unlimited' : planLimit} ({remaining})
          </div>
        )}
      </div>
      <div className="form-grid">
        <label>
          <span>Campaign Name *</span>
          <input name="name" value={formValues.name} onChange={handleChange} placeholder="Holiday Promo" />
          {errors.name && <small className="error-text">{errors.name}</small>}
        </label>
        <label>
          <span>URL Slug</span>
          <input name="slug" value={formValues.slug} onChange={handleChange} placeholder="holiday-promo" />
          <small>Leave blank to auto-generate from name.</small>
        </label>
        <label>
          <span>Page Title *</span>
          <input name="pageTitle" value={formValues.pageTitle} onChange={handleChange} placeholder="Holiday Promo Landing Page" />
          {errors.pageTitle && <small className="error-text">{errors.pageTitle}</small>}
        </label>
        <label className="full">
          <span>Squeeze Page URL *</span>
          <input
            name="squeezePageUrl"
            value={formValues.squeezePageUrl}
            onChange={handleChange}
            placeholder="https://example.com/landing"
          />
          {errors.squeezePageUrl && <small className="error-text">{errors.squeezePageUrl}</small>}
        </label>

        <label>
          <span>Delay Popup URL</span>
          <input
            name="delayPopupUrl"
            value={formValues.delayPopupUrl}
            onChange={handleChange}
            placeholder="https://example.com/delay-offer"
          />
        </label>
        <label>
          <span>Delay (seconds)</span>
          <input
            type="number"
            name="delayPopupDelaySeconds"
            min={1}
            max={600}
            value={formValues.delayPopupDelaySeconds}
            onChange={handleChange}
          />
        </label>
        <label>
          <span>After Delay Popup Closes (URL)</span>
          <input
            name="delayPopupCloseUrl"
            value={formValues.delayPopupCloseUrl}
            onChange={handleChange}
            placeholder="https://example.com/checkout"
          />
        </label>

        <label>
          <span>Exit Popup URL</span>
          <input
            name="exitPopupUrl"
            value={formValues.exitPopupUrl}
            onChange={handleChange}
            placeholder="https://example.com/exit-offer"
          />
        </label>
        <label>
          <span>After Exit Popup Closes (URL)</span>
          <input
            name="exitPopupCloseUrl"
            value={formValues.exitPopupCloseUrl}
            onChange={handleChange}
            placeholder="https://example.com/thank-you"
          />
        </label>
        <label>
          <span>Popup Header Colour</span>
          <input type="color" name="backgroundColor" value={formValues.backgroundColor} onChange={handleChange} />
        </label>
      </div>
      <div className="form-actions">
        <button type="submit" className="btn-primary" disabled={isSubmitDisabled}>
          {isEdit ? 'Save Changes' : 'Create Campaign'}
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
        {isSubmitDisabled && !isEdit && (
          <small className="error-text">Upgrade your plan to add additional campaigns.</small>
        )}
      </div>
    </form>
  );
};

export default CampaignForm;
