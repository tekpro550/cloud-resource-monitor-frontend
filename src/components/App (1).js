import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [domainInput, setDomainInput] = useState('');
  const [domains, setDomains] = useState([]);

  const checkSSLUrl = 'https://prod-21.centralindia.logic.azure.com:443/workflows/745d4acf0561479e952c4e601827158b/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=2UJaMZkEnCaXucYkBV_4kNX4fFX7hMfA4ZqICohYPsw';
  const getDomainsUrl = 'https://prod-30.centralindia.logic.azure.com:443/workflows/4e5f65610bf246b8af8bd791704ae0af/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=DjFwFBCLYMquIqPS9yZEoroP_NmqL84rMzQ2Cl_ME1w';
  const deleteDomainUrl = 'https://prod-20.centralindia.logic.azure.com:443/workflows/30d3fa6ec4214d05abe4ef4cca0097ba/triggers/When_a_HTTP_request_is_received/paths/invoke?api-version=2016-10-01&sp=%2Ftriggers%2FWhen_a_HTTP_request_is_received%2Frun&sv=1.0&sig=-poycM7VzJAHz9nsiz2IsxQaeAxPBVrAWMxP-_mK7bQ';

  const fetchDomains = async () => {
    try {
      const response = await fetch(getDomainsUrl);
      const data = await response.json();
      if (Array.isArray(data.domains)) {
        setDomains(data.domains);
      } else if (Array.isArray(data)) {
        setDomains(data);
      } else {
        setDomains([]);
      }
    } catch (error) {
      console.error('Error fetching domains:', error);
      setDomains([]);
    }
  };

  const addDomain = async () => {
    if (!domainInput.trim()) return;
    try {
      await fetch(checkSSLUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain: domainInput.trim() })
      });
      setDomainInput('');
      setTimeout(fetchDomains, 3000);
    } catch (error) {
      console.error('Error adding domain:', error);
    }
  };

  const deleteDomain = async (domain) => {
    if (!window.confirm(`Delete ${domain}?`)) return;
    try {
      await fetch(deleteDomainUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain })
      });
      setTimeout(fetchDomains, 1000);
    } catch (error) {
      console.error('Error deleting domain:', error);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  return (
    <div className="App">
      <h1>🔐 SSL Expiry Monitor</h1>

      <div className="input-box">
        <input
          type="text"
          value={domainInput}
          placeholder="Enter domain (e.g. example.com)"
          onChange={(e) => setDomainInput(e.target.value)}
        />
        <button onClick={addDomain}>➕ Add Domain</button>
        <button onClick={fetchDomains}>🔁 Refresh</button>
      </div>

      {Array.isArray(domains) && domains.length === 0 ? (
        <p>No domains loaded. Use ➕ Add or 🔁 Refresh to populate the list.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Domain</th>
              <th>Expiry Date</th>
              <th>Days Left</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {domains.map((domain, index) => (
              <tr key={index}>
                <td>{domain?.domain || domain?.RowKey || 'N/A'}</td>
                <td>{domain?.valid_till ? new Date(domain?.valid_till).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}</td>
                <td>{domain?.days_left ?? 'N/A'}</td>
                <td className={
                  domain?.status === 'expired' ? 'status-expired' :
                  domain?.status === 'expiring' ? 'status-expiring' :
                  domain?.status === 'active' ? 'status-active' :
                  'status-unknown'
                }>
                  {domain?.status || 'unknown'}
                </td>
                <td>
                  <button onClick={() => deleteDomain(domain?.domain || domain?.RowKey)}>
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
