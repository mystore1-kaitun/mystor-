const router = require('express').Router();
const jwt    = require('jsonwebtoken');
const User   = require('../models/User');

// ─── POST /api/auth/register ───────────────────
router.post('/register', async (req, res) => {
  try {
    const { username, password, firstname, lastname, email } = req.body;
    if (!username || !password || !firstname || !lastname || !email)
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });
    if (password.length < 6)
      return res.status(400).json({ message: 'รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร' });

    const exists = await User.findOne({ $or: [{ username }, { email }] });
    if (exists) return res.status(409).json({ message: 'ชื่อผู้ใช้หรืออีเมลนี้ถูกใช้แล้ว' });

    // ให้สิทธิ์ admin เฉพาะ username+password ตรงกับ env
    const isAdmin = username === process.env.ADMIN_USERNAME &&
                    password  === process.env.ADMIN_PASSWORD;
    const user = await User.create({ username, password, firstname, lastname, email, role: isAdmin ? 'admin' : 'user' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.status(201).json({ token, user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── POST /api/auth/login ──────────────────────
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบ' });

    const user = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password)))
      return res.status(401).json({ message: 'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง' });

    const token = jwt.sign(
      { id: user._id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── GET /api/auth/me ─────────────────────────
const { authMiddleware } = require('../middleware/auth');
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── PUT /api/auth/me ─────────────────────────
router.put('/me', authMiddleware, async (req, res) => {
  try {
    const { firstname, lastname, email, password } = req.body;
    const user = await User.findById(req.user.id);
    if (firstname) user.firstname = firstname;
    if (lastname)  user.lastname  = lastname;
    if (email)     user.email     = email;
    if (password && password.length >= 6) user.password = password;
    await user.save();
    res.json(safeUser(user));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

function safeUser(u) {
  return { id: u._id, username: u.username, firstname: u.firstname, lastname: u.lastname, email: u.email, role: u.role };
}

module.exports = router;
