# 🛍️ ShopZone — ร้านค้าออนไลน์

ระบบร้านค้าออนไลน์ครบวงจร Node.js + Express + MongoDB

---

## 📁 โครงสร้างโปรเจกต์

```
shopzone/
├── server.js              ← จุดเริ่มต้น server
├── package.json
├── .env.example           ← template ค่า environment
├── .gitignore
├── models/
│   ├── User.js            ← schema ผู้ใช้
│   ├── Product.js         ← schema สินค้า
│   ├── Order.js           ← schema คำสั่งซื้อ
│   └── Coupon.js          ← schema โค้ดส่วนลด
├── middleware/
│   └── auth.js            ← JWT middleware
├── routes/
│   ├── auth.js            ← /api/auth/*
│   ├── products.js        ← /api/products/*
│   ├── orders.js          ← /api/orders/*
│   └── admin.js           ← /api/admin/*
└── public/
    └── index.html         ← Frontend (HTML/CSS/JS)
```

---

## 🚀 วิธีติดตั้งและรัน

### ขั้นตอนที่ 1 — สมัคร MongoDB Atlas (ฟรี)

1. ไปที่ [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. กด **"Try Free"** → สมัครบัญชี
3. สร้าง Cluster → เลือก **Free (M0)**
4. ตั้ง **Username & Password** สำหรับ database
5. ไปที่ **Network Access** → Add IP → **"Allow Access from Anywhere"** (`0.0.0.0/0`)
6. ไปที่ **Database** → กด **"Connect"** → **"Drivers"**
7. คัดลอก connection string เช่น:
   ```
   mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/shopzone
   ```

---

### ขั้นตอนที่ 2 — ตั้งค่า Environment

```bash
# คัดลอก template
cp .env.example .env

# แก้ไขไฟล์ .env
```

แก้ไขไฟล์ `.env`:
```env
MONGODB_URI=mongodb+srv://myuser:mypassword@cluster0.xxxxx.mongodb.net/shopzone
JWT_SECRET=mysupersecretkey12345678
PORT=3000
ADMIN_USERNAME=Tt1
ADMIN_PASSWORD=rt12@
```

---

### ขั้นตอนที่ 3 — ติดตั้งและรัน

```bash
# ติดตั้ง dependencies
npm install

# รันแบบ development (auto-restart)
npm run dev

# หรือรันปกติ
npm start
```

เปิดเบราว์เซอร์ที่ → **http://localhost:3000**

---

## ☁️ Deploy ขึ้น Railway (ฟรี)

### ขั้นตอนที่ 1 — Push ขึ้น GitHub

```bash
git init
git add .
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/USERNAME/shopzone.git
git push -u origin main
```

### ขั้นตอนที่ 2 — Deploy บน Railway

1. ไปที่ [railway.app](https://railway.app) → Login ด้วย GitHub
2. กด **"New Project"** → **"Deploy from GitHub repo"**
3. เลือก repo `shopzone`
4. Railway จะ detect Node.js อัตโนมัติ
5. ไปที่ **Variables** → เพิ่ม environment variables:

| Key | Value |
|-----|-------|
| `MONGODB_URI` | connection string จาก Atlas |
| `JWT_SECRET` | random string ยาวๆ |
| `ADMIN_USERNAME` | `Tt1` |
| `ADMIN_PASSWORD` | `rt12@` |
| `PORT` | `3000` |

6. กด **Deploy** → รอ 2-3 นาที
7. ได้ URL เช่น `https://shopzone-production.up.railway.app`

---

## 🔑 Admin Credentials

| | ค่า |
|--|--|
| **Username** | `Tt1` |
| **Password** | `rt12@` |

---

## 📡 API Endpoints

### Auth
| Method | URL | คำอธิบาย |
|--------|-----|---------|
| POST | `/api/auth/register` | สมัครสมาชิก |
| POST | `/api/auth/login` | เข้าสู่ระบบ |
| GET  | `/api/auth/me` | ดูข้อมูลตัวเอง |
| PUT  | `/api/auth/me` | แก้ไขข้อมูล |

### Products
| Method | URL | คำอธิบาย |
|--------|-----|---------|
| GET    | `/api/products` | ดูสินค้าทั้งหมด |
| GET    | `/api/products/:id` | ดูสินค้าตัวเดียว |
| POST   | `/api/products` | เพิ่มสินค้า (Admin) |
| PUT    | `/api/products/:id` | แก้ไขสินค้า (Admin) |
| DELETE | `/api/products/:id` | ลบสินค้า (Admin) |

### Orders
| Method | URL | คำอธิบาย |
|--------|-----|---------|
| POST | `/api/orders` | สร้างคำสั่งซื้อ |
| GET  | `/api/orders/my` | คำสั่งซื้อของตัวเอง |
| GET  | `/api/orders` | ทุกคำสั่งซื้อ (Admin) |
| PUT  | `/api/orders/:id/status` | เปลี่ยนสถานะ (Admin) |

### Admin
| Method | URL | คำอธิบาย |
|--------|-----|---------|
| GET    | `/api/admin/dashboard` | สถิติรวม |
| GET    | `/api/admin/users` | รายชื่อผู้ใช้ |
| PUT    | `/api/admin/users/:id/role` | เปลี่ยนบทบาท |
| DELETE | `/api/admin/users/:id` | ลบผู้ใช้ |
| GET    | `/api/admin/coupons` | รายการโค้ด |
| POST   | `/api/admin/coupons` | เพิ่มโค้ด |
| DELETE | `/api/admin/coupons/:id` | ลบโค้ด |

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB + Mongoose
- **Auth:** JWT (JSON Web Token) + bcryptjs
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Deploy:** Railway + MongoDB Atlas
