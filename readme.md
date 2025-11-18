<h1 align="center">🔐 Advanced Authentication System</h1>

<p align="center">
  A production-grade authentication system built with 
  <strong>Node.js, Express.js, MongoDB, JWT, OTP Email Verification, Multer, and Cloudinary</strong>.  
  Designed using enterprise-level security patterns including refresh token rotation, HttpOnly cookies, and OTP-based email verification.
</p>

---

## 🚀 Features

### 🔵 **1. Email OTP Verification (before registration)**
- User enters: **name, email, password, avatar**
- Data stored temporarily (TempUser model)
- 6-digit OTP sent via **Mailtrap SMTP**
- OTP hashed using bcrypt
- OTP expires in **5 minutes**
- Temp user auto-deleted in 10 mins (TTL Index)
- User is created **only after OTP verification**

---

### 🔐 **2. Secure Login System**
- Login with email + password
- Zod validation
- Password hashing using bcrypt
- Returns:
  - **Access Token (15 min)**
  - **Refresh Token (7 days)** → HttpOnly cookie
- Supports multi-device login via refresh token array

---

### 🌀 **3. Refresh Token Rotation**
- Old refresh token removed
- New refresh token generated & stored
- Detects refresh token reuse (security attack)
- If reuse detected → clears all user sessions

---

### 🚪 **4. Logout**
- Clears only the current session
- Removes refresh token from DB
- Clears HttpOnly cookie

---

### 🔒 **5. Auth Middleware**
- Verifies access token
- Blocks unauthorized users
- Injects user info into `req.user`

---

### 🛡 **6. Role-Based Access (Optional)**
- `isAdmin` middleware
- Restrict sensitive routes

---

### 🖼 **7. Avatar Upload with Cloudinary**
- Uses Multer (memory storage)
- Supports file types: JPG, JPEG, PNG
- Uploads directly to Cloudinary via `upload_stream`
- Stores only the secure image URL

---