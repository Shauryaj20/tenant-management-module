# Multi-Tenant Property & Tenant Management Module

A full-stack multi-tenant property management application built using the MERN stack (MongoDB, Express, React, Node.js). This module features organization-based access control (tenant isolation), JWT authentication, file uploads, dynamic dashboard metrics, and relational data management across properties, units, tenants, and tenancies.

---

## 🛠️ Tech Stack

* **Frontend:** React.js (Vite), Axios, React Router DOM, CSS / Tailwind
* **Backend:** Node.js, Express.js, Multer (File Uploads)
* **Database:** MongoDB, Mongoose (ODM)
* **Authentication:** JSON Web Tokens (JWT), Bcrypt.js

---

## ⚙️ Environment Variables

### Backend Environment Variables (`backend/.env`)
Create a `.env` file inside the `backend/` folder:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/tenant_management
JWT_SECRET=jwt_key_here
