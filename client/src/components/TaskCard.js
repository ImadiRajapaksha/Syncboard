import React, { useState } from 'react';
import './TaskCard.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function TaskCard({ task, token, onRefreshNeeded }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [editingVersion, setEditingVersion] = useState(task.version);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!window.confirm(`Delete "${task.title}"?`)) return;
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/tasks/${task._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete task');
      }
      // Server emits "task:deleted" over Socket.io — Board.js already
      // listens for that and refetches, so no manual refresh needed here.
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleSaveEdit = async () => {
    if (!title.trim() || title === task.title) {
      setEditing(false);
      setTitle(task.title);
      return;
    }
    setBusy(true);
    setError('');
    try {
      const res = await fetch(`${API_URL}/api/tasks/${task._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
          body: JSON.stringify({ title: title.trim(), version: editingVersion }),
      });
            if (res.status === 409) {
        onRefreshNeeded();
        setEditing(false);
        setError('');
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to update task');
      }
      // Server emits "task:updated" — Board.js refetches automatically.
      setEditing(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDragStart = (e) => {
    e.dataTransfer.setData(
      'application/json',
      JSON.stringify({ id: task._id, version: task.version })
    );
  };

  return (
    <div className="task-card" draggable={!busy} onDragStart={handleDragStart}>
      {editing ? (
        <div className="task-card-edit">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={busy}
            autoFocus
          />
          <div className="task-card-edit-actions">
            <button onClick={handleSaveEdit} disabled={busy}>Save</button>
            <button onClick={() => { setEditing(false); setTitle(task.title); }} disabled={busy}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <p>{task.title}</p>
          <div className="task-card-actions">
            <button onClick={() => { setTitle(task.title); setEditingVersion(task.version); setEditing(true); }} disabled={busy}>Edit</button>
            <button onClick={handleDelete} disabled={busy}>Delete</button>
          </div>
        </>
      )}
      {error && <p className="task-card-error">{error}</p>}
    </div>
  );
}

export default TaskCard