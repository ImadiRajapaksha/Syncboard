import React, { useState, useEffect } from 'react';
import Column from './Column';

function Board() {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/boards/board1/columns")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch board data");
        return res.json();
      })
      .then((data) => {
        setColumns(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

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