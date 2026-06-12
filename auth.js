const jwt = require('jsonwebtoken');

// ตรวจสอบ JWT Token
function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'กรุณาเข้าสู่ระบบก่อน' });
  }
  const token = header.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, username, role }
    next();
  } catch {
    return res.status(401).json({ message: 'Token ไม่ถูกต้องหรือหมดอายุ' });
  }
}

// ตรวจสอบว่าเป็น Admin
function adminOnly(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'สิทธิ์ไม่เพียงพอ (Admin เท่านั้น)' });
  }
  next();
}

module.exports = { authMiddleware, adminOnly };
