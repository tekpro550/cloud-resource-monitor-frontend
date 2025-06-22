import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import './Dashboard.css';

const API_BASE_URL = 'https://cloud-resource-monitor-backend.azurewebsites.net/api';
const API_CODE = 'm_j4vEPIBnNtQVVQlGVqL7wtYNh_6jMNss0a3PM84FIoAzFuHbf9Ww==';

const PROVIDER_CONFIG = {
  aws: {
    label: 'AWS',
    get: 'get_aws_resources',
    refresh: 'refresh_aws_resources',
  },
  azure: {
    label: 'Azure',
    get: 'get_azure_resources',
    refresh: 'refresh_azure_resources',
  },
  digitalocean: {
    label: 'DigitalOcean',
    get: 'get_digitalocean_resources',
    refresh: 'refresh_digitalocean_resources',
  },
  alibaba: {
    label: 'Alibaba',
    get: 'get_alibaba_resources',
    refresh: 'refresh_alibaba_resources',
  },
};

const ResourceDashboard = () => {
  const { provider, customerId } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const providerInfo = useMemo(() => PROVIDER_CONFIG[provider], [provider]);

  const fetchResources = useCallback(async () => {
    if (!providerInfo) {
      setError(`Invalid provider: ${provider}`);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const getUrl = `${API_BASE_URL}/${providerInfo.get}?code=${API_CODE}&customer_id=${customerId}`;
      const res = await fetch(getUrl);
      if (!res.ok) throw new Error(`Error fetching resources: ${res.status}`);
      const data = await res.json();
      setResources(data.resources || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [provider, customerId, providerInfo]);

  useEffect(() => {
    if (provider && customerId) {
      fetchResources();
    }
  }, [provider, customerId, fetchResources]);

  const handleRefresh = async () => {
    if (!providerInfo || !providerInfo.refresh) {
      console.warn(`Refresh not configured for provider: ${provider}`);
      return;
    }
    setIsRefreshing(true);
    setError(null);
    try {
      const refreshUrl = `${API_BASE_URL}/${providerInfo.refresh}?code=${API_CODE}&customer_id=${customerId}`;
      const res = await fetch(refreshUrl, { method: 'POST' }); // Assuming refresh is a POST, adjust if needed
      if (!res.ok) throw new Error(`Error refreshing resources: ${res.status}`);
      // After refresh, refetch the resources to update the view
      await fetchResources();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsRefreshing(false);
    }
  };

  const services = useMemo(() => {
    const serviceMap = resources.reduce((acc, resource) => {
      const serviceType = resource.type || 'Unknown Service';
      if (!acc[serviceType]) {
        acc[serviceType] = { name: serviceType, count: 0, resources: [] };
      }
      acc[serviceType].count++;
      acc[serviceType].resources.push(resource);
      return acc;
    }, {});
    return Object.values(serviceMap);
  }, [resources]);

  const providerLabel = providerInfo ? providerInfo.label : 'Unknown';

  // Summary
  const total = resources.length;
  const running = resources.filter(r => r.status === 'running').length;
  const stopped = resources.filter(r => r.status === 'stopped').length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-main">
          <h1>{`${providerLabel} Services for ${customerId}`}</h1>
          <div className="header-actions">
            <button onClick={handleRefresh} disabled={isRefreshing || loading}>
              {isRefreshing ? 'Scanning...' : 'Refresh Resources'}
            </button>
          </div>
        </div>
        <div className="dashboard-stats">
          <div className="stat-item">
            <span className="stat-label">Total Resources</span>
            <span className="stat-value">{total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Running</span>
            <span className="stat-value">{running}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Stopped</span>
            <span className="stat-value">{stopped}</span>
          </div>
        </div>
      </div>
      
      <div className="dashboard-content">
        {isRefreshing && (
          <div className="loading-overlay">
            <div className="loading-state">
              <p>Scanning for new resources... this may take a moment.</p>
            </div>
          </div>
        )}
        {loading && !isRefreshing ? (
          <div className="loading-state"><p>Loading services...</p></div>
        ) : error ? (
          <div className="error-container"><p style={{ color: 'red' }}>Error: {error}</p></div>
        ) : services.length === 0 ? (
          <div className="no-resources"><p>No services found for this provider.</p></div>
        ) : (
          <div className="service-grid">
            {services.map(service => (
              <Link 
                key={service.name} 
                to={`/dashboard/${provider}/${customerId}/${service.name}`} 
                state={{ resources: service.resources }}
                className="service-card-link"
              >
                <ServiceCard service={service} />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResourceDashboard;
