ReSell Hub Server

Project Purpose

Backend API server for ReSell Hub Marketplace.

---

Live API URL



---

Features

Authentication

- Better Auth
- Google Login
- JWT Token Generation
- Verify Token Middleware

Database Collections

Users

Products

Orders

Wishlist

Payments

Reports

---

APIs

Users API

Products API

Orders API

Wishlist API

Payments API

Reports API

Profile API

Settings API

---

Security Features

Environment Variables

JWT Secret Key

MongoDB Credentials Protection

CORS Configuration

Protected APIs

---

Technologies Used

Node.js

Express.js

MongoDB

JWT

Better Auth

---

NPM Packages Used

express

mongodb

jsonwebtoken

dotenv

cors

cookie-parser

better-auth

stripe

---

Environment Variables

Create a .env file

PORT=

MONGO_DB_URI=

AUTH_DB_NAME=

DB_USER=

DB_PASS=

JWT_SECRET=

BETTER_AUTH_SECRET=

BETTER_AUTH_URL=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=

---

Deployment

Render Deployment

No CORS Issues

No 404 Errors

No 504 Errors

Protected Routes Stay Logged In

JWT Protected APIs