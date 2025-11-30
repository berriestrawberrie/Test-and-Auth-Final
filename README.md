# 📚 Grading Application

A full-stack grading application with a **React + Vite frontend** and an **Express + Prisma backend**.  
The app supports grading workflows, Firebase integration, and schema-driven validation with Zod.

---

## 🚀 Project Structure

```
grading-application/
│
├── backend/                        # Express + Prisma + TypeScript API
│   ├── index.ts                    # Entry point for backend server
│   ├── app.ts                      # Express app setup and middleware
│   ├── prisma/                     # Prisma ORM files
│   │   ├── schema.prisma           # Database schema definition
│   │   ├── client.ts               # Prisma client instance
│   │   ├── seed.ts                 # Database seeding script
│   │   └── migrations/             # Prisma migration files
│   ├── controllers/                # Express route controllers (admins, students, users)
│   ├── routes/                     # Express route definitions
│   ├── middleware/                 # Custom Express middleware (auth)
│   ├── schemas/                    # Zod validation schemas for API input
│   ├── interfaces/                 # TypeScript interfaces/types
│   ├── utils/                      # Utility/helper functions
│   ├── tests/                      # Jest + Supertest API tests
│   ├── docs/                       # OpenAPI/Swagger documentation
│   ├── .env                        # Environment variables
│   ├── package.json                # Backend dependencies and scripts
│   └── tsconfig.json               # TypeScript configuration
│
└── frontend/                       # React + Vite + Zustand client
    ├── src/                        # Main source code
    │   ├── api/                    # API handler functions for backend communication
    │   ├── components/             # Reusable React components (Table, Modal, etc.)
    │   ├── pages/                  # Page-level React components (Admin, Student, Landing)
    │   ├── schemas/                # Zod schemas for frontend validation
    │   ├── interfaces/             # TypeScript interfaces/types
    │   ├── stores/                 # Zustand state management
    │   ├── firebase/               # Firebase initialization/config
    │   ├── routes/                 # React Router route definitions
    │   ├── main.tsx                # React app entry point
    │   └── App.tsx                 # Main App component
    ├── public/                     # Static assets (if any)
    ├── index.html                  # HTML entry point
    ├── .env                        # Frontend environment variables
    ├── package.json                # Frontend dependencies and scripts
    ├── tsconfig.json               # TypeScript configuration
    └── vite.config.ts              # Vite configuration
```

---

## ⚙️ Prerequisites

- **Node.js** (>= 18 recommended)
- **npm** or **yarn** (npm examples used below)
- **PostgreSQL** (or your chosen database for Prisma)
- **Firebase project** (for authentication/notifications)
- Environment files:
  - `backend/.env`
  - `backend/.env.test`
  - `frontend/.env`

---

## 🔧 Backend Setup

1. Navigate to the backend folder:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:

   ```env
   # URL for your postgresql db.
   DATABASE_URL="postgresql://user:password@localhost:5432/grading_app"
   # Filepath to your firebase service account key information.
   GOOGLE_APPLICATION_CREDENTIALS="./firebaseServiceAccountKey.json"
   ```

   ```env.test
   # URL for your postgresql TEST db.
   DATABASE_URL="postgresql://user:password@localhost:5432/grading_app"
   # Filepath to your firebase service account key information.
   GOOGLE_APPLICATION_CREDENTIALS="./firebaseServiceAccountKey.json"
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate deploy
   npm run test:migrate
   ```

5. Seed the databases (optional):

   ```bash
   npx prisma db seed
   npm run test:seed
   ```

6. Start the backend in development mode:

   ```bash
   npm run dev
   ```

7. Lint the backend code:
   ```bash
   npm run lint
   ```

---

## 🎨 Frontend Setup

1. Navigate to the frontend folder:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Configure environment variables in `.env`:

   ```env
   VITE_FIREBASE_API_KEY=""
   VITE_FIREBASE_AUTH_DOMAIN=""
   VITE_FIREBASE_PROJECT_ID=""
   VITE_FIREBASE_STORAGE_BUCKET=""
   VITE_FIREBASE_MESSAGING_SENDER_ID=""
   VITE_FIREBASE_APP_ID=""
   ```

4. Start the frontend in development mode:

   ```bash
   npm run dev
   ```

5. Lint the frontend code:
   ```bash
   npm run lint
   ```

---

## 🖇️ Connecting Frontend & Backend

- Ensure the backend is running on `http://localhost:3000` (or your configured port).
- Both apps can run simultaneously:
  - Backend: `npm run dev` (port 3000 by default)
  - Frontend: `npm run dev` (port 1337 by default)

---

## 🧪 Testing

- **Backend**: Uses Jest + Supertest for API tests.

  Can add additional testing information here.

---

## 🧹 Code Quality & CI

- **ESLint** is configured for both frontend and backend.
- Run lint checks locally:

  ```bash
  npm run lint
  ```

- **Continuous Integration (CI)** is set up with **GitHub Actions**:
  - Separate workflows are defined for **backend** and **frontend**:
    - [`Node.js Backend CI`](.github/workflows/backend-ci.yml)
      - Runs on changes to `backend/**` in `dev` and `main` branches.
      - Steps include dependency installation, environment setup, Prisma migrations, Jest tests, and linting.
    - [`Node.js Frontend CI`](.github/workflows/frontend-ci.yml)
      - Runs on changes to `frontend/**` and `backend/**`in `dev` and `main` branches.
      - Steps include dependency installation, build verification, and linting.
  - Both workflows use **Node.js 20.x** and leverage caching for faster builds.
  - CI ensures that every commit and pull request is automatically tested, linted, and built before merging.

---

## 📦 Deployment Notes

- Backend requires a running database and Firebase credentials.
- Frontend build (`npm run build`) outputs static files in `dist/`, ready to be served by any static hosting provider (e.g., Vercel, Netlify).
- Ensure environment variables are set correctly in production.

---
