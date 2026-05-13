const Project = require("../models/Project");

const createProject = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      dueDate,
      status,
      priority,
      members
    } = req.body;

    const project = await Project.create({
      title,
      description,
      startDate,
      dueDate,
      status,
      priority,
      members,
      createdBy: req.user.id
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getProjects = async (req, res) => {
  try {
    let query = {};

    if (req.user.role === "member") {
      query = {
        members: req.user.id
      };
    }

    const projects = await Project.find(query)
      .populate("members", "name email")
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.json(projects);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can update projects"
      });
    }

    const project = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProject = async (req, res) => {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "Only admin can delete projects"
      });
    }

    await Project.findByIdAndDelete(req.params.id);

    res.json({
      message: "Project deleted successfully"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProject,
  getProjects,
  updateProject,
  deleteProject
};