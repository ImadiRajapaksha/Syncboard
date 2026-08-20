 import React from 'react';

function Column({ title, tasks }) {
  return (
    <div className="column">
      <h2>{title}</h2>
      <div className="column-tasks">
        {tasks.map((task) => (
          <div key={task.id} className="task-placeholder">
            {task.title}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Column;