const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} = require("../controllers/taskController");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createTask
);

router.get(
  "/",
  authMiddleware,
  getTasks
);

router.put(
  "/:id",
  authMiddleware,
  updateTask
);

router.delete(
  "/:id",
  authMiddleware,
  deleteTask
);

module.exports = router;