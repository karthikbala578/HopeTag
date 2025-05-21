import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { auth, db } from '../config/firebaseconfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FaSignOutAlt } from 'react-icons/fa';
import "./Navbar.css";


const Navbar=()=>{

    const [role, setRole] = useState('user'); // Default to 'user'
    const [loading, setLoading] = useState(true);
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

    return(

        <nav className="navbar">
        <div className="navbar-logo">
          <h2>Hope<span>Tag</span></h2>
        </div>

        <div className="navbar-links">
          <Link to="/" className="nav-link"> Home</Link>
          <Link to="/report" className="nav-link"> Report</Link>
          <Link to="/map" className="nav-link">View Map</Link>
          {role === 'admin' && (
            <>
              <Link to="/dashboard" className="nav-link"> Dashboard</Link>
              <Link to="/notifications" className="nav-link"> Notifications</Link>
            </>
          )}
          <button className="logout-button" onClick={() => signOut(auth)}>
            <FaSignOutAlt size={18} />
          </button>
        </div>


        
      </nav>
    )

    
}
export default Navbar;