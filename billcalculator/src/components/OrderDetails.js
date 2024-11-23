import React, { useState } from 'react';
import axios from 'axios';
import '../App.css';

function OrderDetails({ order, onClose, onUpdate }) {
  const [updatedOrder, setUpdatedOrder] = useState(order);

  const markProductAsDone = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`https://billcalculator.onrender.com/api/orders/${order._id}/product/${productId}`, 
        { isDone: true },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setUpdatedOrder(prevOrder => ({
        ...prevOrder,
        items: prevOrder.items.map(item => 
          item.product._id === productId ? { ...item, isDone: true } : item
        )
      }));
      onUpdate();
    } catch (error) {
      console.error('Error marking product as done:', error);
    }
  };

  const updateOrderStatus = async (status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`https://billcalculator.onrender.com/api/orders/${order._id}`, 
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
      await axios.patch(`https://billcalculator.onrender.com/api/orders/${order._id}`, 
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
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Order Details</h3>
        <p>Order ID: {updatedOrder._id}</p>
        <p>Customer: {updatedOrder.user ? updatedOrder.user.name : 'N/A'}</p>
        <p>Total: ${updatedOrder.total.toFixed(2)}</p>
        <p>Status: {updatedOrder.status}</p>
        <p>Paid: {updatedOrder.isPaid ? 'Yes' : 'No'}</p>
        <h4>Products:</h4>
        <ul className="product-list">
          {updatedOrder.items.map((item) => (
            <li key={item.product._id} className="product-item">
              <span>{item.product.name} - Quantity: {item.quantity} - ${(item.product.price * item.quantity).toFixed(2)}</span>
              {!item.isDone && (
                <button onClick={() => markProductAsDone(item.product._id)} className="btn btn-small">Mark as Done</button>
              )}
              {item.isDone && <span className="done-label">Done</span>}
            </li>
          ))}
        </ul>
        {updatedOrder.status !== 'Completed' && allProductsDone && (
          <button onClick={() => updateOrderStatus('Completed')} className="btn">Mark Order as Completed</button>
        )}
        {!updatedOrder.isPaid && (
          <button onClick={markAsPaid} className="btn">Mark as Paid</button>
        )}
        <button onClick={onClose} className="btn btn-secondary">Close</button>
      </div>
    </div>
  );
}

export default OrderDetails;