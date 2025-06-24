import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale } from 'chart.js';
import 'chartjs-adapter-date-fns';
import './MetricsModal.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, TimeScale);

const API_BASE_URL = "https://cloud-resource-monitor-backend.azurewebsites.net/api";
const FUNCTION_KEY = "your_master_or_details_function_key"; // IMPORTANT: Replace with the correct key

const MetricsModal = ({ resource, provider, customerId, onClose }) => {
    const [metrics, setMetrics] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    const fetchMetrics = async () => {
        if (!resource) return;
        setLoading(true);
        setError(null);
        try {
            const url = `${API_BASE_URL}/get_resource_details?code=${FUNCTION_KEY}&customer_id=${customerId}&provider=${provider}&resource_id=${encodeURIComponent(resource.id)}&region=${resource.region}`;
            const response = await fetch(url);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to fetch metrics: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            setMetrics(data.metrics);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMetrics();
    }, [resource, provider, customerId]);

    const handleRefresh = async () => {
        setRefreshing(true);
        setError(null);
        try {
            const refreshUrl = `${API_BASE_URL}/refresh_metrics?code=${FUNCTION_KEY}&customer_id=${customerId}&provider=${provider}&resource_id=${encodeURIComponent(resource.id)}&region=${resource.region}`;
            const res = await fetch(refreshUrl, { method: 'POST' });
            if (!res.ok) throw new Error(`Error refreshing metrics: ${res.status}`);
            // After refresh, reload metrics
            await fetchMetrics();
        } catch (err) {
            setError(err.message);
        } finally {
            setRefreshing(false);
        }
    };

    const getChartData = (metric) => ({
        labels: metric.data.map(d => new Date(d.timestamp)),
        datasets: [{
            label: `${metric.name} (${metric.unit})`,
            data: metric.data.map(d => d.value),
            borderColor: '#3498db',
            backgroundColor: 'rgba(52, 152, 219, 0.2)',
            fill: true,
        }]
    });

    const getChartOptions = (metricName) => ({
        responsive: true,
        plugins: { legend: { display: false }, title: { display: true, text: metricName } },
        scales: { x: { type: 'time', time: { unit: 'minute' } }, y: { beginAtZero: true } }
    });

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Metrics for {resource.name}</h2>
                    <button onClick={handleRefresh} className="refresh-btn" disabled={refreshing || loading}>
                        {refreshing ? 'Refreshing...' : 'Refresh'}
                    </button>
                    <button onClick={onClose} className="close-btn">&times;</button>
                </div>
                <div className="modal-body">
                    {(loading || refreshing) && <p>Loading metrics...</p>}
                    {error && <div className="error-container"><p>Error: {error}</p></div>}
                    {metrics && metrics.length > 0 ? (
                        <div className="charts-grid">
                            {metrics.map(metric => (
                                <div key={metric.name} className="chart-container">
                                    <Line options={getChartOptions(metric.name)} data={getChartData(metric)} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        !loading && !refreshing && <p>No metrics available for this resource.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MetricsModal; 