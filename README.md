# 📚 Grading Application

A full-stack grading application with a **React + Vite frontend** and an **Express + Prisma backend**.  
The app supports grading workflows, Firebase integration, and schema-driven validation with Zod.

---

## 🚀 Project Structure

```
grading-application/
│
├── backend/   # Express + Prisma + TypeScript
│   ├── index.ts
│   ├── prisma/
│   └── package.json
│
└── frontend/  # React + Vite + Zustand
    ├── src/
    └── package.json
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
   DATABASE_URL="postgresql://user:password@localhost:5432/grading_app"
   FIREBASE_PROJECT_ID="your-project-id"
   FIREBASE_PRIVATE_KEY="your-private-key"
   FIREBASE_CLIENT_EMAIL="your-client-email"
   ```

4. Run database migrations:

   ```bash
   npx prisma migrate deploy
   ```

5. Seed the database (optional):

   ```bash
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
   VITE_API_URL="http://localhost:3000"  # Backend URL
   VITE_FIREBASE_API_KEY="your-firebase-api-key"
   VITE_FIREBASE_AUTH_DOMAIN="your-firebase-auth-domain"
   VITE_FIREBASE_PROJECT_ID="your-project-id"
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
- Set `VITE_API_URL` in `frontend/.env` to match the backend URL.
- Both apps can run simultaneously:
  - Backend: `npm run dev` (port 3000 by default)
  - Frontend: `npm run dev` (port 5173 by default)

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
      - Runs on changes to `frontend/**` in `dev` and `main` branches.
      - Steps include dependency installation, build verification, and linting.
  - Both workflows use **Node.js 20.x** and leverage caching for faster builds.
  - CI ensures that every commit and pull request is automatically tested, linted, and built before merging.

---

## 📦 Deployment Notes

- Backend requires a running database and Firebase credentials.
- Frontend build (`npm run build`) outputs static files in `dist/`, ready to be served by any static hosting provider (e.g., Vercel, Netlify).
- Ensure environment variables are set correctly in production.

---
