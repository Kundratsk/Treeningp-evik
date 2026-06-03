import axios from 'axios';

const API_BASE = 'http://localhost:62587/api';

const api = axios.create({
  baseURL: API_BASE,
});

// Workouts
export const getWorkouts = (params) => api.get('/workouts', { params });
export const getWorkout = (id) => api.get(`/workouts/${id}`);
export const createWorkout = (data) => api.post('/workouts', data);
export const updateWorkout = (id, data) => api.put(`/workouts/${id}`, data);
export const deleteWorkout = (id) => api.delete(`/workouts/${id}`);
export const getStats = () => api.get('/workouts/stats');

// Exercises
export const getExercises = (workoutId) => api.get(`/workouts/${workoutId}/exercises`);
export const addExercise = (workoutId, data) => api.post(`/workouts/${workoutId}/exercises`, data);
export const updateExercise = (workoutId, exerciseId, data) => api.put(`/workouts/${workoutId}/exercises/${exerciseId}`, data);
export const deleteExercise = (workoutId, exerciseId) => api.delete(`/workouts/${workoutId}/exercises/${exerciseId}`);
