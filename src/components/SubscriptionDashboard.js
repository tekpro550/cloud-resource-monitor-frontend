import React, { useState, useEffect } from 'react';
import SubscriptionTable from './SubscriptionTable';
import './SubscriptionDashboard.css';

const SubscriptionDashboard = () => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mockSubscriptions = [
    { id: 'sub1', subscriptionName: 'Azure-CSP-Medequip', accountName: 'Azure-CSP-Medequip', activeMonitors: 2, enabledForMonitoring: 'Yes', status: 'Active' },
    { id: 'sub2', subscriptionName: 'Azure-CSP-Royaloak', accountName: 'Azure-CSP-RoyalOak-New-Tenant', activeMonitors: 3, enabledForMonitoring: 'Yes', status: 'Active' },
    { id: 'sub3', subscriptionName: 'Azure-CSP-School360', accountName: 'Azure-CSP-D64-School360', activeMonitors: 2, enabledForMonitoring: 'Yes', status: 'Active' },
    { id: 'sub4', subscriptionName: 'Azure-CSP-ThirdEye', accountName: 'Azure-CSP-D64-School360', activeMonitors: 0, enabledForMonitoring: 'No', status: 'Active' },
    { id: 'sub5', subscriptionName: 'Azure-CSP-Superior Engineering', accountName: 'Azure-CSP-SuperiorEngineering', activeMonitors: 0, enabledForMonitoring: 'Yes', status: 'Active' },
  ];

  useEffect(() => {
    // In the future, this will fetch from a real API endpoint.
    // We'll simulate a network request for now.
    setTimeout(() => {
      setSubscriptions(mockSubscriptions);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div className="subscription-dashboard">
      <div className="dashboard-header">
        <h1>Azure Subscriptions</h1>
      </div>
      {loading ? (
        <div className="loading-state"><p>Loading subscriptions...</p></div>
      ) : error ? (
        <div className="error-container"><p style={{ color: 'red' }}>Error: {error}</p></div>
      ) : (
        <SubscriptionTable subscriptions={subscriptions} />
      )}
    </div>
  );
};

export default SubscriptionDashboard; 