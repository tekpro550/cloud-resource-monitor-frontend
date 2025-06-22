import React from 'react';
import { Link } from 'react-router-dom';
import './CustomerList.css';

const CustomerList = ({ customers, provider }) => {
  if (customers.length === 0) {
    return <div className="no-customers">No customers found for this provider.</div>;
  }

  return (
    <div className="customer-list-container">
      <h2>Customers for {provider.toUpperCase()}</h2>
      <ul className="customer-list">
        {customers.map(customer => (
          <li key={customer.id} className="customer-list-item">
            <Link to={`/dashboard/${provider}/${customer.id}`}>
              {customer.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CustomerList; 