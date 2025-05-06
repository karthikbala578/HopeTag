import React, { useState } from 'react';
import { useNavigate,Link } from "react-router-dom";
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebaseconfig';

import './Auth.css';

export default function SignupPage({ switchToLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
   const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }
      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert('Signup Successful!');
        navigate('/login'); // Redirect after signup
      } catch (error) {
        alert(error.message);
      }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSignup} className="auth-form">
        <h2>Signup</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="auth-input"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="auth-input"
          required
        />
        <button type="submit" className="auth-button">
          Signup
        </button>
        <p>
          Already have an account? <Link to="/Login" className="auth-link">Login</Link>
        </p>
      </form>
    </div>
  );
}
