const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: __dirname + "/.env" });

const boardRoutes = require("./routes/boardRoutes");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
app.set("io", io);

app.use(cors());
app.use(express.json());

app.use("/api/boards", boardRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);
  socket.on("disconnect", () => console.log("Client disconnected:", socket.id));
});

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
  })
  .catch((err) => console.error("MongoDB connection error:", err));