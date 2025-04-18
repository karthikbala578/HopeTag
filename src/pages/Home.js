import React from 'react';
import "./Home.css";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-header">HopeTag</h1>
      <p className="home-subtext">
        A platform for reporting homelessness, lost items, and civic issues.
      </p>

      <div className="cta-buttons">
        <Link to="/report" className="cta-link">📌 Report</Link>
        <Link to="/map" className="cta-link">🗺 View Map</Link>
        <Link to="/login" className="cta-link">🔐 Login</Link>
        <Link to="/dashboard" className="cta-link">📊 Dashboard</Link>
        <Link to="/notifications" className="cta-link">🔔 Notifications</Link>
      </div>
    </div>
  );
};

export default Home;
