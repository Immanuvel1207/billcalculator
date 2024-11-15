import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderDetails from './OrderDetails';

function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://billcalculator.onrender.com/api/orders', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('https://billcalculator.onrender.com/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addProduct = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const newProduct = {
        name: e.target.name.value,
        price: parseFloat(e.target.price.value)
      };
      await axios.post('https://billcalculator.onrender.com/api/products', newProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      e.target.reset();
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`https://billcalculator.onrender.com/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const filteredOrders = orders
  .filter(order => 
    order.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order._id.includes(searchTerm)
  )
  .sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return 0; // If both are pending or both are not pending, keep their original order
  });


  return (
    <div className="card">
      <h2>Admin Panel</h2>
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
          style={{ marginRight: '10px' }}
        >
          Orders
        </button>
        <button 
          onClick={() => setActiveTab('products')} 
          className={`btn ${activeTab === 'products' ? 'btn-primary' : 'btn-secondary'}`}
        >
          Products
        </button>
      </div>

      {activeTab === 'orders' && (
        <div>
          <h3>Orders</h3>
          <input
            type="text"
            placeholder="Search orders by customer name or order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input"
            style={{ marginBottom: '20px' }}
          />
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Paid</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.user.name}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>{order.status}</td>
                    <td>{order.isPaid ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => setSelectedOrder(order)} className="btn">View Details</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {selectedOrder && (
            <OrderDetails 
              order={selectedOrder} 
              onClose={() => setSelectedOrder(null)}
              onUpdate={fetchOrders}
            />
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div>
          <h3>Products</h3>
          <form onSubmit={addProduct} style={{ marginBottom: '20px' }}>
            <input type="text" name="name" placeholder="Product Name" required className="input" style={{ marginRight: '10px' }} />
            <input type="number" name="price" placeholder="Price" step="0.01" required className="input" style={{ marginRight: '10px' }} />
            <button type="submit" className="btn">Add Product</button>
          </form>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {products.map((product) => (
              <li key={product._id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span>{product.name} - ${product.price.toFixed(2)}</span>
                <button onClick={() => deleteProduct(product._id)} className="btn btn-danger">Delete</button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;