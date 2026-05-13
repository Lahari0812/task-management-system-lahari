const Task = require("../models/Task");

const createTask = async (req, res) => {
  try {
    const {
      title,
      description,
      assignedTo,
      project,
      deadline,
      priority
    } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      createdBy: req.user.id,
      project,
      deadline,
      priority
    });

    res.status(201).json(task);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTasks = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "member") {
      query = {
        assignedTo: req.user.id
      };
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email")
      .populate("project", "title")
      .sort({ createdAt: -1 });

    res.json(tasks);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    if (
      req.user.role === "member" &&
      task.assignedTo.toString() !== req.user.id
    ) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(updatedTask);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete tasks"
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.json({
      message: "Task deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};