const router  = require('express').Router();
const Order   = require('../models/Order');
const Product = require('../models/Product');
const Coupon  = require('../models/Coupon');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// ─── POST /api/orders ─── สร้างคำสั่งซื้อ
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, couponCode } = req.body;
    // items = [{ productId, qty }]
    if (!items || items.length === 0)
      return res.status(400).json({ message: 'ไม่มีสินค้าในตะกร้า' });

    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product || !product.active)
        return res.status(400).json({ message: `ไม่พบสินค้า` });
      if (product.stock < item.qty)
        return res.status(400).json({ message: `สินค้า ${product.name} ไม่เพียงพอ` });

      product.stock -= item.qty;
      await product.save();

      subtotal += product.price * item.qty;
      orderItems.push({ product: product._id, name: product.name, emoji: product.emoji, price: product.price, qty: item.qty });
    }

    // คำนวณส่วนลด
    let discount = 0;
    let couponUsed = null;
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
      if (coupon) {
        discount = coupon.type === 'percent'
          ? Math.round(subtotal * coupon.value / 100)
          : coupon.value;
        coupon.used += 1;
        await coupon.save();
        couponUsed = coupon.code;
      }
    }

    const total = Math.max(0, subtotal - discount);
    const order = await Order.create({
      user: req.user.id,
      username: req.user.username,
      items: orderItems,
      subtotal, discount, total,
      coupon: couponUsed,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/orders/my ─── ดูคำสั่งซื้อของตัวเอง
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/orders ─── ดูทุกคำสั่งซื้อ (Admin)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'username firstname lastname');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUT /api/orders/:id/status ─── เปลี่ยนสถานะ (Admin)
router.put('/:id/status', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!order) return res.status(404).json({ message: 'ไม่พบคำสั่งซื้อ' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
