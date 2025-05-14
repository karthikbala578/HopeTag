import React, { useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseconfig.js';
import './MapView.css';

const MapView = () => {
  const [reports, setReports] = useState([]);
  const [filters, setFilters] = useState({ category: '', status: '' });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(12);
  const [selectedReport, setSelectedReport] = useState(null); // Store the clicked report for details

  useEffect(() => {
    const fetchReports = async () => {
      const snapshot = await getDocs(collection(db, 'reports'));
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReports(data);
    };
    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    return (
      (filters.category === "" || report.category === filters.category) &&
      (filters.status === "" || report.status === filters.status)
    );
  });

  const handleReportClick = (report) => {
    if (report.location) {
      setSelectedLocation(report.location);
      setZoomLevel(17);
      setSelectedReport(report); // Store clicked report for showing details
    }
  };

  const handleResetView = () => {
    setSelectedLocation(null);
    setZoomLevel(12);
    setSelectedReport(null); // Reset selected report
  };

  const formatCreatedAt = (createdAt) => {
  const date = new Date(createdAt); // Convert ISO 8601 string to Date object
  return date.toLocaleString(); // Format it as a readable string
};

  // Loading Google Maps API
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAP_API_KEY,
  });

  // If the Google Maps API isn't loaded yet, show loading message
  if (!isLoaded) {
    return <p>Loading map...</p>;
  }

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

      <GoogleMap
        mapContainerStyle={{ height: '300px', width: '100%' }}
        center={selectedLocation || { lat: 11.6643, lng: 78.1460 }}
        zoom={zoomLevel}
      >
        {filteredReports.map((report) =>
          report.location ? (
            <Marker key={report.id} position={report.location} onClick={() => handleReportClick(report)} />
          ) : null
        )}
      </GoogleMap>

      <div className="report-results">
        {filteredReports.length > 0 ? (
          filteredReports.map((report) => (
            <div key={report.id} className="report-card" onClick={() => handleReportClick(report)}>
              {report.mediaUrl && (
                <img
                  src={report.mediaUrl}
                  alt="Report"
                  className="report-image"
                />
              )}
              <div className="report-content">
                <h4>{report.category ? report.category.charAt(0).toUpperCase() + report.category.slice(1) : 'Unknown'}</h4>
                <p className={`status ${report.status || 'unknown'}`}>
                  Status: {report.status ? report.status.charAt(0).toUpperCase() + report.status.slice(1) : 'Unknown'}
                </p>
                <p className="description">{report.description}</p>
            
              <div>
               <strong>Issue Time: </strong>{formatCreatedAt(report.createdAt)}
              </div>
              </div>  
            </div>
          ))
        ) : (
          <p className="no-report-message">No reports match your filter.</p>
        )}
      </div>

      {selectedLocation && (
        <button className="reset-btn" onClick={handleResetView}>Reset View</button>
      )}

      {/* Display report details with comment */}
      {selectedReport && (
        <div className="report-details">
          <h3>Report Details</h3>
          <p><strong>Category:</strong> {selectedReport.category}</p>
          <p><strong>Status:</strong> {selectedReport.status}</p>
          <p><strong>Description:</strong> {selectedReport.description}</p>
          <p><strong>Comment:</strong> {selectedReport.comment || 'No comment available'}</p>
        </div>
      )}
    </div>
  );
};

export default MapView;
