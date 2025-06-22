import React from 'react';
import './SubscriptionTable.css';

const SubscriptionTable = ({ subscriptions }) => {
  return (
    <div className="table-container">
      <table className="subscription-table">
        <thead>
          <tr>
            <th>Subscription Name</th>
            <th>Account Name</th>
            <th>Active Monitors</th>
            <th>Enabled for Monitoring</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {subscriptions.map(sub => (
            <tr key={sub.id}>
              <td>{sub.subscriptionName}</td>
              <td>{sub.accountName}</td>
              <td>{sub.activeMonitors}</td>
              <td>{sub.enabledForMonitoring}</td>
              <td>
                <span className={`status-badge status-${sub.status?.toLowerCase()}`}>{sub.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubscriptionTable; 