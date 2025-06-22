import React from 'react';
import './ServiceCard.css';

const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <div className="service-card-header">
        <h3>{service.name}</h3>
      </div>
      <div className="service-card-body">
        <span className="resource-count">{service.count}</span>
      </div>
      <div className="service-card-footer">
        <button>Enable Integration</button>
      </div>
    </div>
  );
};

export default ServiceCard; 