import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import ServiceCard from './ServiceCard';
import './Dashboard.css';

const PROVIDERS = [
  { key: 'aws', label: 'AWS', endpoint: 'https://cloud-resource-monitor-backend.azurewebsites.net/api/get_aws_resources?code=m_j4vEPIBnNtQVVQlGVqL7wtYNh_6jMNss0a3PM84FIoAzFuHbf9Ww==' },
  { key: 'azure', label: 'Azure', endpoint: 'https://cloud-resource-monitor-backend.azurewebsites.net/api/get_azure_resources?code=m_j4vEPIBnNtQVVQlGVqL7wtYNh_6jMNss0a3PM84FIoAzFuHbf9Ww==' },
  { key: 'digitalocean', label: 'DigitalOcean', endpoint: 'https://cloud-resource-monitor-backend.azurewebsites.net/api/get_digitalocean_resources?code=m_j4vEPIBnNtQVVQlGVqL7wtYNh_6jMNss0a3PM84FIoAzFuHbf9Ww==' },
  { key: 'alibaba', label: 'Alibaba', endpoint: 'https://cloud-resource-monitor-backend.azurewebsites.net/api/get_alibaba_resources?code=m_j4vEPIBnNtQVVQlGVqL7wtYNh_6jMNss0a3PM84FIoAzFuHbf9Ww==' },
];

const customer_id = "test123"; // TODO: Replace with actual logic

const Dashboard = () => {
  const { provider: activeProvider } = useParams();
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      setResources([]);
      const provider = PROVIDERS.find(p => p.key === activeProvider);
      if (!provider) {
        setError(`Invalid provider: ${activeProvider}`);
        setLoading(false);
        return;
      };
      try {
        const res = await fetch(`${provider.endpoint}&customer_id=${customer_id}`);
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        const data = await res.json();
        setResources(data.resources || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, [activeProvider]);

  const services = useMemo(() => {
    const serviceMap = resources.reduce((acc, resource) => {
      const serviceType = resource.type || 'Unknown Service';
      if (!acc[serviceType]) {
        acc[serviceType] = { name: serviceType, count: 0 };
      }
      acc[serviceType].count++;
      return acc;
    }, {});
    return Object.values(serviceMap);
  }, [resources]);

  const providerInfo = PROVIDERS.find(p => p.key === activeProvider);

  // Summary
  const total = resources.length;
  const running = resources.filter(r => r.status === 'running').length;
  const stopped = resources.filter(r => r.status === 'stopped').length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>{providerInfo ? `${providerInfo.label} Service View` : 'Dashboard'}</h1>
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
      
      {loading ? (
        <div className="loading-state"><p>Loading services...</p></div>
      ) : error ? (
        <div className="error-container"><p style={{ color: 'red' }}>Error: {error}</p></div>
      ) : services.length === 0 ? (
        <div className="no-resources"><p>No services found for this provider.</p></div>
      ) : (
        <div className="service-grid">
          {services.map(service => (
            <ServiceCard key={service.name} service={service} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
