import React, { useState } from 'react';
import axios from 'axios';
import photo from '../assets/6300830.jpg';
function Login({ setIsLoggedIn, setIsAdmin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('isAdmin', response.data.isAdmin);
      setIsLoggedIn(true);
      setIsAdmin(response.data.isAdmin);
    } catch (error) {
      console.error('Login error:', error.response?.data?.message || 'Error occurred');
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        {/* Illustration */}
        <div className="illustration-wrapper">
          <img src={photo} alt="Illustration" />
        </div>

        {/* Login Form */}
        <div id="login-form">
          <p className="form-title">Login</p>
          <form onSubmit={handleSubmit}>
            <p>
              <label>Email</label><br/>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="ant-input"
              />
            </p>
            <p>
              <label>Password</label><br/>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="ant-input"
              />
            </p>
            <p>
              <button type="submit" className="login-form-button">
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
