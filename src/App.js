import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Header from './components/Header';

const App = () => {
  const [resources, setResources] = useState([]);

  // Fetch resources data from the backend (to be implemented)
  const fetchResources = async () => {
    try {
      const res = await Axios.get('https://api.example.com/resources'); // Update this URL
      setResources(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  return (
    <Router>
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/">
            <Dashboard resources={resources} />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
