import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../config/firebaseconfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FaSignOutAlt, FaHome, FaSearch, FaHandsHelping,FaMapMarkedAlt, FaExclamationTriangle, FaCentercode} from 'react-icons/fa'; // FontAwesome icon for logout
import './Home.css'
import Navbar from '../NavBar/Navbar';

const Home = () => {
  const [role, setRole] = useState('user'); // Default to 'user'
  const [loading, setLoading] = useState(true); // For handling loading state


  // Fetch the role of the user from Firestore
  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userRef = doc(db, 'users', auth.currentUser.uid); // Get user by UID
        const docSnap = await getDoc(userRef);
        
        if (docSnap.exists()) {
          setRole(docSnap.data().role); // Set role if it exists in Firestore
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
      } finally {
        setLoading(false); // Stop loading once data is fetched
      }
    };

    if (auth.currentUser) {
      fetchUserRole(); // Fetch user role if authenticated
    } else {
      setLoading(false); // Stop loading if no user is authenticated
    }
  }, []);



  /* return (
    <div>
      <button className="logout-button" onClick={() => signOut(auth)}>
        <FaSignOutAlt size={20} />
      </button>

      <div className="home-container">
        <h1 className="home-header">HopeTag</h1>
        <p className="home-subtext">
          A platform for reporting homelessness, lost items, and civic issues.
        </p>

        <div className="cta-buttons">
          <Link to="/report" className="cta-link">📌 Report</Link>
          <Link to="/map" className="cta-link">🗺 View Map</Link>

          {role === 'admin' && (
            <>
              <Link to="/dashboard" className="cta-link">📊 Dashboard</Link>
              <Link to="/notifications" className="cta-link">🔔 Notifications</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}; */

return (
    <div>
      <Navbar/>
      {/* <header className="home-container">
        <h1 className="home-header">HopeTag</h1>
        <p className="home-subtext">
          A platform for reporting homelessness, lost items, and civic issues.
        </p>
        <div className="cta-buttons">
          <Link to="/report" className="cta-link"> Report</Link>
          <Link to="/map" className="cta-link">View Map</Link>
          {role === 'admin' && (
            <>
              <Link to="/dashboard" className="cta-link"> Dashboard</Link>
              <Link to="/notifications" className="cta-link"> Notifications</Link>
            </>
          )}
        </div>
      </header> */}

      <header className="home-container">
        <section className="hero-section">
          <div className="hero-content">
            {role ==='admin' ? <h1 className="home-header">HopeTag - Admin</h1> : <h1 className="home-header">HopeTag</h1>}
            
            <p className="home-subtext">
              A collaborative platform to report homelessness, lost items, and civic issues.
              Bridge the gap between people, NGOs, and authorities.
            </p>

            <div className="cta-buttons">
              <Link to="/report" className="cta-link"> Report Now</Link>
              <Link to="/map" className="cta-link">🗺 Explore Map</Link>
              {role === 'admin' && (
                <>
                  <Link to="/dashboard" className="cta-link"> Admin Dashboard</Link>
                  <Link to="/notifications" className="cta-link"> Notifications</Link>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="features-section">
          <h2 className="section-title">What You Can Do</h2>
          <div className="info-grid">
            {role === 'user' ? 
            <>
            <div className="info-card">
              <FaHandsHelping size={40} color="#0077b6" />
              <h3>Help the Homeless</h3>
              <p>Report homeless individuals and connect them with NGOs and shelters nearby.</p>
            </div>
            <div className="info-card">
              <FaExclamationTriangle size={40} color="#0077b6" />
              <h3>Raise Civic Issues</h3>
              <p>From potholes to overflowing garbage, get civic problems noticed and solved.</p>
            </div>
            <div className="info-card">
              <FaMapMarkedAlt size={40} color="#0077b6" />
              <h3>Track Issues on Map</h3>
              <p>View a real-time map of reported issues. Know what’s happening in your area.</p>
            </div>
            </>
            :
            <center>
              <div className="admin-info-card">
              <FaMapMarkedAlt size={40} color="#0077b6" />
              <h3>Track Issues on Map</h3>
              <p>View a real-time map of reported issues. Know what’s happening in your area.</p>
            </div>
            </center>
            }
            
            
          </div>
        </section>

        
      </header>


    </div>
  );
}

export default Home;
