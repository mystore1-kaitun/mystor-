const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product:  { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  name:     String,
  emoji:    String,
  price:    Number,
  qty:      Number,
});

const orderSchema = new mongoose.Schema({
  user:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  username: String,
  items:    [orderItemSchema],
  subtotal: Number,
  discount: { type: Number, default: 0 },
  total:    Number,
  coupon:   { type: String, default: null },
  status:   { type: String, enum: ['processing', 'shipped', 'delivered'], default: 'processing' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
