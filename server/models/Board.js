const mongoose = require("mongoose");

const columnSchema = new mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
});

const boardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  columns: [columnSchema],
});

module.exports = mongoose.model("Board", boardSchema);