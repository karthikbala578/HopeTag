import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../config/firebaseconfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FaSignOutAlt } from 'react-icons/fa'; // FontAwesome icon for logout
import './Home.css'

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

  return (
    <div>
      {/* Logout button in the top-right corner */}
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

          {/* Conditionally render Dashboard and Notifications based on role */}
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
};

export default Home;
