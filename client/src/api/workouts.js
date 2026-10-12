// Base URL comes from the Vite environment variable.
// Locally: http://localhost:5000/api
// Production: your Render URL/api
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Handle HTTP error responses uniformly
async function handleResponse(res) {
  if (!res.ok) {
    const err = await res.json().catch(() => ({
      message: res.statusText,
    }));

    throw new Error(err.message || 'Something went wrong');
  }

  return res.json();
}

// Handle both network failures and HTTP responses
async function apiRequest(url, options) {
  let response;

  try {
    response = await fetch(url, options);
  } catch (error) {
    throw new Error('Could not connect to the server. Is it running?');
  }

  return handleResponse(response);
}

export const getAllWorkouts = () =>
  apiRequest(`${BASE_URL}/workouts`);

export const createWorkout = (data) =>
  apiRequest(`${BASE_URL}/workouts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const updateWorkout = (id, data) =>
  apiRequest(`${BASE_URL}/workouts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

export const deleteWorkout = (id) =>
  apiRequest(`${BASE_URL}/workouts/${id}`, {
    method: 'DELETE',
  });