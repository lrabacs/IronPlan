# IronPlan

IronPlan is a full-stack workout tracking application for logging training sessions and reviewing workout history over time.

Users can record workout details, muscle groups, exercises, individual sets, rest periods, difficulty, and notes. Workouts can be edited, deleted, searched, filtered, and reviewed chronologically through a responsive React interface.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React, Vite, JavaScript, CSS |
| Backend | Node.js, Express |
| Database | MongoDB Atlas, Mongoose |
| Testing | Jest, Supertest, MongoDB Memory Server |
| Deployment | Vercel, Render |

## Features

- Create, edit, and delete workouts
- Record workout date, start time, duration, and difficulty
- Select multiple muscle groups
- Add and reorder exercises
- Add multiple sets per exercise
- Track reps and optional weight in pounds or kilograms
- Support bodyweight exercises with no weight value
- Record exercise rest periods and notes
- Store overall workout notes
- Expand and collapse exercises while editing
- Expand workout cards to review complete session details
- Group workout history by month
- Search by workout or exercise name
- Filter by date performed and muscle group
- Filter workouts by difficulty range
- Responsive dark-themed interface
- Backend validation and API error handling

## Architecture

IronPlan uses a separated frontend and backend architecture:

```text
React / Vite
     |
     | HTTP + JSON
     v
Express REST API
     |
     v
Mongoose
     |
     v
MongoDB Atlas
```

The React frontend handles workout entry, editing, filtering, and history display.

The Express backend exposes REST endpoints for workout CRUD operations and validates incoming data with Mongoose before storing it in MongoDB.

Workout documents contain nested exercises, and each exercise contains its own set data.

```text
Workout
├── title
├── date
├── startTime
├── durationMinutes
├── difficulty
├── muscleGroups[]
├── exercises[]
│   ├── name
│   ├── sets[]
│   │   ├── reps
│   │   ├── weight
│   │   └── weightUnit
│   ├── restTime
│   ├── restUnit
│   └── notes
└── notes
```

## Project Structure

```text
IronPlan/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   │   └── workouts.js
│   │   ├── components/
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ExerciseEditor.jsx
│   │   │   ├── FilterBar.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── WorkoutCard.jsx
│   │   │   ├── WorkoutForm.jsx
│   │   │   └── WorkoutList.jsx
│   │   ├── constants/
│   │   │   └── workoutOptions.js
│   │   ├── styles/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   └── Workout.js
│   ├── routes/
│   │   └── workouts.js
│   ├── tests/
│   │   ├── app.test.js
│   │   └── workouts.test.js
│   ├── .env.example
│   ├── app.js
│   ├── package.json
│   └── server.js
│
├── .gitignore
└── README.md
```

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/workouts` | Get all workouts |
| GET | `/api/workouts/:id` | Get one workout |
| POST | `/api/workouts` | Create a workout |
| PUT | `/api/workouts/:id` | Update a workout |
| DELETE | `/api/workouts/:id` | Delete a workout |
| GET | `/health` | Check API status |

Workout history is returned newest-first using the workout's performed date rather than its database creation time.

## Backend Validation

The API validates workout data before storing it, including:

- valid workout dates
- difficulty values from 1 through 10
- at least one selected muscle group
- at least one exercise
- at least one set per exercise
- positive rep counts
- nonnegative weight and rest values
- supported weight and rest units

Malformed workout IDs return `400`, missing workouts return `404`, validation failures return `400`, and unexpected server failures return `500`.

## Testing

The backend test suite uses Jest, Supertest, and MongoDB Memory Server so API tests run against an isolated temporary MongoDB instance rather than the production database.

Current coverage includes:

- health and unknown routes
- workout creation
- workout retrieval
- workout updates
- workout deletion
- malformed IDs
- missing resources
- schema validation
- nested set validation
- calendar-date validation
- muscle-group validation
- bodyweight sets
- chronological workout sorting

Run the backend tests with:

```bash
cd server
npm test
```

## Local Development

### Requirements

- Node.js
- npm
- MongoDB Atlas database

### Clone the repository

```bash
git clone https://github.com/lrabacs/IronPlan.git
cd IronPlan
```

### Backend

```bash
cd server
npm install
```

Create a `.env` file based on `.env.example`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
```

Start the development server:

```bash
npm run dev
```

The API runs at:

```text
http://localhost:5000
```

### Frontend

In a separate terminal:

```bash
cd client
npm install
```

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start Vite:

```bash
npm run dev
```

The frontend runs at:

```text
http://localhost:5173
```

## Production Build

Build the frontend with:

```bash
cd client
npm run build
```

The frontend is designed for deployment on Vercel and the Express API on Render, with MongoDB Atlas providing persistent database storage.