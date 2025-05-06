import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword ,signInWithPopup} from 'firebase/auth'; // ✅ corrected import
import { auth,provider } from '../config/firebaseconfig'; // ✅ correct path
import './Auth.css';

export default function Login() {
  const navigate = useNavigate(); // ✅ added navigate
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login Successful!');
      navigate('/dashboard'); // ✅ now it will work
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user; // Firebase user object
      alert(`Welcome ${user.displayName}`);
      navigate('/dashboard'); // Redirect after successful sign-in
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleLogin} className="auth-form">
        <h2>Login</h2>
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
        <button type="submit" className="auth-button">
          Login
        </button>
        <p>
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">Signup</Link> {/* ✅ small 'signup' ----<button onClick={handleGoogleSignIn} className="login-with-google-btn">
         Sign in with Google
         </button> */}
        </p>
      </form>
      
      <button onClick={handleGoogleSignIn} class="google-btn">
      <div class="google-icon-wrapper">
      <img class="google-icon" src="https://developers.google.com/identity/images/g-logo.png" alt="Google logo" />
      </div>
      <span class="btn-text">Sign in with Google</span>
      </button>


    </div>
  );
}
