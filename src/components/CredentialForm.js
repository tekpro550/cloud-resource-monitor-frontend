import React, { useState } from 'react';
import './CredentialForm.css';

const providerFields = {
  aws: [
    { name: 'access_key_id', label: 'Access Key ID', type: 'text' },
    { name: 'secret_access_key', label: 'Secret Access Key', type: 'password' },
    { name: 'region', label: 'Region (optional)', type: 'text', optional: true },
  ],
  azure: [
    { name: 'subscription_id', label: 'Subscription ID', type: 'text' },
    { name: 'tenant_id', label: 'Tenant ID', type: 'text' },
    { name: 'client_id', label: 'Client ID', type: 'text' },
    { name: 'client_secret', label: 'Client Secret', type: 'password' },
  ],
  digitalocean: [
    { name: 'personal_access_token', label: 'Personal Access Token', type: 'password' },
  ],
  alibaba: [
    { name: 'access_key_id', label: 'Access Key ID', type: 'text' },
    { name: 'access_key_secret', label: 'Access Key Secret', type: 'password' },
    { name: 'region', label: 'Region (optional)', type: 'text', optional: true },
  ],
};

const API_URL = "https://cloud-resource-monitor-backend.azurewebsites.net/api/credentials?code=m_j4vEPIBnNtQVVQlGVqL7wtYNh_6jMNss0a3PM84FIoAzFuHbf9Ww==";

const CredentialForm = () => {
  const [provider, setProvider] = useState('aws');
  const [customerId, setCustomerId] = useState('');
  const [fields, setFields] = useState({});
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleProviderChange = (e) => {
    setProvider(e.target.value);
    setFields({});
    setStatus(null);
  };

  const handleFieldChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value });
  };

  const handleCustomerIdChange = (e) => {
    setCustomerId(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);
    const payload = {
      customer_id: customerId,
      provider,
      ...fields,
    };
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setStatus({ type: 'success', message: 'Credentials saved successfully!' });
        setFields({});
        setCustomerId('');
      } else {
        const err = await res.json();
        setStatus({ type: 'error', message: err.message || 'Failed to save credentials.' });
      }
    } catch (error) {
      setStatus({ type: 'error', message: error.message || 'Network error.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="credential-form" onSubmit={handleSubmit}>
      <h2>Add Cloud Provider Credentials</h2>
      <div className="form-group">
        <label htmlFor="customer_id">Customer ID</label>
        <input
          type="text"
          id="customer_id"
          name="customer_id"
          value={customerId}
          onChange={handleCustomerIdChange}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="provider">Provider</label>
        <select id="provider" value={provider} onChange={handleProviderChange}>
          <option value="aws">AWS</option>
          <option value="azure">Azure</option>
          <option value="digitalocean">DigitalOcean</option>
          <option value="alibaba">Alibaba Cloud</option>
        </select>
      </div>
      {providerFields[provider].map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={field.name}>{field.label}</label>
          <input
            type={field.type}
            id={field.name}
            name={field.name}
            value={fields[field.name] || ''}
            onChange={handleFieldChange}
            required={!field.optional}
            autoComplete="off"
          />
        </div>
      ))}
      <button type="submit" disabled={loading}>
        {loading ? 'Saving...' : 'Save Credentials'}
      </button>
      {status && (
        <div className={`form-status ${status.type}`}>{status.message}</div>
      )}
    </form>
  );
};

export default CredentialForm; 