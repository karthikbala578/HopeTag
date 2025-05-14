import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../config/firebaseconfig';
import { setDoc, doc } from 'firebase/firestore';
import './Auth.css';

export default function SignUp() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await sendEmailVerification(user);

      // ✅ Use uid as document ID
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "user"
      });

      alert("Sign up successful! Verification email sent.");
      navigate("/login");
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

 return (
  <div className="auth-container">
    {loading && (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
      </div>
    )}
    <form className={`auth-form ${loading ? 'fade-out' : ''}`} onSubmit={handleSignUp}>
      <h2>Sign Up</h2>
      <input
        className="auth-input"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        required
      />
      <input
        className="auth-input"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button className="auth-button" type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Sign Up'}
      </button>
    </form>
  </div>
);

}
