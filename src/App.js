import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CredentialForm from './components/CredentialForm';
import Header from './components/Header';
import './App.css';

const Landing = () => (
  <div className="landing-page">
    <h2>Welcome to Cloud Resource Monitor</h2>
    <p>Monitor and manage your cloud resources across AWS, Azure, DigitalOcean, and Alibaba Cloud.</p>
    <div className="nav-buttons">
      <Link to="/add-customer" className="nav-btn">Add Customer</Link>
      <Link to="/dashboard" className="nav-btn">Consolidated Dashboard</Link>
    </div>
  </div>
);

const App = () => {
  return (
    <Router>
      <div className="App">
        <Header />
        <nav className="main-nav">
          <Link to="/add-customer" className="nav-btn">Add Customer</Link>
          <Link to="/dashboard" className="nav-btn">Consolidated Dashboard</Link>
        </nav>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/add-customer" element={<CredentialForm />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
