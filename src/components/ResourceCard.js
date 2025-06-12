import React from 'react';
import './ResourceCard.css';

const ResourceCard = ({ resource }) => {
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'running':
        return 'status-running';
      case 'stopped':
        return 'status-stopped';
      case 'error':
        return 'status-error';
      default:
        return 'status-unknown';
    }
  };

  const formatMetric = (value, unit = '%') => {
    if (value === undefined || value === null) return 'N/A';
    return `${value}${unit}`;
  };

  return (
    <div className="resource-card">
      <div className="resource-header">
        <h2>{resource.name}</h2>
        <span className={`status-indicator ${getStatusColor(resource.status)}`}>
          {resource.status || 'Unknown'}
        </span>
      </div>
      
      <div className="resource-details">
        <div className="detail-row">
          <span className="label">Provider:</span>
          <span className="value">{resource.provider}</span>
        </div>
        <div className="detail-row">
          <span className="label">Type:</span>
          <span className="value">{resource.type}</span>
        </div>
        <div className="detail-row">
          <span className="label">Region:</span>
          <span className="value">{resource.region || 'N/A'}</span>
        </div>
      </div>

      <div className="resource-metrics">
        <div className="metric">
          <span className="metric-label">CPU Usage</span>
          <div className="metric-bar">
            <div 
              className="metric-fill" 
              style={{ width: `${resource.cpu_usage || 0}%` }}
            />
          </div>
          <span className="metric-value">{formatMetric(resource.cpu_usage)}</span>
        </div>

        <div className="metric">
          <span className="metric-label">Memory Usage</span>
          <div className="metric-bar">
            <div 
              className="metric-fill" 
              style={{ width: `${resource.memory_usage || 0}%` }}
            />
          </div>
          <span className="metric-value">{formatMetric(resource.memory_usage)}</span>
        </div>

        <div className="metric">
          <span className="metric-label">Storage Usage</span>
          <div className="metric-bar">
            <div 
              className="metric-fill" 
              style={{ width: `${resource.storage_usage || 0}%` }}
            />
          </div>
          <span className="metric-value">{formatMetric(resource.storage_usage)}</span>
        </div>
      </div>

      <div className="resource-footer">
        <span className="last-updated">
          Last updated: {resource.last_updated || 'N/A'}
        </span>
      </div>
    </div>
  );
};

export default ResourceCard;
