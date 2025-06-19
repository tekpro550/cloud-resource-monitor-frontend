import React, { useState, useEffect, useMemo } from 'react';
import ResourceCard from './ResourceCard';
import './Dashboard.css';

const API_URL = "https://cloud-resource-monitor-backend.azurewebsites.net/api/resources?code=m_j4vEPIBnNtQVVQlGVqL7wtYNh_6jMNss0a3PM84FIoAzFuHbf9Ww==";

const Dashboard = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Replace with actual customer_id logic
  const customer_id = "test123";

  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_URL}&customer_id=${customer_id}`);
        if (!res.ok) {
          throw new Error(`Error: ${res.status}`);
        }
        const data = await res.json();
        // Adjust this if your backend returns { resources: [...] }
        setResources(data.resources || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const [filters, setFilters] = useState({
    provider: 'all',
    type: 'all',
    status: 'all',
    search: ''
  });

  const filteredResources = useMemo(() => {
    return resources.filter(resource => {
      const matchesProvider = filters.provider === 'all' || resource.provider === filters.provider;
      const matchesType = filters.type === 'all' || resource.type === filters.type;
      const matchesStatus = filters.status === 'all' || resource.status === filters.status;
      const matchesSearch = resource.name?.toLowerCase().includes(filters.search.toLowerCase());
      return matchesProvider && matchesType && matchesStatus && matchesSearch;
    });
  }, [resources, filters]);

  const uniqueProviders = useMemo(() => {
    return ['all', ...new Set(resources.map(r => r.provider))];
  }, [resources]);

  const uniqueTypes = useMemo(() => {
    return ['all', ...new Set(resources.map(r => r.type))];
  }, [resources]);

  const uniqueStatuses = useMemo(() => {
    return ['all', ...new Set(resources.map(r => r.status))];
  }, [resources]);

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  if (loading) {
    return <div className="dashboard"><p>Loading resources...</p></div>;
  }
  if (error) {
    return <div className="dashboard"><p style={{ color: 'red' }}>Error: {error}</p></div>;
  }
  if (resources.length === 0) {
    return <div className="dashboard"><p>No resources found.</p></div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Cloud Resource Dashboard</h1>
        <div className="dashboard-stats">
          <div className="stat-item">
            <span className="stat-label">Total Resources</span>
            <span className="stat-value">{resources.length}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Active Resources</span>
            <span className="stat-value">
              {resources.filter(r => r.status === 'running').length}
            </span>
          </div>
        </div>
      </div>

      <div className="filters">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search resources..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            value={filters.provider}
            onChange={(e) => handleFilterChange('provider', e.target.value)}
          >
            {uniqueProviders.map(provider => (
              <option key={provider} value={provider}>
                {provider.charAt(0).toUpperCase() + provider.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filters.type}
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            {uniqueTypes.map(type => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
          >
            {uniqueStatuses.map(status => (
              <option key={status} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="resource-grid">
        {filteredResources.length === 0 ? (
          <div className="no-resources">
            <p>No resources match the current filters</p>
          </div>
        ) : (
          filteredResources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
