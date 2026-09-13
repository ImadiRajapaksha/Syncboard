import React from 'react';
import TaskCard from './TaskCard';
import AddTaskForm from './AddTaskForm';

function Column({ id, title, tasks, token, boardId }) {
  return (
    <div className="column">
      <h2>{title}</h2>
      <div className="column-tasks">
        {tasks.map((task) => (
          <TaskCard key={task.id} title={task.title} />
        ))}
      </div>
      <AddTaskForm token={token} boardId={boardId} columnId={id} />
    </div>
  );
}

export default Column;