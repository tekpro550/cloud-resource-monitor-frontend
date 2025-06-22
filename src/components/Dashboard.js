import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CustomerList from './CustomerList';

// Mock data - in a real app, this would come from an API
const mockCustomers = {
  aws: [
    { id: 'customer-123', name: 'Global Tech Inc.' },
    { id: 'customer-456', name: 'Innovate Solutions' },
  ],
  azure: [
    { id: 'customer-123', name: 'Global Tech Inc.' },
    { id: 'customer-789', name: 'Azure-First Company' },
  ],
  digitalocean: [
    { id: 'customer-101', name: 'Startup Fast' },
  ],
  alibaba: [],
};

const Dashboard = () => {
  const { provider } = useParams();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulating fetching customers for the selected provider
    setLoading(true);
    setTimeout(() => {
      setCustomers(mockCustomers[provider] || []);
      setLoading(false);
    }, 300);
  }, [provider]);

  return (
    <div>
      {loading ? (
        <div className="loading-state"><p>Loading customers...</p></div>
      ) : (
        <CustomerList customers={customers} provider={provider} />
      )}
    </div>
  );
};

export default Dashboard; 