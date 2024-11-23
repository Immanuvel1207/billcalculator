import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    setCart(savedCart);
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map(item => 
      item._id === productId ? { ...item, quantity: newQuantity } : item
    ).filter(item => item.quantity > 0);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item._id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleCheckout = async () => {
    try {
      const token = localStorage.getItem('token');
      const order = {
        items: cart.map(item => ({ product: item._id, quantity: item.quantity })),
        total: calculateTotal(),
      };
      await axios.post('https://billcalculator.onrender.com/api/orders', order, {
        headers: { Authorization: `Bearer ${token}` }
      });
      localStorage.removeItem('cart');
      setCart([]);
      navigate('/order-history');
    } catch (error) {
      console.error('Error placing order:', error);
    }
  };

  return (
    <div className="cart">
      <h2>Your Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <div key={item._id} className="cart-item">
              <img src={item.imageUrl} alt={item.name} className="cart-item-image" />
              <div className="cart-item-details">
                <h3>{item.name}</h3>
                <p>${item.price.toFixed(2)}</p>
                <div className="quantity-control">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}>+</button>
                </div>
                <button onClick={() => removeItem(item._id)} className="remove-btn">Remove</button>
              </div>
            </div>
          ))}
          <div className="cart-total">
            <h3>Total: ${calculateTotal().toFixed(2)}</h3>
            <button onClick={handleCheckout} className="btn">Checkout</button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;