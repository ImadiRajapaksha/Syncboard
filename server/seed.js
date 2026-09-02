require("dotenv").config();
const mongoose = require("mongoose");
const Board = require("./models/Board");
const Task = require("./models/Task");

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  await Board.deleteMany({});
  await Task.deleteMany({});

  const board = await Board.create({
    name: "SyncBoard",
    columns: [
      { id: "todo", title: "To Do" },
      { id: "doing", title: "Doing" },
      { id: "done", title: "Done" },
    ],
  });

  await Task.create([
    { boardId: board._id, columnId: "todo", title: "Design wireframes" },
    { boardId: board._id, columnId: "todo", title: "Set up repo" },
    { boardId: board._id, columnId: "doing", title: "Build Board component" },
  ]);

  console.log("Seeded! Board ID:", board._id.toString());
  await mongoose.disconnect();
}

seed();