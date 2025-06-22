import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import CredentialForm from './components/CredentialForm';
import Sidebar from './components/Sidebar';
import SubscriptionDashboard from './components/SubscriptionDashboard';
import ResourceDashboard from './components/ResourceDashboard';
import './App.css';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Sidebar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard/aws" />} />
            <Route path="/add-customer" element={<CredentialForm />} />
            <Route path="/dashboard/:provider" element={<Dashboard />} />
            <Route path="/dashboard/:provider/:customerId" element={<ResourceDashboard />} />
            <Route path="/dashboard/azure/subscriptions" element={<SubscriptionDashboard />} />
            <Route path="/dashboard" element={<Navigate to="/dashboard/aws" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
