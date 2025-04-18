import React, { useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './MapView.css';

const mockReports = [
  { id: 1, category: "homelessness", status: "pending", description: "Man sleeping outside park entrance", lat: 11.6643, lng: 78.1460 },
  { id: 2, category: "lost", status: "in-progress", description: "Lost mobile phone near mall", lat: 11.6743, lng: 78.1360 },
  { id: 3, category: "civic", status: "resolved", description: "Open manhole on 7th Street", lat: 11.6543, lng: 78.1560 },
  { id: 4, category: "homelessness", status: "resolved", description: "Elderly person helped by NGO", lat: 11.6643, lng: 78.1460 },
  { id: 5, category: "lost", status: "pending", description: "Lost wallet in the bus station", lat: 11.6750, lng: 78.1470 },
  { id: 6, category: "civic", status: "in-progress", description: "Street light not working on Kamaraj Road", lat: 11.6890, lng: 78.1580 },
  { id: 7, category: "homelessness", status: "resolved", description: "Homeless woman receiving help from local NGO", lat: 11.6635, lng: 78.1490 },
  { id: 8, category: "lost", status: "resolved", description: "Lost backpack near shopping complex", lat: 11.6620, lng: 78.1450 },
  { id: 9, category: "civic", status: "pending", description: "Broken sidewalk near Salem Junction", lat: 11.6610, lng: 78.1480 },
  { id: 10, category: "homelessness", status: "in-progress", description: "Man asking for food at main road", lat: 11.6660, lng: 78.1520 },
];

const MapView = () => {
  const [filters, setFilters] = useState({ category: '', status: '' });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(12);

  const filteredReports = mockReports.filter((report) => {
    return (
      (filters.category === "" || report.category === filters.category) &&
      (filters.status === "" || report.status === filters.status)
    );
  });

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
  };

  const defaultCenter = { lat: 11.6643, lng: 78.1460 };

  const center = selectedLocation ? selectedLocation : defaultCenter;

  const handleReportClick = (report) => {
    setSelectedLocation({ lat: report.lat, lng: report.lng });
    setZoomLevel(17);
  };

  const handleResetView = () => {
    setSelectedLocation(null);
    setZoomLevel(12); 
  };

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

      <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={center}
          zoom={zoomLevel}
        >
          {filteredReports.map((report) => (
            <Marker key={report.id} position={{ lat: report.lat, lng: report.lng }} />
          ))}
        </GoogleMap>
      </LoadScript>

      <div className="report-results">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div
              key={report.id}
              className="report-card"
              onClick={() => handleReportClick(report)}
              style={{ cursor: 'pointer' }}
            >
              <h4>{report.category.charAt(0).toUpperCase() + report.category.slice(1)}</h4>
              <p>Status: {report.status}</p>
              <p>{report.description}</p>
            </div>
          ))
        ) : (
          <p style={{ padding: "20px" }}>No reports match your filter.</p>
        )}
      </div>

      {selectedLocation && (
        <button onClick={handleResetView}>Reset View</button>
      )}
    </div>
  );
};

export default MapView;
