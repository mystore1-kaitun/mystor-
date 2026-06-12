const router  = require('express').Router();
const Product = require('../models/Product');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// ─── GET /api/products ─── ดึงสินค้าทั้งหมด (ต้อง login)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { category, search, sort } = req.query;
    let query = { active: true };
    if (category) query.category = category;
    if (search)   query.name = { $regex: search, $options: 'i' };

    let sortObj = {};
    if (sort === 'price-asc')  sortObj.price = 1;
    if (sort === 'price-desc') sortObj.price = -1;
    if (sort === 'name')       sortObj.name  = 1;

    const products = await Product.find(query).sort(sortObj);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/products/:id ─── ดูสินค้าตัวเดียว
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'ไม่พบสินค้า' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/products ─── เพิ่มสินค้า (Admin)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── PUT /api/products/:id ─── แก้ไขสินค้า (Admin)
router.put('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return res.status(404).json({ message: 'ไม่พบสินค้า' });
    res.json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ─── DELETE /api/products/:id ─── ลบสินค้า (Admin)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ message: 'ลบสินค้าเรียบร้อย' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
