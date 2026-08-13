# Tenant Management Module

This is the Tenant Management System, built using the MERN stack (MongoDB, Express, React, Node.js). It features strict multi-tenant architecture where data is completely isolated by Organization.

## Tech Stack
* **Frontend:** React (Vite), React Router, Axios
* **Backend:** Node.js & Express.js
* **Database:** MongoDB & Mongoose
* **Authentication:** JSON Web Tokens (JWT) & Bcrypt
* **File Uploads:** Multer

## Setup & Installation

### 1. Backend Setup

**Navigate to the backend directory:**
```bash
cd backend
```

**Install dependencies:**
```bash
npm install
```

**Configure Environment Variables:**
Create a `.env` file in the `backend` directory and add the following:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
```

**Start the server:**
```bash
# Development mode with nodemon
npm run dev
```

### 2. Frontend Setup

**Open a new terminal and navigate to the frontend directory:**
```bash
cd frontend
```

**Install frontend dependencies:**
```bash
npm install
```

**Start the development server:**
```bash
npm run dev
```
The React application will now be running at `http://localhost:5173`.

## Technical Notes & Constraints Addressed
* **Organization-Based Access Control:** All protected routes extract the `organizationId` from the verified JWT and force it into the database queries. Users can never fetch or manipulate data outside their organization.
* **Tenancy Overlap Prevention:** The `/tenancies` POST route actively checks the database to prevent assigning a tenant to a unit that already has an `active` tenancy status. 

## API Reference

### Authentication
* `POST /auth/signup` - Registers a new user and creates their organization.
* `POST /auth/login` - Authenticates a user and returns a JWT.
* `GET /auth/me` - Returns the currently logged-in user's details.

### Properties
* `POST /properties` - Creates a new property.
* `GET /properties` - Fetches all properties for the user's organization.

### Units
* `POST /units` - Adds a unit to a property.
* `GET /units` - Fetches all units, populating property details.

### Tenants
* `POST /tenants` - Creates a new tenant.
* `GET /tenants` - Fetches all tenants for the organization.

### Tenancies
* `POST /tenancies` - Assigns a tenant to a unit (creates a lease).
* `GET /tenancies` - Fetches all tenancies.

### Dashboard & Uploads
* `GET /dashboard/summary` - Returns counts for properties, units, tenants, and active tenancies.
* `POST /upload` - Uploads a document (multipart/form-data) and returns the file path.