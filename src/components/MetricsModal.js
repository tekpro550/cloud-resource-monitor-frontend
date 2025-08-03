import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { buildApiUrl, apiRequest } from '../config';
import './MetricsModal.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const MetricsModal = ({ resource, provider, customerId, onClose }) => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMetrics = useCallback(async () => {
        if (!resource) return;
        setLoading(true);
        setError(null);
        
        try {
            // Use resource name for Lightsail instances, ID for others
            const resourceIdentifier = resource.name || resource.id;
            
            const url = buildApiUrl('get_resource_details', {
                customer_id: customerId,
                provider: provider,
                resource_id: resourceIdentifier,
                region: resource.region
            });
            
            console.log('Fetching metrics from:', url);
            const data = await apiRequest(url);
            
            setMetrics(data.metrics || []);
            
            if (!data.metrics || data.metrics.length === 0) {
                setError(data.message || 'No metrics available for this resource.');
            }
        } catch (err) {
            console.error('Error fetching metrics:', err);
            setError(`Failed to fetch metrics: ${err.message}`);
        } finally {
            setLoading(false);
        }
    }, [resource, provider, customerId]); // Added dependencies for useCallback

    useEffect(() => {
        fetchMetrics();
    }, [fetchMetrics]); // fetchMetrics is now a stable function due to useCallback

    const handleRefresh = async () => {
        setRefreshing(true);
        setError(null);
        
        try {
            // First refresh the metrics data
            const refreshUrl = buildApiUrl('refresh_metrics', {
                customer_id: customerId,
                provider: provider
            });
            
            console.log('Refreshing metrics via:', refreshUrl);
            await apiRequest(refreshUrl, { method: 'POST' });
            
            // Wait a moment for the refresh to complete
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Then fetch the updated metrics
            await fetchMetrics();
        } catch (err) {
            console.error('Error refreshing metrics:', err);
            setError(`Failed to refresh metrics: ${err.message}`);
        } finally {
            setRefreshing(false);
        }
    };

    const getChartData = (metric) => {
        if (!metric.data || metric.data.length === 0) {
            return {
                labels: [],
                datasets: [{
                    label: `${metric.name} (${metric.unit || ''})`,
                    data: [],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.2)',
                    fill: true,
                }]
            };
        }

        return {
            labels: metric.data.map(d => new Date(d.timestamp)),
            datasets: [{
                label: `${metric.name} (${metric.unit || ''})`,
                data: metric.data.map(d => d.value),
                borderColor: '#3498db',
                backgroundColor: 'rgba(52, 152, 219, 0.2)',
                fill: true,
            }]
        };
    };

    const getChartOptions = (metricName) => ({
        responsive: true,
        plugins: { 
            legend: { display: false }, 
            title: { display: true, text: metricName } 
        },
        scales: { 
            x: { 
                type: 'time', 
                time: { unit: 'minute' } 
            }, 
            y: { 
                beginAtZero: true 
            } 
        }
    });

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Metrics for {resource.name || resource.id}</h2>
                    <button onClick={handleRefresh} className="refresh-btn" disabled={refreshing || loading}>
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>
                <div className="modal-body">
                    {(loading || refreshing) && (
                        <div className="loading-container">
                            <p>{loading ? 'Loading metrics...' : 'Refreshing metrics...'}</p>
                        </div>
                    )}
                    
                    {error && (
                        <div className="error-container">
                            <p>Error: {error}</p>
                            <button onClick={fetchMetrics} className="retry-btn">
                                Retry
                            </button>
                        </div>
                    )}
                    
                    {metrics && metrics.length > 0 ? (
                        <div className="charts-grid">
                            {metrics.map((metric, index) => (
                                <div key={`${metric.name}-${index}`} className="chart-container">
                                    <Line 
                                        options={getChartOptions(metric.name)} 
                                        data={getChartData(metric)} 
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && !refreshing && !error && (
                            <div className="no-metrics">
                                <p>No metrics available for this resource.</p>
                                <p>This could be because:</p>
                                <ul>
                                    <li>The resource is newly created and metrics haven't been generated yet</li>
                                    <li>Monitoring is not enabled for this resource</li>
                                    <li>There are permission issues accessing the metrics</li>
                                </ul>
                                <button onClick={handleRefresh} className="refresh-btn">
                                    Try Refreshing Metrics
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
};

export default MetricsModal;