/*
 * Class-level comment: TodoList manages the list rendering and exposes
 * callbacks for toggling completion and deleting items. It is a simple
 * container composing TodoItem rows.
 */

import React from 'react';
import type { Todo } from '../types';
import { TodoItem } from './TodoItem';

export interface TodoListProps {
  items: Todo[]; // Inline comment: list of todos
  onToggle: (id: string, completed: boolean) => void; // Inline comment: toggle completion
  onDelete: (id: string) => void; // Inline comment: delete
}

/**
 * Function-level comment: Render list of todos using TodoItem.
 */
export function TodoList({ items, onToggle, onDelete }: TodoListProps) {
  return (
    <div className="todo-list">
      {items.map((t) => (
        <TodoItem key={t.id} todo={t} onToggle={onToggle} onDelete={onDelete} />
      ))}
    </div>
  );
}