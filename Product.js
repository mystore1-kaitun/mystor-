const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  emoji:    { type: String, default: '🛍️' },
  price:    { type: Number, required: true, min: 0 },
  stock:    { type: Number, required: true, min: 0, default: 0 },
  category: { type: String, required: true },
  desc:     { type: String, default: '' },
  active:   { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
