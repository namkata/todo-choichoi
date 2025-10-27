/*
 * Class-level comment: ApiClient is a thin wrapper around fetch
 * for communicating with the Golang backend. Methods are in PascalCase
 * to follow user rules. Inline comments describe each step.
 */

import { API_BASE_URL, API_TIMEOUT_MS } from '../config';
import type { Todo } from '../types';

/**
 * Function-level comment: Helper to perform a fetch with a timeout.
 */
function FetchWithTimeout(url: string, init?: RequestInit): Promise<Response> {
  const controller = new AbortController(); // Inline comment: abort on timeout
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);
  const finalInit: RequestInit = { ...init, signal: controller.signal };
  return fetch(url, finalInit).finally(() => clearTimeout(timeout));
}

/**
 * Class-level comment: ApiClient encapsulates all Todo endpoints.
 * OpenAPI-like documentation (frontend side) for clarity:
 * - POST /api/todos: Create Todo
 * - GET /api/todos: List Todos
 * - PUT /api/todos/{id}: Update Todo
 * - DELETE /api/todos/{id}: Delete Todo
 * - PATCH /api/todos/{id}/complete: Mark complete/undo
 */
export class ApiClient {
  /**
   * Function-level comment: Create a new Todo on the server.
   */
  public async CreateTodo(payload: Omit<Todo, 'id' | 'status' | 'isOverdue' | 'createdAt' | 'updatedAt'> & { status?: 'pending' | 'completed' }): Promise<Todo> {
    const res = await FetchWithTimeout(`${API_BASE_URL}/api/todos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`CreateTodo failed: ${res.status}`);
    return res.json();
  }

  /**
   * Function-level comment: Fetch all Todos.
   */
  public async GetTodos(): Promise<Todo[]> {
    const res = await FetchWithTimeout(`${API_BASE_URL}/api/todos`);
    if (!res.ok) throw new Error(`GetTodos failed: ${res.status}`);
    return res.json();
  }

  /**
   * Function-level comment: Update a Todo by id.
   */
  public async UpdateTodo(id: string, payload: Partial<Omit<Todo, 'id'>>): Promise<Todo> {
    const res = await FetchWithTimeout(`${API_BASE_URL}/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error(`UpdateTodo failed: ${res.status}`);
    return res.json();
  }

  /**
   * Function-level comment: Delete a Todo by id.
   */
  public async DeleteTodo(id: string): Promise<void> {
    const res = await FetchWithTimeout(`${API_BASE_URL}/api/todos/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error(`DeleteTodo failed: ${res.status}`);
  }

  /**
   * Function-level comment: Toggle completion status of a Todo.
   */
  public async ToggleComplete(id: string, completed: boolean): Promise<Todo> {
    const res = await FetchWithTimeout(`${API_BASE_URL}/api/todos/${id}/complete`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) throw new Error(`ToggleComplete failed: ${res.status}`);
    return res.json();
  }
}