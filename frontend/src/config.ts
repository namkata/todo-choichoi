/*
 * Class-level comment: Centralized configuration for the frontend app.
 * This allows easy tweaking of API endpoints and UI constants.
 */

// UPPER_SNAKE_CASE constants for configuration values
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
export const NOTIFY_CHECK_INTERVAL_MS = 1000; // Inline comment: check overdue every second
export const API_TIMEOUT_MS = 8000; // Inline comment: default API timeout for fetch