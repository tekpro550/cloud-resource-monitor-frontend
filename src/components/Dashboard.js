import React, { useState, useEffect, useMemo } from 'react';
import ResourceCard from './ResourceCard';
import './Dashboard.css';

const PROVIDERS = [
  { key: 'aws', label: 'AWS', endpoint: 'https://cloud-resource-monitor-backend.azurewebsites.net/api/get_aws_resources?code=m_j4vEPIBnNtQVVQlGVqL7wtYNh_6jMNss0a3PM84FIoAzFuHbf9Ww==' },
  { key: 'azure', label: 'Azure', endpoint: 'https://cloud-resource-monitor-backend.azurewebsites.net/api/get_azure_resources?code=m_j4vEPIBnNtQVVQlGVqL7wtYNh_6jMNss0a3PM84FIoAzFuHbf9Ww==' },
  { key: 'digitalocean', label: 'DigitalOcean', endpoint: 'https://cloud-resource-monitor-backend.azurewebsites.net/api/get_digitalocean_resources?code=m_j4vEPIBnNtQVVQlGVqL7wtYNh_6jMNss0a3PM84FIoAzFuHbf9Ww==' },
  { key: 'alibaba', label: 'Alibaba', endpoint: 'https://cloud-resource-monitor-backend.azurewebsites.net/api/get_alibaba_resources?code=m_j4vEPIBnNtQVVQlGVqL7wtYNh_6jMNss0a3PM84FIoAzFuHbf9Ww==' },
];

const customer_id = "test123"; // TODO: Replace with actual logic

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('aws');
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    status: 'all',
    region: 'all',
    type: 'all',
    search: ''
  });

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      setResources([]);
      const provider = PROVIDERS.find(p => p.key === activeTab);
      if (!provider) return;
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
  }, [activeTab]);

  const uniqueStatuses = useMemo(() => ['all', ...new Set(resources.map(r => r.status || 'unknown'))], [resources]);
  const uniqueRegions = useMemo(() => ['all', ...new Set(resources.map(r => r.region || 'unknown'))], [resources]);
  const uniqueTypes = useMemo(() => ['all', ...new Set(resources.map(r => r.type || 'unknown'))], [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesStatus = filters.status === 'all' || resource.status === filters.status;
      const matchesRegion = filters.region === 'all' || resource.region === filters.region;
      const matchesType = filters.type === 'all' || resource.type === filters.type;
      const matchesSearch = resource.name?.toLowerCase().includes(filters.search.toLowerCase());
      return matchesStatus && matchesRegion && matchesType && matchesSearch;
    });
  }, [resources, filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({ ...prev, [filterType]: value }));
  };

  // Summary
  const total = resources.length;
  const running = resources.filter(r => r.status === 'running').length;
  const stopped = resources.filter(r => r.status === 'stopped').length;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Cloud Resource Dashboard</h1>
        <div className="provider-tabs">
          {PROVIDERS.map(p => (
            <button
              key={p.key}
              className={activeTab === p.key ? 'active' : ''}
              onClick={() => setActiveTab(p.key)}
            >
              {p.label}
            </button>
          ))}
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
      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search resources..."
            value={filters.search}
            onChange={e => handleFilterChange('search', e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select value={filters.status} onChange={e => handleFilterChange('status', e.target.value)}>
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
          <select value={filters.region} onChange={e => handleFilterChange('region', e.target.value)}>
            {uniqueRegions.map(region => (
              <option key={region} value={region}>{region.charAt(0).toUpperCase() + region.slice(1)}</option>
            ))}
          </select>
          <select value={filters.type} onChange={e => handleFilterChange('type', e.target.value)}>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>
      {loading ? (
        <div className="loading-state"><p>Loading resources...</p></div>
      ) : error ? (
        <div className="error-container"><p style={{ color: 'red' }}>Error: {error}</p></div>
      ) : filteredResources.length === 0 ? (
        <div className="no-resources"><p>No resources match the current filters</p></div>
      ) : (
        <div className="resource-grid">
          {filteredResources.map(resource => (
            <ResourceCard key={resource.id || resource.name} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
