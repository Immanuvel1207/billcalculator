import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ProductList() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://billcalculator.onrender.com/api/products');
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const addToCart = (product) => {
    const updatedCart = [...cart];
    const existingItem = updatedCart.find(item => item.product._id === product._id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      updatedCart.push({ product, quantity: 1 });
    }
    setCart(updatedCart);
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const goToCart = () => {
    navigate('/cart');
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2>Products</h2>
      <input
        type="text"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', padding: '5px', width: '100%' }}
      />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredProducts.map((product) => (
          <li key={product._id} style={{ marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>{product.name} - ${product.price.toFixed(2)}</span>
            <button onClick={() => addToCart(product)} style={{ padding: '5px 10px' }}>Add to Cart</button>
          </li>
        ))}
      </ul>
      <button onClick={goToCart} style={{ marginTop: '20px', padding: '10px 20px' }}>Go to Cart</button>
    </div>
  );
}

export default ProductList;