import React from 'react';
import "./Dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>NGO/Govt Dashboard</h2>

      <div className="report-item">
        <p><strong>Issue:</strong> Pothole near 5th Street</p>
        <button>Claim</button>
        <button>Update</button>
        <button>Resolve</button>
      </div>

      <div className="report-item">
        <p><strong>Issue:</strong> Lost bag near bus stop</p>
        <button>Claim</button>
        <button>Update</button>
        <button>Resolve</button>
      </div>
    </div>
  );
};

export default Dashboard;
