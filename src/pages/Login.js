import React, { useState } from 'react';
import "./Login.css";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  return (
    <div className="login-container">
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <input type="email" placeholder="Email" />
      <input type="password" placeholder="Password" />
      {!isLogin && <input type="text" placeholder="Organization (optional)" />}
      <button>{isLogin ? 'Login' : 'Register'}</button>
      <p className="toggle" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Need an account? Register here' : 'Already have an account? Login'}
      </p>
    </div>
  );
};
export default Login;
