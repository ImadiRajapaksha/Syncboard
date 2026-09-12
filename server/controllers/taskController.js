const Task = require("../models/Task");

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { boardId, columnId, title } = req.body;
    const task = await Task.create({ boardId, columnId, title });
    req.app.get("io").emit("task:created", task);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });

    const clientVersion = req.body.version;
    if (clientVersion !== undefined && clientVersion !== task.version) {
      return res.status(409).json({
        error: "Conflict: this task was modified by someone else",
        code: "CONFLICT",
        currentTask: task,
      });
    }

    task.title = req.body.title !== undefined ? req.body.title : task.title;
    task.columnId = req.body.columnId !== undefined ? req.body.columnId : task.columnId;
    task.version += 1;
    await task.save();

    req.app.get("io").emit("task:updated", task);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    req.app.get("io").emit("task:deleted", { id: task._id, boardId: task.boardId });
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};