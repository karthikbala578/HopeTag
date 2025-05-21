import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, provider, db } from '../config/firebaseconfig.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import './Login.css';
import { showSuccessToast, showErrorToast } from '../Toast/toastUtils.js'
import Google from '../image/g-logo.png'

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false); // Add loading state // Add state for animation

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (user.emailVerified) {
        /* alert('Login Successful!'); */
        showSuccessToast("Login successful!")

        // Trigger animationc
        // Delay navigation for 1.5 seconds to show animation
        setTimeout(() => {
          navigate('/');
        }, 1500); // Delay for 1.5 seconds
      } else {
       /*  alert('Please verify your email before logging in.'); */
        showErrorToast('Please verify your email before logging in.');
        await auth.signOut(); // Prevent access if not verified
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true); // Start loading
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Save role & email in Firestore if not already present
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // If user is not in Firestore, add them with default 'user' role
        await setDoc(userRef, {
          email: user.email,
          role: 'user', // default role
        });
      }

      alert(`Welcome ${user.displayName}`);
      navigate('/');
    } catch (error) {
      /* alert(error.message); */
      showErrorToast(error.message);
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div className="auth-page-container">
  <div className="auth-box">
    <form onSubmit={handleLogin} >
      <h2 className="auth-title">Login</h2>

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

      <button type="submit" className="auth-button" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>

      <p className="auth-text">
        Don't have an account?{' '}
        <Link to="/signup" className="auth-link">Signup</Link>
      </p>
    </form>

    <div className="divider">
      <span>OR</span>
    </div>

    <button
      onClick={handleGoogleSignIn}
      className="google-sign-in-button"
      disabled={loading}
    >
      <img
        src={Google}
        alt="Google Icon"
        className="google-icon"
      />
      {loading ? 'Signing in with Google...' : 'Sign in with Google'}
    </button>

    {loading && (
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
      </div>
    )}
  </div>
</div>

  );
}
