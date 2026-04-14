// Base URL comes from the Vite environment variable.
// Locally: http://localhost:5000/api
// Production: your Render URL/api
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Helper to handle response errors uniformly
async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(err.message || 'Something went wrong');
  }
  return res.json();
}

export const getAllWorkouts = () =>
  fetch(`${BASE_URL}/workouts`).then(handleResponse);

export const getWorkoutById = (id) =>
  fetch(`${BASE_URL}/workouts/${id}`).then(handleResponse);

export const createWorkout = (data) =>
  fetch(`${BASE_URL}/workouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const updateWorkout = (id, data) =>
  fetch(`${BASE_URL}/workouts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }).then(handleResponse);

export const deleteWorkout = (id) =>
  fetch(`${BASE_URL}/workouts/${id}`, {
    method: 'DELETE',
  }).then(handleResponse);
