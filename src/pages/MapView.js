import React, { useState } from 'react';
import "./MapView.css";

const MapView = () => {
  const [filters, setFilters] = useState({ category: '', status: '' });
  return (
    <div className="map-view-container">
      <div className="filter-bar">
        <select onChange={(e) => setFilters({ ...filters, category: e.target.value })}>
          <option value="">All Categories</option>
          <option value="homelessness">Homelessness</option>
          <option value="lost">Lost Items</option>
          <option value="civic">Civic Issues</option>
        </select>
        <select onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="in-progress">In Progress</option>
          <option value="resolved">Resolved</option>
        </select>
      </div>
      <div style={{ height: "400px", background: "#e2e8f0" }}>
        {/* Placeholder for map */}
        <p style={{ padding: 20 }}>Map would go here</p>
      </div>
    </div>
  );
};
export default MapView;
