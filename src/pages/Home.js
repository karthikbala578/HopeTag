import React from 'react';
import "./Home.css";
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="home-header">Welcome to HopeTag</h1>
      <p className="home-mission">
        A community platform for reporting homelessness, lost items, and civic issues.
      </p>
      <div className="category-icons">
        <div className="category-icon">
          <img src="/icons/homeless.png" alt="Homelessness" />
          <p>Homelessness</p>
        </div>
        <div className="category-icon">
          <img src="/icons/lost.png" alt="Lost Items" />
          <p>Lost Items</p>
        </div>
        <div className="category-icon">
          <img src="/icons/civic.png" alt="Civic Issues" />
          <p>Civic Issues</p>
        </div>
      </div>
      <div className="cta-buttons"> <Link to="/report">Report</Link> <Link to="/map">View Map</Link> <Link to="/login">Login</Link> <Link to="/dashboard">Dashboard</Link> <Link to="/notifications">Notification</Link> </div>
    </div>
  );
};
export default Home;
