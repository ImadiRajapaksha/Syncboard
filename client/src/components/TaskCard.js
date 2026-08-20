import React from 'react';
import './TaskCard.css';

function TaskCard({ title }) {
  return (
    <div className="task-card">
      <p>{title}</p>
    </div>
  );
}

export default TaskCard;