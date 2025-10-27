/*
 * Class-level comment: AddTodoForm renders the input field and Add button
 * similar to the provided screenshot. It emits a new todo creation event
 * to the parent via props. Names follow PascalCase and inline comments
 * explain each UI element.
 */

import React, { useState } from 'react';

export interface AddTodoFormProps {
  onCreate: (title: string, note: string | undefined, dueAt: string | undefined) => void; // Inline comment: callback invoked on Add
}

/**
 * Function-level comment: Render the form with title, note, and due date.
 */
export function AddTodoForm({ onCreate }: AddTodoFormProps) {
  const [title, setTitle] = useState(''); // Inline comment: task title
  const [note, setNote] = useState(''); // Inline comment: optional note
  const [dueAt, setDueAt] = useState(''); // Inline comment: ISO datetime string

  // Inline comment: handle add click
  const HandleAddClick = () => {
    if (!title.trim()) return;
    onCreate(title.trim(), note.trim() || undefined, dueAt || undefined);
    setTitle('');
    setNote('');
    setDueAt('');
  };

  return (
    <div className="add-form">
      {/* Inline comment: main text input to match screenshot style */}
      <input
        className="add-input"
        type="text"
        placeholder="add your task here"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {/* Inline comment: optional note */}
      <input
        className="note-input"
        type="text"
        placeholder="note (optional)"
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
      {/* Inline comment: deadline input */}
      <input
        className="due-input"
        type="datetime-local"
        value={dueAt}
        onChange={(e) => setDueAt(e.target.value)}
      />
      {/* Inline comment: Add button */}
      <button className="add-button" onClick={HandleAddClick}>Add</button>
    </div>
  );
}