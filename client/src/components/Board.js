import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import Column from './Column';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Board({ token }) {
  const [columns, setColumns] = useState([]);
  const [boardId, setBoardId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchColumns = useCallback((id) => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${API_URL}/api/boards/${id}/columns`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch board columns");
        return res.json();
      })
      .then((data) => { setColumns(data); setLoading(false); })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [token]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${API_URL}/api/boards`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch boards");
        return res.json();
      })
      .then((boards) => {
        if (!boards.length) throw new Error("No boards found");
        const id = boards[0]._id;
        setBoardId(id);
        fetchColumns(id);
      })
      .catch((err) => { setError(err.message); setLoading(false); });
  }, [token, fetchColumns]);

      useEffect(() => {
    if (!boardId) return;
    const socket = io(API_URL);
    const refresh = () => fetchColumns(boardId);
    socket.on("task:created", refresh);
    socket.on("task:updated", refresh);
    socket.on("task:deleted", refresh);
    return () => socket.disconnect();
  }, [boardId, fetchColumns]);

  if (loading) return <div className="board"><h1>SyncBoard</h1><p>Loading…</p></div>;
  if (error) return <div className="board"><h1>SyncBoard</h1><p>Error: {error}</p></div>;

  return (
    <div className="board">
      <h1>SyncBoard</h1>
      <div className="board-columns">
        {columns.map((column) => (
          <Column key={column.id} title={column.title} tasks={column.tasks} />
        ))}
      </div>
    </div>
  );
}

export default Board;