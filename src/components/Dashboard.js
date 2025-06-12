import React from 'react';
import ResourceCard from './ResourceCard';

const Dashboard = ({ resources }) => {
  return (
    <div className="dashboard">
      <h1>Cloud Resource Dashboard</h1>
      <div className="resource-cards">
        {resources.length === 0 ? (
          <p>Loading resources...</p>
        ) : (
          resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;
