const router  = require('express').Router();
const User    = require('../models/User');
const Order   = require('../models/Order');
const Coupon  = require('../models/Coupon');
const { authMiddleware, adminOnly } = require('../middleware/auth');

const guard = [authMiddleware, adminOnly];

// ─── GET /api/admin/dashboard ─── สถิติรวม
router.get('/dashboard', ...guard, async (req, res) => {
  try {
    const [users, orders, coupons] = await Promise.all([
      User.countDocuments(),
      Order.find(),
      Coupon.countDocuments(),
    ]);
    const revenue = orders.reduce((s, o) => s + o.total, 0);
    res.json({ users, orders: orders.length, revenue, coupons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/admin/users ─── รายชื่อผู้ใช้ทั้งหมด
router.get('/users', ...guard, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUT /api/admin/users/:id/role ─── เปลี่ยนบทบาท
router.put('/users/:id/role', ...guard, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'ไม่พบผู้ใช้' });
    user.role = user.role === 'admin' ? 'user' : 'admin';
    await user.save();
    res.json({ message: `เปลี่ยนเป็น ${user.role}`, role: user.role });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── DELETE /api/admin/users/:id ─── ลบผู้ใช้
router.delete('/users/:id', ...guard, async (req, res) => {
  try {
    if (req.params.id === req.user.id)
      return res.status(400).json({ message: 'ไม่สามารถลบบัญชีตัวเองได้' });
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบผู้ใช้เรียบร้อย' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/admin/coupons ─── รายการโค้ด
router.get('/coupons', ...guard, async (req, res) => {
  try {
    res.json(await Coupon.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/admin/coupons ─── เพิ่มโค้ด
router.post('/coupons', ...guard, async (req, res) => {
  try {
    const coupon = await Coupon.create(req.body);
    res.status(201).json(coupon);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── DELETE /api/admin/coupons/:id ─── ลบโค้ด
router.delete('/coupons/:id', ...guard, async (req, res) => {
  try {
    await Coupon.findByIdAndDelete(req.params.id);
    res.json({ message: 'ลบโค้ดเรียบร้อย' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
