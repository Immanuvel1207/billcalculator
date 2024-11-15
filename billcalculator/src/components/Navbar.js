import React from 'react';
import { Link } from 'react-router-dom';

function Navbar({ isLoggedIn, isAdmin, onLogout }) {
  return (
    <nav style={{
      backgroundColor: 'var(--primary-color)',
      padding: '10px 20px',
      color: 'var(--white)',
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
      }}>
        <h1 style={{ margin: 0 }}>Grocery Store</h1>
        <ul style={{
          listStyle: 'none',
          padding: 0,
          display: 'flex',
          gap: '20px',
        }}>
          {isLoggedIn && (
            <>
              <li><Link to="/" style={{ color: 'var(--white)', textDecoration: 'none' }}>Products</Link></li>
              <li><Link to="/cart" style={{ color: 'var(--white)', textDecoration: 'none' }}>Cart</Link></li>
              <li><Link to="/order-history" style={{ color: 'var(--white)', textDecoration: 'none' }}>Order History</Link></li>
              {isAdmin && <li><Link to="/admin" style={{ color: 'var(--white)', textDecoration: 'none' }}>Admin Panel</Link></li>}
              <li><button onClick={onLogout} style={{
                background: 'none',
                border: 'none',
                color: 'var(--white)',
                cursor: 'pointer',
              }}>Logout</button></li>
            </>
          )}
          {!isLoggedIn && (
            <>
              <li><Link to="/login" style={{ color: 'var(--white)', textDecoration: 'none' }}>Login</Link></li>
              <li><Link to="/register" style={{ color: 'var(--white)', textDecoration: 'none' }}>Register</Link></li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;