import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import './App.css';

const App = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch resources data from the backend (to be implemented)
  const fetchResources = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await Axios.get('https://api.example.com/resources'); // Update this URL
      setResources(res.data);
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch resources. Please try again later.');
      console.error("Error fetching data:", error);
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
          <Switch>
            <Route exact path="/">
              {error ? (
                <div className="error-container">
                  <h2>Error</h2>
                  <p>{error}</p>
                  <button onClick={handleRetry} className="retry-button">
                    Retry
                  </button>
                </div>
              ) : (
                <Dashboard resources={resources} loading={loading} />
              )}
            </Route>
          </Switch>
        </main>
      </div>
    </Router>
  );
};

export default App;
