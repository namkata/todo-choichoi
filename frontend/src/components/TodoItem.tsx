/*
 * Class-level comment: TodoItem renders a single todo row with a circle
 * toggle, title, and delete button. It matches the screenshot visuals
 * with strikethrough when completed and a friendly overdue highlight.
 */

import React from 'react';
import type { Todo } from '../types';

export interface TodoItemProps {
  todo: Todo; // Inline comment: todo to render
  onToggle: (id: string, completed: boolean) => void; // Inline comment: toggle completion
  onDelete: (id: string) => void; // Inline comment: delete todo
}

/**
 * Function-level comment: Presentational component for a todo row.
 */
export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  const isCompleted = todo.status === 'completed'; // Inline comment: computed flag
  const circleClass = isCompleted ? 'circle completed' : 'circle';

  const HandleToggle = () => onToggle(todo.id, !isCompleted);
  const HandleDelete = () => onDelete(todo.id);

  return (
    <div className={`todo-row ${todo.isOverdue && !isCompleted ? 'overdue' : ''}`}>
      {/* Inline comment: circle toggle on the left */}
      <button className={circleClass} onClick={HandleToggle} aria-label="toggle-complete">
        {isCompleted ? '✓' : ''}
      </button>

      {/* Inline comment: title and note block */}
      <div className="todo-text">
        <div className={`todo-title ${isCompleted ? 'done' : ''}`}>{todo.title}</div>
        {todo.note && <div className="todo-note">{todo.note}</div>}
        {todo.dueAt && (
          <div className="todo-due">
            Due: {new Date(todo.dueAt).toLocaleString()}
          </div>
        )}
        {todo.isOverdue && !isCompleted && (
          <div className="todo-overdue-hint">Overdue — please check ⚠️</div>
        )}
      </div>

      {/* Inline comment: delete button on the right */}
      <button className="delete-button" onClick={HandleDelete} aria-label="delete">
        ×
      </button>
    </div>
  );
}