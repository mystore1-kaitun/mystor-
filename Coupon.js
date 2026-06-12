const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
  code:  { type: String, required: true, unique: true, uppercase: true },
  type:  { type: String, enum: ['percent', 'fixed'], required: true },
  value: { type: Number, required: true, min: 0 },
  used:  { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Coupon', couponSchema);
