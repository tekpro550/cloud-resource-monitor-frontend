import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import CredentialForm from './components/CredentialForm';
import './App.css';

const API_URL = 'https://cloud-resource-monitor-backend.azurewebsites.net';

// Configure Axios defaults
Axios.defaults.headers.common['Content-Type'] = 'application/json';
Axios.defaults.headers.common['Accept'] = 'application/json';

const App = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await Axios.get(`${API_URL}/api/resources`, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      setResources(res.data);
    } catch (error) {
      console.error("Error details:", error);
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        setError(`Server Error: ${error.response.status} - ${error.response.data?.message || 'Unknown error'}`);
      } else if (error.request) {
        // The request was made but no response was received
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        setError('Error setting up the request. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleRetry = () => {
    fetchResources();
  };

  return (
    <Router>
      <div className="App">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={
              error ? (
                <div className="error-container">
                  <h2>Error</h2>
                  <p>{error}</p>
                  <button onClick={handleRetry} className="retry-button">
                    Retry
                  </button>
                </div>
              ) : (
                <>
                  <CredentialForm />
                  <Dashboard resources={resources} loading={loading} />
                </>
              )
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
