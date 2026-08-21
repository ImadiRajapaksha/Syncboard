import React from 'react';
import TaskCard from './TaskCard';

function Column({ title, tasks }) {
  return (
    <div className="column">
      <h2>{title}</h2>
      <div className="column-tasks">
        {tasks.map((task) => (
          <TaskCard key={task.id} title={task.title} />
        ))}
      </div>
    </div>
  );
}

export default Column;