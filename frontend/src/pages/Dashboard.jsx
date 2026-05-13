import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import api from "../services/api";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const projectRes = await api.get("/projects", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const taskRes = await api.get("/tasks", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProjects(projectRes.data);
      setTasks(taskRes.data);
    } catch (error) {
      console.log(error);
    }
  };

  const completedTasks = tasks.filter(
    (task) => task.status === "done"
  ).length;

  const pendingTasks = tasks.filter(
    (task) => task.status !== "done"
  ).length;

  const overdueTasks = tasks.filter(
    (task) =>
      task.deadline &&
      new Date(task.deadline) < new Date() &&
      task.status !== "done"
  ).length;

  const activeProjects = projects.filter(
    (project) => project.status === "active"
  ).length;

  const completedProjects = projects.filter(
    (project) => project.status === "completed"
  ).length;

  const productivity =
    tasks.length > 0
      ? Math.round((completedTasks / tasks.length) * 100)
      : 0;

  const taskData = [
    { name: "Completed", value: completedTasks },
    { name: "Pending", value: pendingTasks },
  ];

  const COLORS = ["#10b981", "#f59e0b"];

  return (
    <div className="page-container">
      <div className="glass navbar">
        <h1 className="brand">TaskFlow Pro</h1>

        <div className="nav-links">
          <span style={{ color: "#94a3b8", fontWeight: "600" }}>
            {user?.role?.toUpperCase()}
          </span>

          <button className="nav-btn logout-btn" onClick={logout}>
            Logout
          </button>
        </div>
      </div>

      <div className="glass dashboard-hero">
        <h1 className="dashboard-title">
          Welcome back, {user?.name} 👋
        </h1>

        <p className="dashboard-subtitle">
          Real-time analytics for your workspace
        </p>

        <div
          style={{
            display: "flex",
            gap: "16px",
            marginTop: "25px",
            flexWrap: "wrap",
          }}
        >
          <button
            className="button"
            style={{ width: "220px" }}
            onClick={() => navigate("/projects")}
          >
            + Manage Projects
          </button>

          <button
            className="button"
            style={{
              width: "220px",
              background: "linear-gradient(135deg, #10b981, #059669)",
            }}
            onClick={() => navigate("/tasks")}
          >
            + Manage Tasks
          </button>
        </div>
      </div>

      <div className="stats-grid">
        <div className="glass stat-card">
          <div className="stat-number">{projects.length}</div>
          <div className="stat-label">Total Projects</div>
        </div>

        <div className="glass stat-card">
          <div className="stat-number">{tasks.length}</div>
          <div className="stat-label">Total Tasks</div>
        </div>

        <div className="glass stat-card">
          <div className="stat-number">{overdueTasks}</div>
          <div className="stat-label">Overdue Tasks</div>
        </div>

        <div className="glass stat-card">
          <div className="stat-number">{productivity}%</div>
          <div className="stat-label">Productivity</div>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "24px",
          marginTop: "30px",
        }}
      >
        <div className="glass quick-card">
          <h2 className="section-title">Task Completion</h2>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey="value"
              >
                {taskData.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass quick-card">
          <h2 className="section-title">Project Summary</h2>

          <div style={{ marginTop: "40px" }}>
            <p style={{ fontSize: "20px", marginBottom: "20px" }}>
              Active Projects: {activeProjects}
            </p>

            <p style={{ fontSize: "20px", marginBottom: "20px" }}>
              Completed Projects: {completedProjects}
            </p>

            <p style={{ fontSize: "20px" }}>
              Pending Tasks: {pendingTasks}
            </p>
          </div>
        </div>
      </div>

      <div className="glass quick-card" style={{ marginTop: "30px" }}>
        <h2 className="section-title">Recent Activity</h2>

        {tasks.length === 0 ? (
          <p style={{ color: "#cbd5e1" }}>No activity yet.</p>
        ) : (
          tasks.slice(0, 5).map((task) => (
            <div
              key={task._id}
              style={{
                padding: "16px",
                marginBottom: "14px",
                borderRadius: "14px",
                background: "rgba(255,255,255,0.06)",
              }}
            >
              <h3>{task.title}</h3>
              <p style={{ color: "#cbd5e1" }}>
                {task.status.toUpperCase()} • {task.priority?.toUpperCase()}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;