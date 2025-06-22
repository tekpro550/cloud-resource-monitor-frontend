import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CustomerList from './CustomerList';

const API_BASE_URL = "https://cloud-resource-monitor-backend.azurewebsites.net/api";
const FUNCTION_KEY = "m_j4vEPIBnNtQVVQlGVqL7wtYNh_6jMNss0a3PM84FIoAzFuHbf9Ww==";

const Dashboard = () => {
  const { provider } = useParams();
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      if (!provider) return;

      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/customers/${provider}?code=${FUNCTION_KEY}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch customers: ${response.status}`);
        }
        const data = await response.json();
        setCustomers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, [provider]);

  return (
    <div>
      {loading ? (
        <div className="loading-state"><p>Loading customers...</p></div>
      ) : error ? (
        <div className="error-container"><p style={{ color: 'red' }}>Error: {error}</p></div>
      ) : (
        <CustomerList customers={customers} provider={provider} />
      )}
    </div>
  );
};

export default Dashboard; 