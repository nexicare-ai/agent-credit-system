import React, { useState, useEffect } from 'react';
import { analyticsService } from '../services/api';
import '../styles/Dashboard.css';

const EventTypeCard = ({ title, count, percentage, onClick }) => (
  <div className="event-card" onClick={onClick}>
    <h3 className="event-card-title">{title}</h3>
    <div className="event-card-count">{count}</div>
    <div className="event-card-percentage">{percentage}%</div>
  </div>
);

const EventTable = ({ events, onEventClick }) => (
  <div className="event-table-container">
    <table className="event-table">
      <thead>
        <tr>
          <th>Event Name</th>
          <th>Session ID</th>
          <th>Reference ID</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        {events.map(event => (
          <tr key={event.id} onClick={() => onEventClick(event)} className="event-row">
            <td>{event.event_name}</td>
            <td>{event.session_id.substring(0, 8)}...</td>
            <td>{event.reference_id || '-'}</td>
            <td>{new Date(event.timestamp).toLocaleString()}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const EventChart = ({ data }) => {
  // Calculate dimensions
  const width = 800;
  const height = 300;
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  // Find the maximum count for scaling
  const maxCount = Math.max(...data.map(item => item.count), 0);

  // Generate bars
  const bars = data.map((item, index) => {
    const barWidth = chartWidth / data.length - 4;
    const barHeight = (item.count / maxCount) * chartHeight;
    const x = padding + index * (chartWidth / data.length);
    const y = height - padding - barHeight;

    return (
      <g key={item.date}>
        <rect
          x={x}
          y={y}
          width={barWidth}
          height={barHeight}
          fill="#4a90e2"
        />
        <text
          x={x + barWidth / 2}
          y={height - padding + 20}
          textAnchor="middle"
          fontSize="10"
          fill="#555"
        >
          {new Date(item.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
        </text>
        <text
          x={x + barWidth / 2}
          y={y - 5}
          textAnchor="middle"
          fontSize="10"
          fill="#555"
        >
          {item.count}
        </text>
      </g>
    );
  });

  // Generate y-axis labels
  const yAxisLabels = [];
  const numLabels = 5;
  for (let i = 0; i <= numLabels; i++) {
    const value = Math.round((maxCount / numLabels) * i);
    const y = height - padding - (i / numLabels) * chartHeight;

    yAxisLabels.push(
      <g key={`y-${i}`}>
        <line
          x1={padding - 5}
          y1={y}
          x2={width - padding}
          y2={y}
          stroke="#ddd"
          strokeWidth="1"
        />
        <text
          x={padding - 10}
          y={y + 5}
          textAnchor="end"
          fontSize="10"
          fill="#555"
        >
          {value}
        </text>
      </g>
    );
  }

  return (
    <div className="chart-container">
      <h3>Daily Event Counts</h3>
      <svg width={width} height={height}>
        {yAxisLabels}
        {bars}
        <line
          x1={padding}
          y1={height - padding}
          x2={width - padding}
          y2={height - padding}
          stroke="#555"
          strokeWidth="1"
        />
        <line
          x1={padding}
          y1={padding}
          x2={padding}
          y2={height - padding}
          stroke="#555"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
};

const EventDetailView = ({ event, onClose }) => {
  const formatValue = (value) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return value.toString();
  };

  const renderEventDataFields = (data) => {
    if (!data || Object.keys(data).length === 0) {
      return <p className="text-gray-500">No event data available</p>;
    }

    return (
      <div className="event-data-fields">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="event-data-field">
            <div className="event-data-label">{key}:</div>
            <div className="event-data-value">
              {typeof value === 'object' ? (
                <pre>{JSON.stringify(value, null, 2)}</pre>
              ) : (
                formatValue(value)
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="event-detail-modal">
      <div className="event-detail-modal-content">
        <div className="event-detail-header">
          <h2>Event Details</h2>
          <button className="event-detail-close" onClick={onClose}>×</button>
        </div>
        <div className="event-detail-body">
          <div className="event-detail-section">
            <h3>Basic Information</h3>
            <div className="event-detail-info">
              <div className="event-info-item">
                <div className="event-info-label">Event ID:</div>
                <div className="event-info-value">{event.id}</div>
              </div>
              <div className="event-info-item">
                <div className="event-info-label">Event Name:</div>
                <div className="event-info-value">{event.event_name}</div>
              </div>
              <div className="event-info-item">
                <div className="event-info-label">Session ID:</div>
                <div className="event-info-value">{event.session_id}</div>
              </div>
              <div className="event-info-item">
                <div className="event-info-label">Reference ID:</div>
                <div className="event-info-value">{event.reference_id || '-'}</div>
              </div>
              <div className="event-info-item">
                <div className="event-info-label">Timestamp:</div>
                <div className="event-info-value">{new Date(event.timestamp).toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="event-detail-section">
            <h3>Event Data</h3>
            {renderEventDataFields(event.event_data)}
          </div>

          {event.metadata && Object.keys(event.metadata).length > 0 && (
            <div className="event-detail-section">
              <h3>Metadata</h3>
              {renderEventDataFields(event.metadata)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const ClinicFilter = ({ clinics, selectedClinic, onChange }) => {
  return (
    <div className="clinic-filter">
      <label htmlFor="clinic-select">Filter by Clinic:</label>
      <select
        id="clinic-select"
        value={selectedClinic || ''}
        onChange={(e) => onChange(e.target.value === '' ? null : e.target.value)}
      >
        <option value="">All Clinics</option>
        {clinics.map((clinic) => (
          <option key={clinic.reference_id} value={clinic.reference_id}>
            {clinic.reference_id} ({clinic.count} events)
          </option>
        ))}
      </select>
    </div>
  );
};

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState(7);
  const [summary, setSummary] = useState(null);
  const [selectedEventType, setSelectedEventType] = useState(null);
  const [eventTypeData, setEventTypeData] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [filteredEvents, setFilteredEvents] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await analyticsService.getEventsSummary(days, selectedClinic);
        setSummary(data);
      } catch (error) {
        console.error('Failed to fetch summary:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [days, selectedClinic]);

  useEffect(() => {
    const fetchEventTypeData = async () => {
      if (!selectedEventType) return;

      try {
        setLoading(true);
        const data = await analyticsService.getEventsByType(selectedEventType, selectedClinic);
        setEventTypeData(data);
        setFilteredEvents(data);
      } catch (error) {
        console.error(`Failed to fetch events for type ${selectedEventType}:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventTypeData();
  }, [selectedEventType, selectedClinic]);

  const handleEventCardClick = (eventType) => {
    setSelectedEventType(eventType);
    setSelectedEvent(null);
  };

  const handleBackClick = () => {
    setSelectedEventType(null);
    setEventTypeData(null);
    setFilteredEvents(null);
    setSelectedEvent(null);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
  };

  const handleClinicFilterChange = (clinicId) => {
    // If clicking the same clinic ID that's already selected, clear the filter
    if (clinicId === selectedClinic) {
      setSelectedClinic(null);
    } else {
      setSelectedClinic(clinicId);
    }
  };

  if (loading && !summary) {
    return (
      <div className="dashboard loading-container">
        <div className="loading-spinner"></div>
        <p>Loading analytics data...</p>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="dashboard error-container">
        <p>Failed to load analytics data. Please try again later.</p>
        <button className="retry-button" onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (selectedEvent) {
    return (
      <div className="dashboard">
        {selectedEvent && <EventDetailView event={selectedEvent} onClose={() => setSelectedEvent(null)} />}
      </div>
    );
  }

  const eventsToDisplay = filteredEvents || eventTypeData;

  if (selectedEventType && eventsToDisplay) {
    return (
      <div className="dashboard event-detail-view">
        <div className="dashboard-header">
          <div className="dashboard-header-left">
            <button className="back-button" onClick={handleBackClick}>← Back to Dashboard</button>
            <h2>Events: {selectedEventType}</h2>
          </div>
          <ClinicFilter
            clinics={summary.top_references || []}
            selectedClinic={selectedClinic}
            onChange={handleClinicFilterChange}
          />
        </div>

        <div className="event-detail-content">
          <div className="event-summary-card">
            <h3>Event Summary</h3>
            <p><strong>Total Events:</strong> {eventsToDisplay.events.length}</p>
            <p><strong>Event Type:</strong> {selectedEventType}</p>
            {selectedClinic && <p><strong>Filtered by Clinic:</strong> {selectedClinic}</p>}
          </div>

          <EventTable events={eventsToDisplay.events} onEventClick={handleEventClick} />
        </div>
      </div>
    );
  }

  const totalEvents = summary.total_events || 0;
  const eventCards = Object.entries(summary.event_counts || {}).map(([name, count]) => {
    const percentage = totalEvents > 0 ? Math.round((count / totalEvents) * 100) : 0;
    return (
      <EventTypeCard
        key={name}
        title={name}
        count={count}
        percentage={percentage}
        onClick={() => handleEventCardClick(name)}
      />
    );
  });

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Nexi Analytics Dashboard</h1>
        <div className="dashboard-filters">
          <div className="date-filter">
            <label htmlFor="days-select">Time Period:</label>
            <select
              id="days-select"
              value={days}
              onChange={(e) => setDays(Number(e.target.value))}
            >
              <option value="1">Last 24 hours</option>
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <ClinicFilter
            clinics={summary.top_references || []}
            selectedClinic={selectedClinic}
            onChange={handleClinicFilterChange}
          />
        </div>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <h3>Total Events</h3>
          <div className="stat-value">{totalEvents.toLocaleString()}</div>
        </div>
        <div className="stat-card">
          <h3>Event Types</h3>
          <div className="stat-value">{Object.keys(summary.event_counts || {}).length}</div>
        </div>
        <div className="stat-card">
          <h3>Recent Events</h3>
          <div className="stat-value">{summary.recent_events?.length || 0}</div>
        </div>
      </div>

      {summary.daily_counts && summary.daily_counts.length > 0 && (
        <EventChart data={summary.daily_counts} />
      )}

      <div className="dashboard-section">
        <h2>Events by Type</h2>
        <div className="event-cards-container">
          {eventCards.length > 0 ? eventCards : <p>No events found for the selected period.</p>}
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Top Clinics</h2>
        <div className="reference-table-container">
          <table className="reference-table">
            <thead>
              <tr>
                <th>Clinic ID</th>
                <th>Event Count</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {summary.top_references && summary.top_references.map((ref, index) => (
                <tr key={ref.reference_id || index}>
                  <td>{ref.reference_id || 'Unknown'}</td>
                  <td>{ref.count}</td>
                  <td>
                    <button
                      className="filter-button"
                      onClick={() => handleClinicFilterChange(ref.reference_id)}
                    >
                      {selectedClinic === ref.reference_id ? 'Clear Filter' : 'Filter'}
                    </button>
                  </td>
                </tr>
              ))}
              {(!summary.top_references || summary.top_references.length === 0) && (
                <tr>
                  <td colSpan="3">No clinic data available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="dashboard-section-header">
          <h2>Recent Events</h2>
          {selectedClinic && (
            <div className="active-filters">
              <span className="filter-badge">
                Filtering by: {selectedClinic}
                <button
                  className="clear-filter-btn"
                  onClick={() => setSelectedClinic(null)}
                >
                  ×
                </button>
              </span>
            </div>
          )}
        </div>
        <EventTable events={summary.recent_events || []} onEventClick={handleEventClick} />
      </div>
    </div>
  );
};

export default Dashboard;
