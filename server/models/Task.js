const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  boardId: { type: mongoose.Schema.Types.ObjectId, ref: "Board", required: true },
  columnId: { type: String, required: true },
  title: { type: String, required: true },
  version: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);