import React, { useState, useMemo } from 'react';
import ResourceCard from './ResourceCard';
import './Dashboard.css';

const Dashboard = ({ resources }) => {
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
      const matchesSearch = resource.name.toLowerCase().includes(filters.search.toLowerCase());

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
        {resources.length === 0 ? (
          <div className="loading-state">
            <p>Loading resources...</p>
          </div>
        ) : filteredResources.length === 0 ? (
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
