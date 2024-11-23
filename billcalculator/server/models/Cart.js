import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      quantity: { type: Number, default: 1 },
    },
  ],
});

export default mongoose.model('Cart', cartSchema);