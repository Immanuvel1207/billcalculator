const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { items, total } = req.body;
    const order = new Order({
      user: req.user.userId,
      items,
      total,
    });
    await order.save();
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const orders = req.user.isAdmin
      ? await Order.find().populate('user', 'name').populate('items.product')
      : await Order.find({ user: req.user.userId }).populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.userId })
      .populate('user', 'name')
      .populate('items.product');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const { status, isPaid } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status, isPaid },
      { new: true }
    ).populate('user', 'name');
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch('/:id/product/:productId', auth, async (req, res) => {
  try {
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    const item = order.items.find(item => item.product.toString() === req.params.productId);
    if (!item) {
      return res.status(404).json({ message: 'Product not found in order' });
    }
    item.isDone = req.body.isDone;
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;