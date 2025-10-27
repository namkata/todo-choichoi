import React, { useEffect, useMemo, useState } from 'react'
import './App.css'
import './index.css'
import { AddTodoForm } from './components/AddTodoForm'
import { TodoList } from './components/TodoList'
import type { Todo } from './types'
import { ApiClient } from './api/ApiClient'
import { RequestNotificationPermission, StartOverdueNotifier } from './utils/Notifications'

/**
 * Function-level comment: Compute derived overdue flag for each item
 */
function ComputeOverdue(items: Todo[]): Todo[] {
  const now = Date.now();
  return items.map((t) => {
    const overdue = !!t.dueAt && new Date(t.dueAt).getTime() < now && t.status !== 'completed';
    return { ...t, isOverdue: overdue };
  });
}

/**
 * Class-level comment: App renders the overall UI shown in the screenshot:
 * - Title "To-Do List" with emoji
 * - Input field and Add button
 * - List of todos with circle toggles and delete buttons
 * It also wires up notification logic and backend API calls.
 */
function App() {
  const client = useMemo(() => new ApiClient(), []); // Inline comment: single ApiClient instance
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Inline comment: fetch initial data from backend (with graceful fallback)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await client.GetTodos();
        if (!mounted) return;
        setTodos(ComputeOverdue(data));
      } catch (e) {
        // Inline comment: Fallback to empty local list on failure
        setError('Backend chưa sẵn sàng. Hiển thị dữ liệu cục bộ.');
        setTodos([]);
      } finally {
        setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [client]);

  // Inline comment: compute overdue items for notifications and stats
  const overdueItems = useMemo(() => {
    const now = Date.now();
    return todos.filter((t) => t.status !== 'completed' && t.dueAt && new Date(t.dueAt).getTime() < now);
  }, [todos]);

  // Inline comment: compute stats for display
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(t => t.status === 'completed').length;
    const pending = total - completed;
    const overdue = overdueItems.length;
    return { total, completed, pending, overdue };
  }, [todos, overdueItems]);

  // Inline comment: setup notifications when todos change
  useEffect(() => {
    RequestNotificationPermission();
    const stop = StartOverdueNotifier(() => todos);
    return () => stop();
  }, [todos]);

  // Inline comment: create new todo (local-first, then server)
  const HandleCreateTodo = async (title: string, note?: string, dueAt?: string) => {
    const tempId = `temp-${Date.now()}`;
    const tempTodo: Todo = {
      id: tempId,
      title,
      note,
      dueAt,
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTodos((prev) => ComputeOverdue([...prev, tempTodo]));
    try {
      const normalizedDueAt = dueAt ? new Date(dueAt).toISOString() : undefined;
      const newTodo = { title, note, dueAt: normalizedDueAt, status: 'pending' as const };
      const saved = await client.CreateTodo(newTodo);
      // Inline: preserve any local status changes made before server responds
      setTodos((prev) => {
        const local = prev.find((t) => t.id === tempId);
        const status = local?.status ?? saved.status;
        return ComputeOverdue(prev.map((t) => (t.id === tempId ? { ...saved, status } : t)));
      });
      setSuccess('✅ Đã thêm task mới thành công!');
      setTimeout(() => setSuccess(null), 3000);
    } catch {
      setError('Không thể lưu todo mới lên server.');
    }
  };

  // Inline comment: toggle completion (local-first, then server)
  // Inline comment: toggle completion (local-first; skip server for temp IDs)
  const HandleToggle = async (id: string, completed: boolean) => {
    // Inline: update local immediately
    setTodos((prev) => ComputeOverdue(prev.map((t) => (t.id === id ? { ...t, status: completed ? 'completed' : 'pending' } : t))));
    // Inline: guard — don't call backend with temporary IDs to avoid UUID errors
    if (id.startsWith('temp-')) {
      return; // Inline: wait until creation completes and ID is real
    }
    try {
      const saved = await client.ToggleComplete(id, completed);
      setTodos((prev) => ComputeOverdue(prev.map((t) => (t.id === id ? saved : t))));
    } catch {
      setError('Không thể đồng bộ trạng thái với server.');
    }
  };

  // Inline comment: delete item
  // Inline comment: delete item (skip server for temp IDs)
  const HandleDelete = async (id: string) => {
    const snapshot = todos;
    setTodos((prev) => prev.filter((t) => t.id !== id));
    // Inline: guard — don't call backend for temp IDs
    if (id.startsWith('temp-')) {
      return;
    }
    try {
      await client.DeleteTodo(id);
    } catch {
      setError('Xóa trên server thất bại. Khôi phục lại cục bộ.');
      setTodos(snapshot);
    }
  };

  return (
    <div className="app-bg">
      <div className="card">
        <h1 className="title">To-Do List 📝</h1>
        {stats.total > 0 && (
          <div className="stats">
            <span className="stat-item">📊 Tổng: {stats.total}</span>
            <span className="stat-item">✅ Hoàn thành: {stats.completed}</span>
            <span className="stat-item">⏳ Đang làm: {stats.pending}</span>
            {stats.overdue > 0 && <span className="stat-item overdue">🔥 Quá hạn: {stats.overdue}</span>}
          </div>
        )}
        <AddTodoForm onCreate={HandleCreateTodo} />
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
        {loading ? (
          <div className="loading">Đang tải...</div>
        ) : (
          <TodoList items={todos} onToggle={HandleToggle} onDelete={HandleDelete} />
        )}
      </div>
    </div>
  )
}

export default App
