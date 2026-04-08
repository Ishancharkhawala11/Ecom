# E-commerce Full Stack (MERN)

Full project with:
- User authentication (register/login)
- Product listing and cart checkout flow
- Order management
- Notification section (user notifications with read/unread)
- Admin panel (dashboard stats + product management)

## Tech Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose

## Setup

1. Install dependencies:
   - Backend:
     - `cd backend && npm install`
   - Frontend:
     - `cd frontend && npm install`

2. Create environment file:
   - Copy `backend/.env.example` to `backend/.env`
   - Update values as needed

3. Run backend:
   - `cd backend`
   - `npm run dev`

4. Run frontend:
   - `cd frontend`
   - `npm run dev`

## Default URLs

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## Main API routes

- Auth: `/api/auth/*`
- Products: `/api/products/*`
- Orders: `/api/orders/*`
- Notifications: `/api/notifications/*`
- Admin: `/api/admin/*`

## Admin account

Create admin with:
- `POST /api/auth/register-admin`
- Body: `{ "name", "email", "password", "adminSecret" }`
- `adminSecret` must match `ADMIN_SECRET` from `.env`
"# ecom1" 
