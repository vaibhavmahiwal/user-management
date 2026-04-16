# User Management System

A full-stack MERN application with role-based access control, JWT authentication, and secure user lifecycle management.

**Live Demo:** [https://user-management-six-kappa.vercel.app](https://user-management-six-kappa.vercel.app)  
**API Base URL:** [https://user-management-r9yn.onrender.com](https://user-management-r9yn.onrender.com)

---

## Test Accounts

| Role    | Email               | Password     |
|---------|---------------------|--------------|
| Admin   | admin@test.com      | Admin@123    |
| Manager | manager@test.com    | Manager@123  |
| User    | user@test.com       | User@123     |

---

## Features

### Authentication & Security
- JWT-based authentication with protected routes
- Passwords hashed with bcrypt (12 salt rounds)
- Tokens validated on every request — deactivated users are blocked instantly even with a valid token
- User enumeration prevention — identical error messages for wrong email/password
- Environment variables for all secrets
- Rate limiting (100 req/15 min per IP)
- Security headers via Helmet
- CORS restricted to frontend origin
- Password hashes never exposed in any API response (`select: false` + `toJSON` override)

### Role-Based Access Control (RBAC)
Three roles with enforced permissions on both backend routes and frontend UI:

| Capability                        | Admin | Manager | User |
|-----------------------------------|-------|---------|------|
| View all users (paginated)        | ✅    | ✅      | ❌   |
| Search & filter users             | ✅    | ✅      | ❌   |
| View user detail + audit info     | ✅    | ✅      | ❌   |
| Create new users                  | ✅    | ❌      | ❌   |
| Edit users                        | ✅    | ✅*     | ❌   |
| Assign roles                      | ✅    | ❌      | ❌   |
| Deactivate / activate users       | ✅    | ❌      | ❌   |
| Delete users                      | ✅    | ❌      | ❌   |
| View & edit own profile           | ✅    | ✅      | ✅   |

*Managers cannot edit admin accounts or assign the admin role.

### User Management
- Paginated, searchable user list with role and status filters
- Create users with optional auto-generated password (shown once to admin)
- Soft deactivation — inactive users cannot log in
- Audit trail on every user record: `createdBy`, `updatedBy`, `createdAt`, `updatedAt`
- Audit info visible in user detail view

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6, Axios  |
| Backend    | Node.js, Express                  |
| Database   | MongoDB, Mongoose                 |
| Auth       | JWT, bcryptjs                     |
| Validation | express-validator                 |
| Security   | Helmet, express-rate-limit, CORS  |
| Deployment | Vercel (frontend), Render (backend) |

---

## Project Structure

```
user-management/
├── server/
│   ├── config/          # DB connection, constants (ROLES, STATUS)
│   ├── controllers/     # Thin request handlers
│   ├── middleware/      # authenticate, authorize, validate, errorHandler
│   ├── models/          # User schema
│   ├── routes/          # Route definitions with RBAC middleware
│   ├── services/        # Business logic layer
│   ├── validators/      # express-validator rule sets
│   ├── utils/           # ApiError, ApiResponse, logger
│   └── scripts/         # seed.js
├── client/
│   └── src/
│       ├── api/         # Axios instance + endpoint functions
│       ├── context/     # AuthContext (login, logout, persist)
│       ├── components/  # Layout, Navbar, ProtectedRoute, shared UI
│       ├── hooks/       # useAuth
│       └── pages/       # Login, Dashboard, UserList, UserDetail, CreateUser, EditUser, Profile
├── docker-compose.yml
└── README.md
```

---

## API Endpoints

| Method | Route                        | Access           |
|--------|------------------------------|------------------|
| POST   | /api/auth/login              | Public           |
| POST   | /api/auth/register           | Public           |
| GET    | /api/auth/me                 | Authenticated    |
| GET    | /api/users                   | Admin, Manager   |
| POST   | /api/users                   | Admin            |
| GET    | /api/users/profile           | Authenticated    |
| PATCH  | /api/users/profile           | Authenticated    |
| GET    | /api/users/:id               | Admin, Manager   |
| PATCH  | /api/users/:id               | Admin, Manager   |
| DELETE | /api/users/:id               | Admin            |
| PATCH  | /api/users/:id/toggle-status | Admin            |

Unauthorized requests return `401` (no token / invalid token) or `403` (insufficient role).

---

## Local Setup

### Prerequisites
- Node.js 18+
- MongoDB Atlas URI (or local MongoDB)

### Backend

```bash
cd server
npm install
```

Create `server/.env`:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

```bash
npm run seed    # Creates 3 test accounts
npm run dev     # Starts on port 5000
```

### Frontend

```bash
cd client
npm install
```

Create `client/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev     # Starts on port 5173
```

---

## Docker

Runs both services together:

```bash
docker-compose up --build
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:10000`

> For Docker, ensure `server/.env` exists with your MongoDB URI and JWT secret.

---

## Architecture Decisions

**Services layer** — business logic lives in `/services`, keeping controllers thin and testable.

**Extensible RBAC** — the `authorize(...roles)` middleware is a factory function. Adding a new role requires updating `config/constants.js` and the relevant route — no other changes needed.

**Consistent API responses** — all responses follow `{ success, message, data }` via `ApiResponse`. All errors are handled centrally in `errorHandler` middleware covering Mongoose errors, JWT errors, and custom `ApiError` instances.

**Password security** — `select: false` on the password field ensures it's never returned in queries. A `toJSON()` override on the User model acts as a second line of defense. The pre-save hook handles hashing automatically.
