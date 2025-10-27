/*
 * Class-level comment: This file declares shared TypeScript types
 * for the Todo application. It ensures a single source of truth
 * across components and API client. All names follow PascalCase for
 * types/interfaces and camelCase for variables, matching the user's
 * conventions.
 */

// UPPER_SNAKE_CASE constants used across the app
export const API_TIMEOUT_MS = 8000; // Inline comment: default API timeout

/**
 * Function-level comment: Utility alias that captures the allowed status
 * for a todo item. Keeping as a type helps enforce correctness.
 */
export type TodoStatus = 'pending' | 'completed';

/**
 * Function-level comment: The core Todo model used throughout the app.
 * The `isOverdue` is computed on the client from `dueAt` and `status`.
 */
export interface Todo {
  id: string; // Inline comment: UUID or DB-generated string id
  title: string; // Inline comment: short title
  note?: string; // Inline comment: optional longer note/description
  dueAt?: string; // Inline comment: ISO datetime string
  status: TodoStatus; // Inline comment: current status
  createdAt?: string; // Inline comment: ISO datetime
  updatedAt?: string; // Inline comment: ISO datetime
  isOverdue?: boolean; // Inline comment: derived flag for UI highlight
}