 const express = require("express");
const cors = require("cors");
const { boards, tasks } = require("./data/mockData");

const app = express();

app.use(cors());
app.use(express.json());

// GET all boards
app.get("/api/boards", (req, res) => {
  res.json(boards);
});

// GET single board (with its columns)
app.get("/api/boards/:id", (req, res) => {
  const board = boards.find((b) => b.id === req.params.id);
  if (!board) return res.status(404).json({ error: "Board not found" });
  res.json(board);
});

// GET columns for a board, each with its tasks nested in
app.get("/api/boards/:id/columns", (req, res) => {
  const board = boards.find((b) => b.id === req.params.id);
  if (!board) return res.status(404).json({ error: "Board not found" });

  const columnsWithTasks = board.columns.map((column) => ({
    ...column,
    tasks: tasks.filter(
      (t) => t.boardId === board.id && t.columnId === column.id
    ),
  }));

  res.json(columnsWithTasks);
});

// GET all tasks
app.get("/api/tasks", (req, res) => {
  res.json(tasks);
});

// GET single task
app.get("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  res.json(task);
});

// CREATE a task
app.post("/api/tasks", (req, res) => {
  const newTask = {
    id: String(tasks.length + 1),
    boardId: req.body.boardId,
    columnId: req.body.columnId,
    title: req.body.title,
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
});

// UPDATE a task
app.put("/api/tasks/:id", (req, res) => {
  const task = tasks.find((t) => t.id === req.params.id);
  if (!task) return res.status(404).json({ error: "Task not found" });
  
  task.title = req.body.title !== undefined ? req.body.title : task.title;
  task.columnId = req.body.columnId !== undefined ? req.body.columnId : task.columnId;
  
  res.json(task);
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});