import React from 'react';
import { Link } from 'react-router-dom';
function Navbar({ isLoggedIn, isAdmin, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">Grocery Store</Link>
        <ul className="nav-menu">
          {isLoggedIn && ( 
            <>
              <li className="nav-item">
                <Link to="/" className="nav-link">Products</Link>
              </li>
              <li className="nav-item">
                <Link to="/cart" className="nav-link">Cart</Link>
              </li>
              <li className="nav-item">
                <Link to="/order-history" className="nav-link">Order History</Link>
              </li>
              {isAdmin && (
                <li className="nav-item">
                  <Link to="/admin" className="nav-link">Admin Panel</Link>
                </li>
              )}
              <li className="nav-item">
                <button onClick={onLogout} className="nav-link btn-logout">Logout</button>
              </li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li className="nav-item">
                <Link to="/login" className="nav-link">Login</Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;