# IronPlan — Workout Planner

A full-stack CRUD workout planner built with **React**, **Express**, and **MongoDB**.

Users can create, view, edit, and delete workouts. The frontend communicates with a backend REST API, and data is stored in MongoDB Atlas. The app features a dark, fitness-themed UI with filters, polished cards, and responsive layout.

---

## Tech Stack

| Layer    | Technology              |
|----------|-------------------------|
| Frontend | React + Vite, plain CSS |
| Backend  | Node.js + Express       |
| Database | MongoDB Atlas + Mongoose|
| Deploy   | Vercel (frontend) + Render (backend) |

---

## Project Structure

```
workout-planner/
├── .gitignore
├── README.md
├── client/                   # React frontend (deploy to Vercel)
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── .env.example
│   ├── public/
│   │   └── favicon.svg
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       ├── api/
│       │   └── workouts.js   # All fetch calls to the API
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── WorkoutForm.jsx
│       │   ├── FilterBar.jsx
│       │   ├── WorkoutList.jsx
│       │   ├── WorkoutCard.jsx
│       │   └── EmptyState.jsx
│       └── styles/
│           ├── index.css
│           ├── App.css
│           ├── Header.css
│           ├── WorkoutForm.css
│           ├── FilterBar.css
│           ├── WorkoutList.css
│           ├── WorkoutCard.css
│           └── EmptyState.css
└── server/                   # Express backend (deploy to Render)
    ├── package.json
    ├── server.js
    ├── .env.example
    ├── config/
    │   └── db.js             # MongoDB connection
    ├── models/
    │   └── Workout.js        # Mongoose schema
    └── routes/
        └── workouts.js       # CRUD API routes
```

---

## Local Development Setup

### Prerequisites
- Node.js v18 or later
- A MongoDB Atlas account (free tier works)
- Git

---

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/workout-planner.git
cd workout-planner
```

---

### 2. Set up the backend

```bash
cd server
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Open `server/.env` and fill in your values:

```
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/ironplan?retryWrites=true&w=majority
```

> See the **MongoDB Atlas Setup** section below for how to get your MONGO_URI.

Start the backend server:

```bash
npm run dev
```

The API will run at `http://localhost:5000`.
Test it by visiting `http://localhost:5000/health` in your browser.

---

### 3. Set up the frontend

Open a new terminal:

```bash
cd client
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Open `client/.env` and set:

```
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

The app will open at `http://localhost:5173`.

---

## MongoDB Atlas Setup

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and sign in (or create a free account).
2. Create a new **free cluster** (M0 tier).
3. Under **Database Access**, create a database user with a username and password.
4. Under **Network Access**, click **Add IP Address** → **Allow Access from Anywhere** (`0.0.0.0/0`).
5. Click **Connect** on your cluster → **Connect your application**.
6. Copy the connection string. It looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```
7. Replace `<username>` and `<password>` with your database user credentials.
8. Add `/ironplan` before the `?` to set the database name:
   ```
   mongodb+srv://myuser:mypass@cluster0.abc123.mongodb.net/ironplan?retryWrites=true&w=majority
   ```
9. Paste this full string as your `MONGO_URI` in `server/.env`.

---

## Deployment

### Deploy Backend to Render

1. Push the full project to a GitHub repository.
2. Go to [https://render.com](https://render.com) and sign in.
3. Click **New** → **Web Service**.
4. Connect your GitHub repo.
5. Configure the service:
   - **Name**: `ironplan-api` (or anything you like)
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Under **Environment Variables**, add:
   - `MONGO_URI` → your full Atlas connection string
   - `PORT` → `5000`
   - `CORS_ORIGIN` → your Vercel frontend URL (e.g., `https://ironplan.vercel.app`) — add this after you deploy the frontend
7. Click **Create Web Service**.
8. Wait for the deploy. Copy your Render service URL (e.g., `https://ironplan-api.onrender.com`).

> **Note:** Render free tier spins down after inactivity. The first request after a sleep may take ~30 seconds.

---

### Deploy Frontend to Vercel

1. Go to [https://vercel.com](https://vercel.com) and sign in.
2. Click **Add New Project** → import your GitHub repo.
3. Configure the project:
   - **Root Directory**: `client`
   - **Framework Preset**: Vite (Vercel detects this automatically)
4. Under **Environment Variables**, add:
   - `VITE_API_BASE_URL` → `https://YOUR-RENDER-SERVICE.onrender.com/api`
5. Click **Deploy**.
6. Once deployed, copy your Vercel URL (e.g., `https://ironplan.vercel.app`).
7. Go back to Render → your service → **Environment** → update `CORS_ORIGIN` to your Vercel URL → **Save** (this triggers a redeploy).

---

### Summary of Environment Variables

| Service | Variable          | Value                                              |
|---------|-------------------|----------------------------------------------------|
| Render  | `MONGO_URI`       | Your MongoDB Atlas connection string               |
| Render  | `PORT`            | `5000`                                             |
| Render  | `CORS_ORIGIN`     | Your Vercel frontend URL (e.g. `https://x.vercel.app`) |
| Vercel  | `VITE_API_BASE_URL` | Your Render backend URL + `/api` (e.g. `https://x.onrender.com/api`) |

---

## API Reference

| Method | Route                  | Description         |
|--------|------------------------|---------------------|
| GET    | `/api/workouts`        | Get all workouts    |
| GET    | `/api/workouts/:id`    | Get one workout     |
| POST   | `/api/workouts`        | Create a workout    |
| PUT    | `/api/workouts/:id`    | Update a workout    |
| DELETE | `/api/workouts/:id`    | Delete a workout    |
| GET    | `/health`              | Health check        |

---

## Features

- ✅ Create, Read, Update, Delete workouts
- ✅ Filter by day, muscle group, and difficulty
- ✅ Polished dark UI with fitness branding
- ✅ Card-based layout with difficulty badges
- ✅ Combined create/edit form with prefill
- ✅ Delete confirmation dialog
- ✅ Loading and error states
- ✅ Empty state illustration
- ✅ Success/error banners
- ✅ Responsive layout (desktop + mobile)
- ✅ Environment variable support for all deployments

---

## Project Description (for class presentation)

> This is a full-stack workout planner application built with React, Express, and MongoDB. Users can create, view, edit, and delete workouts. The frontend communicates with a backend REST API, and the workout data is stored in MongoDB Atlas. The app is deployed online using Vercel for the frontend and Render for the backend, and it is styled with custom CSS.
