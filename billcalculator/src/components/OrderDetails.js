import React, { useState } from 'react';
import axios from 'axios';

function OrderDetails({ order, onClose, onUpdate }) {
  const [updatedOrder, setUpdatedOrder] = useState(order);

  const markProductAsDone = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/orders/${order._id}/product/${productId}`, 
        { isDone: true },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setUpdatedOrder(prevOrder => ({
        ...prevOrder,
        items: prevOrder.items.map(item => 
          item.product._id === productId ? { ...item, isDone: true } : item
        )
      }));
    } catch (error) {
      console.error('Error marking product as done:', error);
    }
  };

  const updateOrderStatus = async (status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/orders/${order._id}`, 
        { status },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setUpdatedOrder(prevOrder => ({ ...prevOrder, status }));
      onUpdate();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const markAsPaid = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:5000/api/orders/${order._id}`, 
        { isPaid: true },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setUpdatedOrder(prevOrder => ({ ...prevOrder, isPaid: true }));
      onUpdate();
    } catch (error) {
      console.error('Error marking order as paid:', error);
    }
  };

  const allProductsDone = updatedOrder.items.every(item => item.isDone);

  return (
    <div style={{ 
      position: 'fixed', 
      top: '50%', 
      left: '50%', 
      transform: 'translate(-50%, -50%)', 
      backgroundColor: 'white', 
      padding: '20px', 
      boxShadow: '0 0 10px rgba(0,0,0,0.1)',
      maxHeight: '80vh',
      overflowY: 'auto'
    }}>
      <h3>Order Details</h3>
      <p>Order ID: {updatedOrder._id}</p>
      <p>Customer: {updatedOrder.user.name}</p>
      <p>Total: ${updatedOrder.total.toFixed(2)}</p>
      <p>Status: {updatedOrder.status}</p>
      <p>Paid: {updatedOrder.isPaid ? 'Yes' : 'No'}</p>
      <h4>Products:</h4>
      <ul>
        {updatedOrder.items.map((item) => (
          <li key={item.product._id}>
            {item.product.name} - Quantity: {item.quantity} - ${(item.product.price * item.quantity).toFixed(2)}
            {!item.isDone && (
              <button onClick={() => markProductAsDone(item.product._id)}>Mark as Done</button>
            )}
            {item.isDone && <span style={{ color: 'green' }}> (Done)</span>}
          </li>
        ))}
      </ul>
      {updatedOrder.status !== 'Completed' && allProductsDone && (
        <button onClick={() => updateOrderStatus('Completed')}>Mark Order as Completed</button>
      )}
      {!updatedOrder.isPaid && (
        <button onClick={markAsPaid}>Mark as Paid</button>
      )}
      <button onClick={onClose}>Close</button>
    </div>
  );
}

export default OrderDetails;