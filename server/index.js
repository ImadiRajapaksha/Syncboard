require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const boardRoutes = require("./routes/boardRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/boards", boardRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("Connected to MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });