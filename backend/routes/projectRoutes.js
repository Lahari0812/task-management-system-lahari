const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const roleMiddleware = require("../middleware/roleMiddleware");

const {
  createProject,
  getProjects,
  updateProject,
  deleteProject
} = require("../controllers/projectController");

router.post(
  "/",
  authMiddleware,
  roleMiddleware("admin"),
  createProject
);

router.get(
  "/",
  authMiddleware,
  getProjects
);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  updateProject
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware("admin"),
  deleteProject
);

module.exports = router;