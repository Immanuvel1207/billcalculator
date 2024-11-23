const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product.js');

dotenv.config();

const sampleProducts = [
  { name: "Apples", price: 1.99 },
  { name: "Bananas", price: 0.99 },
  { name: "Milk (1 gallon)", price: 3.49 },
  { name: "Bread", price: 2.49 },
  { name: "Eggs (dozen)", price: 3.99 },
  { name: "Chicken Breast (1 lb)", price: 5.99 },
  { name: "Pasta (1 lb)", price: 1.49 },
  { name: "Tomato Sauce", price: 1.99 },
  { name: "Cheese (8 oz)", price: 3.99 },
  { name: "Yogurt (32 oz)", price: 4.49 },
  { name: "Cereal", price: 3.99 },
  { name: "Orange Juice (64 oz)", price: 3.99 },
  { name: "Potato Chips", price: 2.99 },
  { name: "Ground Beef (1 lb)", price: 4.99 },
  { name: "Carrots (1 lb)", price: 1.49 },
];

async function addSampleProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    for (const product of sampleProducts) {
      const newProduct = new Product(product);
      await newProduct.save();
      console.log(`Added product: ₹{product.name}`);
    }

    console.log('All sample products have been added to the database');
  } catch (error) {
    console.error('Error adding sample products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('Database connection closed');
  }
}

addSampleProducts();