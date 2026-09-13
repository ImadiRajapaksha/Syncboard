import React from 'react';
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

function Column({ id, title, tasks, token, boardId, onRefreshNeeded }) {
  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('application/json');
    if (!raw) return;
    const { id: taskId, version } = JSON.parse(raw);

    try {
      const res = await fetch(`${API_URL}/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ columnId: id, version }),
      });
      if (res.status === 409) {
        onRefreshNeeded();
      }
      // Server emits "task:updated" — Board.js refetches automatically.
    } catch (err) {
      // Network errors surface via the offline banner already; nothing
      // further to do here.
    }
  };

  return (
    <div className="column" onDragOver={handleDragOver} onDrop={handleDrop}>
      <h2>{title}</h2>
      <div className="column-tasks">
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} token={token} onRefreshNeeded={onRefreshNeeded} />
        ))}
      </div>
      <AddTaskForm token={token} boardId={boardId} columnId={id} />
    </div>
  );
}

export default Column;