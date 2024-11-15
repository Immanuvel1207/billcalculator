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
      const response = await axios.get('http://localhost:5000/api/orders/user', {
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
    <div className="card">
      <h2>Your Order History</h2>
      {orders.length === 0 ? (
        <p>You haven't placed any orders yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {orders.map((order) => (
            <li key={order._id} style={{ marginBottom: '20px', borderBottom: '1px solid #eee', paddingBottom: '20px' }}>
              <div 
                onClick={() => toggleOrderDetails(order._id)} 
                style={{ cursor: 'pointer' }}
                role="button"
                tabIndex={0}
                onKeyPress={(e) => e.key === 'Enter' && toggleOrderDetails(order._id)}
                aria-expanded={selectedOrder === order._id}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: '5px 0' }}>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                    <p style={{ margin: '5px 0' }}>Time: {new Date(order.createdAt).toLocaleTimeString()}</p>
                  </div>
                  <div>
                    <p style={{ margin: '5px 0', fontWeight: 'bold' }}>Total: ${order.total.toFixed(2)}</p>
                    <p style={{ margin: '5px 0', color: order.status === 'Pending' ? 'orange' : 'green' }}>Status: {order.status}</p>
                  </div>
                </div>
              </div>
              {selectedOrder === order._id && (
                <div style={{ marginTop: '10px' }}>
                  <h4>Order Details:</h4>
                  <p>Order ID: {order._id}</p>
                  <p>Paid: {order.isPaid ? 'Yes' : 'No'}</p>
                  <h5>Products:</h5>
                  <ul style={{ paddingLeft: '20px' }}>
                    {order.items.map((item) => (
                      <li key={item._id}>
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