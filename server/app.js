const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

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
  socket.on("disconnect", () => {});
});

module.exports = { app, server };