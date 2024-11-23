import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OrderDetails from './OrderDetails';

function AdminPanel() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/orders', {
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

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/products', {
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
        price: parseFloat(e.target.price.value),
        description: e.target.description.value,
        imageUrl: e.target.imageUrl.value
      };
      await axios.post('http://localhost:5000/api/products', newProduct, {
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
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const startEditing = (product) => {
    setEditingProduct({ ...product });
  };

  const cancelEditing = () => {
    setEditingProduct(null);
  };

  const saveProductChanges = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/products/${editingProduct._id}`, editingProduct, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleEditChange = (e) => {
    setEditingProduct({
      ...editingProduct,
      [e.target.name]: e.target.name === 'price' ? parseFloat(e.target.value) : e.target.value
    });
  };

  const filteredOrders = orders.filter(order => 
    (order.user && order.user.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
    order._id.includes(searchTerm)
  );

  return (
    <div className="admin-panel">
      <h2>Admin Panel</h2>
      <div className="tab-buttons">
        <button 
          onClick={() => setActiveTab('orders')} 
          className={`btn ${activeTab === 'orders' ? 'btn-primary' : 'btn-secondary'}`}
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
        <div className="orders-section">
          <h3>Orders</h3>
          <input
            type="text"
            placeholder="Search orders by customer name or order ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input search-input"
          />
          <div className="order-list">
            <table>
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
                  <tr key={order._id} className={order.status === 'Pending' ? 'pending-order' : ''}>
                    <td>{order._id}</td>
                    <td>{order.user ? order.user.name : 'N/A'}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                    <td>{order.status}</td>
                    <td>{order.isPaid ? 'Yes' : 'No'}</td>
                    <td>
                      <button onClick={() => setSelectedOrder(order)} className="btn btn-small">View Details</button>
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
        <div className="products-section">
          <h3>Products</h3>
          <form onSubmit={addProduct} className="add-product-form">
            <input type="text" name="name" placeholder="Product Name" required className="input" />
            <input type="number" name="price" placeholder="Price" step="0.01" required className="input" />
            <input type="text" name="description" placeholder="Description" required className="input" />
            <input type="text" name="imageUrl" placeholder="Image URL" required className="input" />
            <button type="submit" className="btn">Add Product</button>
          </form>
          <div className="product-list">
            {products.map((product) => (
              <div key={product._id} className="product-item">
                <img src={product.imageUrl} alt={product.name} className="product-image" />
                {editingProduct && editingProduct._id === product._id ? (
                  <div className="product-edit-form">
                    <input
                      type="text"
                      name="name"
                      value={editingProduct.name}
                      onChange={handleEditChange}
                      className="input"
                    />
                    <input
                      type="number"
                      name="price"
                      value={editingProduct.price}
                      onChange={handleEditChange}
                      step="0.01"
                      className="input"
                    />
                    <textarea
                      name="description"
                      value={editingProduct.description}
                      onChange={handleEditChange}
                      className="input"
                    />
                    <button onClick={saveProductChanges} className="btn btn-primary">Save</button>
                    <button onClick={cancelEditing} className="btn btn-secondary">Cancel</button>
                  </div>
                ) : (
                  <div className="product-details">
                    <h4>{product.name}</h4>
                    <p>${product.price.toFixed(2)}</p>
                    <p>{product.description}</p>
                    <button onClick={() => startEditing(product)} className="btn btn-primary">Edit</button>
                    <button onClick={() => deleteProduct(product._id)} className="btn btn-danger">Delete</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;