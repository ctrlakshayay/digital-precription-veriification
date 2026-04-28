# Digital Prescription Verification and Medical Tracking System

Full-stack web app with **React + Tailwind**, **Node.js + Express**, and **MySQL**.

## Folder Structure

```text
.
├── backend
│   ├── package.json
│   └── src
│       ├── app.js
│       ├── server.js
│       ├── config/db.js
│       ├── controllers
│       ├── middlewares
│       ├── models
│       ├── routes
│       └── utils
├── frontend
│   ├── package.json
│   ├── index.html
│   ├── tailwind.config.js
│   └── src
│       ├── App.jsx
│       ├── api
│       ├── components
│       ├── context
│       ├── layouts
│       ├── pages
│       └── styles
└── database
    └── schema.sql
```

## Setup Instructions

### 1) Database setup

1. Create MySQL database and tables by running:
   ```bash
   mysql -u root -p < database/schema.sql
   ```

### 2) Backend setup

1. Move into backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment file:
   ```bash
   cp .env.example .env
   ```
4. Update `.env` with your MySQL credentials and JWT secret.
5. Run server:
   ```bash
   npm run dev
   ```

### 3) Frontend setup

1. Move into frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run app:
   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5173`, backend on `http://localhost:5000`.

## API Summary

- `POST /api/auth/register` - Register doctor/patient/pharmacy
- `POST /api/auth/login` - Login and receive JWT
- `POST /api/prescriptions` - Doctor creates prescription
- `GET /api/prescriptions/:prescriptionId` - Get by ID
- `PATCH /api/prescriptions/:prescriptionId/verify` - Pharmacy verifies prescription
- `GET /api/prescriptions/search?status=&patient_id=&doctor_id=` - Search/filter
- `GET /api/patients/history/:patientId?` - Patient history

## Notes

- MVC-based backend structure.
- JWT auth + role-based authorization.
- Date validation ensures `expiry_date >= issue_date`.
- Verification log keeps pharmacy audit trail.
- Trigger supports automatic expired status handling during updates.
