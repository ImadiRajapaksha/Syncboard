const express = require("express");
const router = express.Router();
const boardController = require("../controllers/boardController");
const auth = require("../middleware/authmiddleware");

router.get("/", auth, boardController.getAllBoards);
router.get("/:id", auth, boardController.getBoardById);
router.get("/:id/columns", auth, boardController.getBoardColumns);

module.exports = router;