# HotelPro – Full-Stack Hotel Management & Reservation System

[![Node.js](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-v18.3-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-v5.2-purple.svg)](https://vitejs.dev/)
[![MongoDB](https://img.shields.io/badge/MongoDB-v8.3-brightgreen.svg)](https://www.mongodb.com/)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-v5.3-violet.svg)](https://getbootstrap.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**HotelPro** is an enterprise-grade, luxury-inspired full-stack Hotel Management & Reservation System built on the MERN stack (MongoDB, Express, React, Node.js). It provides a complete end-to-end hospitality platform featuring multi-property hotel operations, date-overlap availability search, multi-step booking pipelines, server-verified Razorpay payments (plus a dedicated sandbox test-mode gateway), print-ready tax invoices, verified stay reviews, front-desk arrival/departure processing, automated housekeeping dispatch, and Recharts executive analytics.

---

## Table of Contents

1. [Architecture & Technology Stack](#1-technology-stack)
2. [Project Structure](#2-project-structure)
3. [Prerequisites & System Requirements](#3-prerequisites)
4. [Environment Configuration](#4-environment-configuration)
5. [Installation & Quick Start](#5-quick-start)
6. [Database Seeding & Safe Demo Accounts](#6-demo-accounts)
7. [Core Workflows & Business Logic](#7-core-workflows)
   - [Room Search & Date-Overlap Availability](#room-search--overlap-rule)
   - [Booking & Payment Processing (Razorpay + Test Mode)](#booking--payment)
   - [Front Desk Check-In & Housekeeping Turnover](#front-desk-operations)
   - [Cancellation & Eligible Refund Policies](#cancellation--refunds)
8. [Automated Testing Suite](#8-automated-testing)
9. [REST API Reference & Postman Guide](#9-api-reference)
10. [Production Deployment Guidelines](#10-production-deployment)

---

## 1. Technology Stack

### Frontend
- **Framework**: React.js 18 with Vite
- **Styling**: Bootstrap 5 + Custom Luxury Gold & Charcoal Design System (`index.css`)
- **Routing**: React Router DOM v6 with role-based `ProtectedRoute` guards
- **HTTP Client**: Axios with interceptors for automatic JWT attachment and error handling
- **Data Visualizations**: Recharts for monthly revenue bar charts and booking distribution pie charts
- **Icons**: Lucide React
- **Notifications**: React Toastify for real-time user feedback

### Backend
- **Runtime**: Node.js v18+ (tested on v24)
- **Web Framework**: Express.js with modular routers and controllers
- **Database & ODM**: MongoDB with Mongoose (indexes, references, compound queries)
- **Authentication**: JSON Web Tokens (JWT) & bcryptjs password hashing (salt factor 10)
- **Security**: Helmet HTTP headers, CORS whitelisting, Express Rate Limit on sensitive endpoints
- **Validation**: express-validator middleware with standardized JSON error formatting
- **File Uploads**: Multer configured for image formats (JPEG, PNG, WebP) with 5MB limits
- **Email Dispatch**: Nodemailer with graceful fallback logging when SMTP is unconfigured

### Payment Integration
- **Gateway**: Razorpay SDK integration for India (UPI, Cards, NetBanking, Wallets)
- **Verification**: Cryptographic HMAC SHA256 server-side signature verification
- **Sandbox Mode**: Embedded test-mode gateway enabling immediate zero-friction developer and tester validation without fake successes

---

## 2. Project Structure

```
HotelPro/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection logic
│   ├── controllers/
│   │   ├── adminController.js    # Executive analytics, user management, audit logs
│   │   ├── authController.js     # Register, login, profile, password reset
│   │   ├── bookingController.js  # Booking creation, cancellations, check-in/out
│   │   ├── categoryController.js # Room categories CRUD
│   │   ├── hotelController.js    # Hotel properties CRUD & policies
│   │   ├── housekeepingController.js # Task dispatch, turnover status
│   │   ├── notificationController.js # In-app notification center
│   │   ├── paymentController.js  # Razorpay orders, verification, test mode
│   │   ├── reviewController.js   # Verified stay guest reviews
│   │   ├── roomController.js     # Room search, availability, status updates
│   │   └── serviceController.js  # In-suite dining, spa, chauffeur requests
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role authorization (guest, staff, admin)
│   │   ├── errorHandler.js       # Centralized error handler
│   │   ├── upload.js             # Multer disk storage and image filters
│   │   └── validator.js          # express-validator result handler
│   ├── models/                   # 12 Mongoose Models
│   │   ├── AuditLog.js
│   │   ├── Booking.js
│   │   ├── Hotel.js
│   │   ├── HousekeepingTask.js
│   │   ├── Notification.js
│   │   ├── Payment.js
│   │   ├── Review.js
│   │   ├── Room.js
│   │   ├── RoomCategory.js
│   │   ├── Service.js
│   │   ├── ServiceRequest.js
│   │   └── User.js
│   ├── routes/                   # Express REST Routers
│   ├── services/
│   │   ├── auditService.js       # Audit logger
│   │   ├── bookingService.js     # Overlap availability check & price calculator
│   │   ├── emailService.js       # Nodemailer HTML templates
│   │   └── paymentService.js     # Razorpay order & signature verifier
│   ├── tests/
│   │   └── api.test.js           # 13 automated Jest & Supertest suites
│   ├── uploads/                  # Local media directory
│   ├── utils/
│   │   └── seed.js               # Database seeder
│   ├── .env.example
│   ├── index.js                  # Express server entry point
│   └── package.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx        # Responsive navigation & notification dropdown
│   │   │   ├── ProtectedRoute.jsx# Role-aware route guard
│   │   │   └── RoomCard.jsx      # Luxury room card with amenities chips
│   │   ├── context/
│   │   │   ├── AuthContext.jsx   # Global auth state & persistent login
│   │   │   └── NotificationContext.jsx # Real-time unread notifications
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx # Role-specific sidebar navigation
│   │   ├── pages/
│   │   │   ├── admin/            # Executive analytics & management screens
│   │   │   ├── auth/             # Login (with quick-fill demo buttons), Register, Reset
│   │   │   ├── guest/            # Guest dashboard, bookings, invoices, reviews
│   │   │   ├── staff/            # Arrivals, Departures, Room Status Grid, Housekeeping
│   │   │   ├── AboutUs.jsx
│   │   │   ├── BookingConfirmation.jsx
│   │   │   ├── BookingPolicies.jsx
│   │   │   ├── BrowseRooms.jsx   # Multi-filter search interface
│   │   │   ├── ContactUs.jsx
│   │   │   ├── Home.jsx          # Luxury hero, search widget, testimonials
│   │   │   ├── InvoicePage.jsx   # Print-ready tax invoice
│   │   │   ├── NotFound.jsx
│   │   │   ├── PaymentPage.jsx   # Dual Razorpay & Sandbox checkout
│   │   │   ├── RoomDetails.jsx   # Photo gallery, real-time availability, booking widget
│   │   │   ├── Services.jsx
│   │   │   └── Unauthorized.jsx
│   │   ├── services/
│   │   │   └── api.js            # Axios client with interceptors
│   │   ├── App.jsx               # Routes definition
│   │   ├── index.css             # Luxury hospitality stylesheet
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js            # Vite configuration with proxy to backend
├── .gitignore
└── README.md
```

---

## 3. Prerequisites

Ensure you have the following installed on your machine:
- **Node.js**: v18.0.0 or higher (`node -v`)
- **npm**: v9.0.0 or higher (`npm -v`)
- **MongoDB**: Community Server v6.0+ or MongoDB Atlas connection string (`mongod --version`)

---

## 4. Environment Configuration

### Backend Configuration (`backend/.env`)

Create `backend/.env` (or copy from `backend/.env.example`):

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://127.0.0.1:27017/hotelpro
JWT_SECRET=hotelpro_super_secure_jwt_secret_key_2026_xyz
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Optional SMTP Settings (Logs to console if empty)
EMAIL_HOST=
EMAIL_PORT=587
EMAIL_USER=
EMAIL_PASS=
EMAIL_FROM=no-reply@hotelpro.com

# Razorpay Keys (Leave placeholder for Sandbox Test Mode)
RAZORPAY_KEY_ID=rzp_test_placeholder
RAZORPAY_KEY_SECRET=placeholder_secret_key
RAZORPAY_WEBHOOK_SECRET=
UPLOAD_STORAGE_MODE=local
```

### Frontend Configuration (`frontend/.env`)

Create `frontend/.env` (or copy from `frontend/.env.example`):

```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_placeholder
```

---

## 5. Quick Start (Run Locally)

Open two terminal sessions (one for Backend, one for Frontend):

### Step 1: Start MongoDB
Ensure MongoDB service is running:
```powershell
# Windows
mongod --dbpath "C:\data\db" --bind_ip 127.0.0.1

# Linux / macOS
sudo systemctl start mongod
```

### Step 2: Backend Setup & Server Start
```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Run the database seeder to populate demo properties and accounts
npm run seed

# Start development backend server (runs on port 5000)
npm run dev
# Or production start:
# npm start
```

Backend will verify connection:
```
[Database] MongoDB Connected: 127.0.0.1
[HotelPro API] Server running in development mode on port 5000
```

### Step 3: Frontend Setup & Dev Server Start
```bash
# Navigate to frontend directory
cd ../frontend

# Install dependencies
npm install

# Start Vite development server (runs on port 5173)
npm run dev
```

Visit **`http://localhost:5173`** in your browser.

---

## 6. Database Seeding & Safe Demo Accounts

To reset or seed the database with flagship luxury hotels, suites, and safe credentials:

```bash
cd backend
node utils/seed.js
```

### Safe Pre-Configured Demo Accounts

| Role | Email | Password | Access Level |
|---|---|---|---|
| **Administrator** | `admin@hotelpro.com` | `Admin@123` | Executive analytics, hotel/room creation, user management, audit logs |
| **Front Desk / Staff** | `staff@hotelpro.com` | `Staff@123` | Today's arrivals/departures, check-in/out, room status grid, housekeeping tasks |
| **Guest** | `guest@hotelpro.com` | `Guest@123` | Suite reservations, payments, invoices, review submission, in-suite service requests |

> **Pro Tip**: On the `/login` page, you will find one-click **"Guest Demo"**, **"Staff Demo"**, and **"Admin Demo"** quick-fill buttons for instant testing.

---

## 7. Core Workflows & Business Logic

### Room Search & Overlap Rule
HotelPro implements strict mathematical date-overlap validation on the backend to guarantee zero double bookings:

$$\text{existing.checkIn} < \text{requested.checkOut} \quad \text{AND} \quad \text{existing.checkOut} > \text{requested.checkIn}$$

- Filters out cancelled bookings.
- Automatically releases pending bookings that were abandoned after 15 minutes.
- Re-checks room availability atomically when creating the reservation and again immediately before capturing payment.

### Booking & Payment
1. **Selection**: Guest picks room, check-in, check-out dates, and number of guests.
2. **Pricing Engine**:
   - Calculates duration in nights: $N = \max(1, \Delta \text{days})$
   - Subtotal: $S = N \times P \times (1 - \text{discount}\%)$
   - 12% Goods & Services Tax (GST): $T = \text{round}(S \times 0.12)$
   - Total Amount: $S + T$
3. **Pending Reservation**: Creates booking with status `pending`, generates reference `#HP-XXXXXX`.
4. **Checkout**:
   - **Razorpay Live/Test**: Uses standard Razorpay modal when keys are supplied.
   - **Sandbox Simulator**: One-click test payment gateway for testing with zero credentials required.
5. **Confirmation**: Transitions booking status to `confirmed` and payment status to `paid`, logs audit entry, triggers in-app notification, and dispatches confirmation email.

### Front Desk Operations
- **Arrivals**: Staff reviews today's expected guests and processes check-in. Room operational status becomes `occupied`.
- **Departures**: Staff processes check-out. Booking status becomes `checked_out`, room operational status is set to `cleaning`, and an automated **Housekeeping Task** is created with turnover priority.
- **Housekeeping**: Housekeeping staff starts cleaning (`in_progress`) and upon completion marks the task `completed`, automatically returning the room operational status to `available`.

### Cancellation & Refunds
- **Free Cancellation**: Up to 48 hours prior to check-in date $\rightarrow$ **100% full refund** calculated and recorded.
- **Within 48 Hours**: 50% partial refund applies according to policy.
- Releases room availability immediately for other guests.

---

## 8. Automated Testing Suite

HotelPro includes 13 automated backend tests using **Jest** and **Supertest** covering authentication, invalid credentials, protected route authorization (403 for unauthorized roles), room search, availability calculations, double-booking rejection, payment simulation, and booking ownership privacy.

Run the test suite:
```bash
cd backend
npm test
```

Expected output:
```
PASS tests/api.test.js
  HotelPro Backend API Suite
    √ GET /api/health should return status online
    √ POST /api/auth/login should authenticate valid guest credentials
    √ POST /api/auth/login should reject incorrect password
    √ POST /api/auth/login should authenticate admin and provide role admin
    √ GET /api/admin/dashboard should reject guest token with 403 Forbidden
    √ GET /api/admin/dashboard should allow admin token with 200 OK
    √ GET /api/rooms should return list of active rooms
    √ GET /api/rooms/:id should return room details and review summary
    √ GET /api/rooms/:id/availability with valid future dates
    √ POST /api/bookings should create a pending booking with calculated taxes and nights
    √ POST /api/bookings should reject overlapping dates for same room
    √ POST /api/payments/test-payment should confirm reservation and mark payment as captured
    √ GET /api/bookings/:id should deny access to unauthorized guest

Test Suites: 1 passed, 1 total
Tests:       13 passed, 13 total
```

---

## 9. API Reference & Postman Guide

### Base URL: `http://localhost:5000/api`

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/health` | Public | System status and uptime |
| `POST` | `/auth/register` | Public | Register new guest account |
| `POST` | `/auth/login` | Public | Login with email and password |
| `GET` | `/auth/me` | Private | Current authenticated user profile |
| `PUT` | `/auth/profile` | Private | Update name, phone, or profile image |
| `POST` | `/auth/forgot-password` | Public | Request password reset token |
| `GET` | `/hotels` | Public | List all active hotel destinations |
| `POST` | `/hotels` | Admin | Create new hotel property |
| `GET` | `/categories` | Public | List room categories |
| `GET` | `/rooms` | Public | Search rooms with city, dates, capacity, price filters |
| `GET` | `/rooms/:id` | Public | Room details, amenities, and verified reviews |
| `GET` | `/rooms/:id/availability` | Public | Check availability for date range |
| `POST` | `/rooms` | Admin | Create room in hotel inventory |
| `PUT` | `/rooms/:id/status` | Staff/Admin| Update room status (`available`, `occupied`, `cleaning`, `maintenance`) |
| `POST` | `/bookings` | Private | Create pending reservation with price calculation |
| `GET` | `/bookings/my` | Guest | View guest's personal booking history |
| `GET` | `/bookings/:id` | Private | Get single booking (enforces user ownership) |
| `PUT` | `/bookings/:id/cancel` | Private | Cancel booking with policy-calculated refund |
| `PUT` | `/bookings/:id/check-in` | Staff/Admin| Check in guest, set room to `occupied` |
| `PUT` | `/bookings/:id/check-out` | Staff/Admin| Check out guest, schedule housekeeping turnover |
| `POST` | `/payments/create-order`| Private | Generate Razorpay order ID |
| `POST` | `/payments/verify` | Private | Verify cryptographic signature and capture payment |
| `POST` | `/payments/test-payment`| Private | Process sandbox test payment |
| `GET` | `/payments/booking/:id`| Private | Retrieve official tax invoice |
| `POST` | `/reviews` | Guest | Submit verified stay review (rating 1-5 & comment) |
| `GET` | `/services` | Public | List hotel experiences (spa, dining, transit) |
| `POST` | `/services/request` | Guest | Request in-suite service for active booking |
| `GET` | `/housekeeping` | Staff/Admin| View pending cleaning tasks |
| `POST` | `/housekeeping` | Staff/Admin| Manually dispatch housekeeping task |
| `PUT` | `/housekeeping/:id` | Staff/Admin| Update task status (`in_progress`, `completed`) |
| `GET` | `/notifications` | Private | User's in-app notification center |
| `PUT` | `/notifications/:id/read`| Private | Mark notification as read |
| `GET` | `/admin/dashboard` | Admin | Executive summary, revenue trends, occupancy |
| `GET` | `/admin/users` | Admin | List all registered accounts |
| `PUT` | `/admin/users/:id` | Admin | Toggle account activation or change role |
| `GET` | `/admin/audit-logs` | Admin | Security audit trail |

---

## 10. Production Deployment Guidelines

1. **Database**: Use a production MongoDB Atlas cluster with TLS/SSL enabled and connection pooling.
2. **Reverse Proxy**: Serve behind Nginx or AWS CloudFront with HTTP/2 and Let's Encrypt SSL certificates.
3. **Environment Secrets**: Generate a 64-character random string for `JWT_SECRET` (`openssl rand -hex 32`).
4. **Payment Gateway**: Replace placeholder keys with live Razorpay Key ID and Secret in your hosting dashboard.
5. **Static Assets**: Frontend can be built via `npm run build` inside `frontend/` and hosted on Vercel, Netlify, or AWS S3/CloudFront.

---

## License

This project is licensed under the MIT License.
