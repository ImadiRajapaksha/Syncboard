const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");

router.get("/", boardController.getAllBoards);
router.get("/:id", boardController.getBoardById);
router.get("/:id/columns", boardController.getBoardColumns);

module.exports = router;