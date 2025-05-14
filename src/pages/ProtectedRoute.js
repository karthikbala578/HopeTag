import React from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../config/firebaseconfig.js';
import { useAuthState } from 'react-firebase-hooks/auth';
import LoadingSpinner from './LoadingSpinner.js'; 

const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) return <LoadingSpinner />; // or just "Loading..."

  if (!user || !user.emailVerified) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
