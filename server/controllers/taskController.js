const Task = require("../models/Task");

exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
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
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};