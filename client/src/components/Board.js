import React, { useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';
import Column from './Column';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
const CACHE_KEY = 'syncboard_cache';

function loadCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveCache(boardId, columns) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ boardId, columns, savedAt: Date.now() }));
  } catch {
    // storage full or unavailable — cache is a convenience, not critical
  }
}

function Board({ token }) {
  const cached = loadCache();
  const [columns, setColumns] = useState(cached ? cached.columns : []);
  const [boardId, setBoardId] = useState(cached ? cached.boardId : null);
  const [loading, setLoading] = useState(!cached);
  const [error, setError] = useState(null);
  const [offline, setOffline] = useState(false);

  const fetchColumns = useCallback((id) => {
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${API_URL}/api/boards/${id}/columns`, { headers })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch board columns");
        return res.json();
      })
      .then((data) => {
        setColumns(data);
        setLoading(false);
        setOffline(false);
        saveCache(id, data);
      })
      .catch((err) => {
        if (cached) {
          setOffline(true);
          setLoading(false);
        } else {
          setError(err.message);
          setLoading(false);
        }
      });
  }, [token, cached]);

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
      .catch((err) => {
        if (!cached) {
          setError(err.message);
          setLoading(false);
        } else {
          setOffline(true);
        }
      });
  }, [token, fetchColumns, cached]);

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
      {offline && <p className="offline-banner">Showing cached data — couldn't reach the server.</p>}
      <div className="board-columns">
        {columns.map((column) => (
          <Column key={column.id} title={column.title} tasks={column.tasks} />
        ))}
      </div>
    </div>
  );
}

export default Board;