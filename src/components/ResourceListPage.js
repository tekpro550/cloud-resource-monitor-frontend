import React, { useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import MetricsModal from './MetricsModal';
import './ResourceListPage.css';

const ResourceListPage = () => {
    const { state } = useLocation();
    const { provider, customerId, serviceType } = useParams();
    const resources = state?.resources || [];

    const [selectedResource, setSelectedResource] = useState(null);

    const handleViewDetails = (resource) => {
        setSelectedResource(resource);
    };

    const handleCloseModal = () => {
        setSelectedResource(null);
    };

    return (
        <div className="resource-list-page">
            <div className="resource-list-header">
                <Link to={`/dashboard/${provider}/${customerId}`} className="back-link">
                    &larr; Back to Services
                </Link>
                <h1>{serviceType}</h1>
            </div>

            <div className="resource-list-grid">
                {resources.length > 0 ? (
                    resources.map(resource => (
                        <div key={resource.id} className="resource-detail-card">
                            <h3>{resource.name}</h3>
                            <p><strong>ID:</strong> {resource.id}</p>
                            <p><strong>Status:</strong> <span className={`status-${resource.status?.toLowerCase()}`}>{resource.status}</span></p>
                            <p><strong>Region:</strong> {resource.region}</p>
                            <button className="view-details-btn" onClick={() => handleViewDetails(resource)}>
                                View Details
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No resources of this type were found.</p>
                )}
            </div>

            {selectedResource && (
                <MetricsModal
                    resource={selectedResource}
                    provider={provider}
                    customerId={customerId}
                    onClose={handleCloseModal}
                />
            )}
        </div>
    );
};

export default ResourceListPage; 