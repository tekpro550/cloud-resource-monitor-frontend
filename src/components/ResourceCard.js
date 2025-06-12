import React from 'react';

const ResourceCard = ({ resource }) => {
  return (
    <div className="resource-card">
      <h2>{resource.name}</h2>
      <p>Provider: {resource.provider}</p>
      <p>Type: {resource.type}</p>
      <p>CPU Usage: {resource.cpu_usage}</p>
      <p>Memory Usage: {resource.memory_usage}</p>
    </div>
  );
};

export default ResourceCard;
