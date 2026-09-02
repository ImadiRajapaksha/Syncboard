const Board = require("../models/Board");
const Task = require("../models/Task");

exports.getAllBoards = async (req, res) => {
  const boards = await Board.find();
  res.json(boards);
};

exports.getBoardById = async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) return res.status(404).json({ error: "Board not found" });
  res.json(board);
};

exports.getBoardColumns = async (req, res) => {
  const board = await Board.findById(req.params.id);
  if (!board) return res.status(404).json({ error: "Board not found" });

  const tasks = await Task.find({ boardId: board._id });
  const columnsWithTasks = board.columns.map((column) => ({
    id: column.id,
    title: column.title,
    tasks: tasks.filter((t) => t.columnId === column.id),
  }));
  res.json(columnsWithTasks);
};