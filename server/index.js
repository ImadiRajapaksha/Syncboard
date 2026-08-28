const express = require("express");
const cors = require("cors");
const { boards } = require("./data/mockData");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SyncBoard API is running");
});

app.get("/api/boards", (req, res) => {
  res.json(boards);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});