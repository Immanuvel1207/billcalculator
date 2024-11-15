import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const updateQuantity = (productId, newQuantity) => {
    const updatedCart = cart.map(item => 
      item.product._id === productId ? { ...item, quantity: newQuantity } : item
    ).filter(item => item.quantity > 0);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (productId) => {
    const updatedCart = cart.filter(item => item.product._id !== productId);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const placeOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/orders', {
        items: cart.map(item => ({ product: item.product._id, quantity: item.quantity })),
        total
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Order placed successfully');
      setCart([]);
      localStorage.removeItem('cart');
      navigate('/order-history');
    } catch (error) {
      console.error('Error placing order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  return (
    <div>
      <h2>Cart</h2>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {cart.map((item) => (
              <li key={item.product._id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{item.product.name} - ${(item.product.price * item.quantity).toFixed(2)}</span>
                <div>
                  <button onClick={() => updateQuantity(item.product._id, item.quantity - 1)}>-</button>
                  <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.product._id, item.quantity + 1)}>+</button>
                  <button onClick={() => removeItem(item.product._id)} style={{ marginLeft: '10px' }}>Remove</button>
                </div>
              </li>
            ))}
          </ul>
          <p>Total: ${total.toFixed(2)}</p>
          <button onClick={placeOrder} style={{ padding: '10px 20px' }}>Place Order</button>
        </>
      )}
    </div>
  );
}

export default Cart;