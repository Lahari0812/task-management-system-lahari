import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("active");
  const [priority, setPriority] = useState("medium");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";

  const fetchProjects = async () => {
    const res = await api.get("/projects", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setProjects(res.data);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setStartDate("");
    setDueDate("");
    setStatus("active");
    setPriority("medium");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      description,
      startDate,
      dueDate,
      status,
      priority,
      members: [],
    };

    if (editingId) {
      await api.put(`/projects/${editingId}`, data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } else {
      await api.post("/projects", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }

    resetForm();
    fetchProjects();
  };

  const deleteProject = async (id) => {
    await api.delete(`/projects/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchProjects();
  };

  const editProject = (project) => {
    setEditingId(project._id);
    setTitle(project.title || "");
    setDescription(project.description || "");
    setStartDate(project.startDate?.split("T")[0] || "");
    setDueDate(project.dueDate?.split("T")[0] || "");
    setStatus(project.status || "active");
    setPriority(project.priority || "medium");
  };

  const getPriorityColor = (priority) => {
    if (priority === "high") return "#ef4444";
    if (priority === "medium") return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className="page-container">
      <div className="glass navbar">
        <h1 className="brand">Projects Workspace</h1>

        <div className="nav-links">
          <button className="nav-btn" onClick={() => navigate("/dashboard")}>
            Dashboard
          </button>

          <button
            className="nav-btn logout-btn"
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {isAdmin && (
        <div className="glass form-box">
          <h2 className="section-title">
            {editingId ? "Edit Project" : "Create New Project"}
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              className="input"
              placeholder="Project Name"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="input"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              className="input"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            <input
              className="input"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />

            <select
              className="input"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="active">Active</option>
              <option value="completed">Completed</option>
            </select>

            <select
              className="input"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
            </select>

            <button className="button" type="submit">
              {editingId ? "Update Project" : "Create Project"}
            </button>
          </form>
        </div>
      )}

      <div className="card-grid">
        {projects.map((project) => (
          <div key={project._id} className="glass quick-card">
            <h2>{project.title}</h2>

            <p style={{ color: "#cbd5e1", marginTop: "10px" }}>
              {project.description}
            </p>

            <p
              style={{
                marginTop: "14px",
                color: getPriorityColor(project.priority),
                fontWeight: "700",
              }}
            >
              Priority: {project.priority?.toUpperCase()}
            </p>

            <p style={{ color: "#94a3b8", marginTop: "8px" }}>
              Status: {project.status?.toUpperCase()}
            </p>

            <p style={{ color: "#94a3b8", marginTop: "8px" }}>
              Due: {project.dueDate?.split("T")[0]}
            </p>

            {isAdmin && (
              <>
                <button
                  className="button"
                  style={{ marginTop: "20px" }}
                  onClick={() => editProject(project)}
                >
                  Edit Project
                </button>

                <button
                  className="button"
                  style={{
                    marginTop: "12px",
                    background:
                      "linear-gradient(135deg, #ef4444, #dc2626)",
                  }}
                  onClick={() => deleteProject(project._id)}
                >
                  Delete Project
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Projects;