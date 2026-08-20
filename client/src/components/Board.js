 import React from 'react';
import Column from './Column';
import mockData from '../data/mockData';

function Board() {
  return (
    <div className="board">
      <h1>SyncBoard</h1>
      <div className="board-columns">
        {mockData.columns.map((column) => (
          <Column key={column.id} title={column.title} tasks={column.tasks} />
        ))}
      </div>
    </div>
  );
}

export default Board;