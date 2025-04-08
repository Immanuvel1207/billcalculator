import React, { useState, useEffect } from 'react';
import axios from 'axios';

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found, user might not be logged in');
        return;
      }
      const response = await axios.get('https://billcalculator-seven.vercel.app/api/orders/user', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const sortedOrders = response.data.sort((a, b) => {
        if (a.status === 'Pending' && b.status !== 'Pending') return -1;
        if (a.status !== 'Pending' && b.status === 'Pending') return 1;
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const toggleOrderDetails = (orderId) => {
    setSelectedOrder(selectedOrder === orderId ? null : orderId);
  };

  return (
    <div className="order-history card">
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <ul className="order-list">
          {orders.map((order) => (
            <li key={order._id} className="order-item">
              <div 
                className="order-summary"
                onClick={() => toggleOrderDetails(order._id)}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && toggleOrderDetails(order._id)}
              >
                <div className="order-info">
                  <p>Order ID: {order._id}</p>
                  <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                  <p>Time: {new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                <div className="order-status">
                  <p className="order-total">Total: ${order.total.toFixed(2)}</p>
                  <p className={`order-status-${order.status.toLowerCase()}`}>Status: {order.status}</p>
                </div>
              </div>
              {selectedOrder === order._id && (
                <div className="order-details">
                  <h4>Order Details:</h4>
                  <p>Paid: {order.isPaid ? 'Yes' : 'No'}</p>
                  <h5>Products:</h5>
                  <ul className="product-list">
                    {order.items.map((item) => (
                      <li key={item._id} className="product-item">
                        {item.product.name} - Quantity: {item.quantity} - ${(item.product.price * item.quantity).toFixed(2)}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default OrderHistory;