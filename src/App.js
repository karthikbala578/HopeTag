import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from './config/firebaseconfig.js';
import { doc, getDoc } from 'firebase/firestore';
import Home from './pages/Home.js';
import Report from './pages/Report.js';
import MapView from './pages/MapView.js';
import Login from './pages/Login.js';
import SignUp from './pages/SignUp.js';
import Dashboard from './pages/Dashboard.js';
import Notifications from './pages/Notifications.js';
import LoadingSpinner from './pages/LoadingSpinner.js';
import { ToastContainer } from 'react-toastify';

import './App.css';

// ProtectedRoute Component
function ProtectedRoute({ children }) {
  const [user, loading] = useAuthState(auth);

  // If loading or no user, redirect to login
  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

function App() {
  const [user, loading] = useAuthState(auth);
  const [role, setRole] = useState('');
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    if (user) {
      const userRef = doc(db, "users", user.uid); // Use user UID instead of email
      getDoc(userRef).then((docSnap) => {
        if (docSnap.exists()) {
          setRole(docSnap.data().role);  // Get user role from Firestore
        }
      });
    }

    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 1000);

    return () => clearTimeout(timer); // Cleanup
  }, [user]);

  if (showSpinner || loading) {
    return <LoadingSpinner />;
  }

  return (
    <>
    <ToastContainer position="top-right" autoClose={3000} />
    <Router>
      

      <Routes>
        <Route path="/login" element={!user || !user.emailVerified ? <Login /> : <Navigate to="/" />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected Routes */}
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/report" element={<ProtectedRoute><Report /></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><MapView /></ProtectedRoute>} />

        {/* Only render protected routes if the user is an admin */}
        <Route path="/dashboard" element={<ProtectedRoute>{role === 'admin' ? <Dashboard /> : <Navigate to="/" />}</ProtectedRoute>} />
        <Route path="/notifications" element={<ProtectedRoute>{role === 'admin' ? <Notifications /> : <Navigate to="/" />}</ProtectedRoute>} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
