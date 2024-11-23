import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import AdminPanel from './components/AdminPanel';
import OrderHistory from './components/OrderHistory';
import Navbar from './components/Navbar';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userIsAdmin = localStorage.getItem('isAdmin') === 'true';
    if (token) {
      setIsLoggedIn(true);
      setIsAdmin(userIsAdmin);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('isAdmin');
    setIsLoggedIn(false);
    setIsAdmin(false);
  };

  return (
    <Router>
      <div className="app">
        <Navbar isLoggedIn={isLoggedIn} isAdmin={isAdmin} onLogout={handleLogout} />
        <div className="container">
          <Routes>
            <Route 
              path="/" 
              element={isLoggedIn ? <ProductList /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/login" 
              element={!isLoggedIn ? <Login setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/register" 
              element={!isLoggedIn ? <Register setIsLoggedIn={setIsLoggedIn} setIsAdmin={setIsAdmin} /> : <Navigate to="/" />} 
            />
            <Route 
              path="/cart" 
              element={isLoggedIn ? <Cart /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/admin" 
              element={isAdmin ? <AdminPanel /> : <Navigate to="/" />} 
            />
            <Route 
              path="/order-history" 
              element={isLoggedIn ? <OrderHistory /> : <Navigate to="/login" />} 
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;