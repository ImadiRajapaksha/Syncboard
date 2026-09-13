import React, { useState } from 'react';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function AddTaskForm({ token, boardId, columnId }) {
  const [title, setTitle] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ boardId, columnId, title: title.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create task');
      }
      setTitle('');
      // No manual refresh needed — the server emits "task:created" over
      // Socket.io and Board.js already listens for that to refetch.
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="add-task-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="New task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        disabled={submitting}
      />
      <button type="submit" disabled={submitting || !title.trim()}>
        + Add
      </button>
      {error && <p className="add-task-error">{error}</p>}
    </form>
  );
}

export default AddTaskForm;