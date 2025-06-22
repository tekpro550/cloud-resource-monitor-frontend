import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Cloud Monitor</h2>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <NavLink to="/add-customer">Add Customer</NavLink>
          </li>
          <li className="nav-section-header">Cloud</li>
          <li>
            <NavLink to="/dashboard/aws">AWS</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/azure">Azure</NavLink>
            <ul className="sidebar-submenu">
              <li>
                <NavLink to="/dashboard/azure/subscriptions">All Subscriptions</NavLink>
              </li>
            </ul>
          </li>
          <li>
            <NavLink to="/dashboard/digitalocean">DigitalOcean</NavLink>
          </li>
          <li>
            <NavLink to="/dashboard/alibaba">Alibaba Cloud</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 