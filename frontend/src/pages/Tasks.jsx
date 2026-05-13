import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DndContext,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import api from "../services/api";

function SortableTaskCard({
  task,
  isAdmin,
  editTask,
  deleteTask,
  markDone
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: task._id
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    padding: "16px",
    borderRadius: "18px",
    background: "rgba(255,255,255,0.08)",
    marginBottom: "14px",
    cursor: "grab"
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <h3>{task.title}</h3>

      <p style={{ color: "#cbd5e1", marginTop: "8px" }}>
        {task.description}
      </p>

      <p style={{ color: "#60a5fa", marginTop: "8px" }}>
        Assigned: {task.assignedTo?.name || "Unassigned"}
      </p>

      <p style={{ color: "#c084fc", marginTop: "6px" }}>
        Created By: {task.createdBy?.name || "Unknown"}
      </p>

      <p style={{ color: "#f59e0b", marginTop: "8px" }}>
        Priority: {task.priority?.toUpperCase()}
      </p>

      <p style={{ color: "#94a3b8", marginTop: "8px" }}>
        Due: {task.deadline?.split("T")[0] || "No deadline"}
      </p>

      <p style={{ color: "#10b981", marginTop: "8px" }}>
        Status: {task.status}
      </p>

      {isAdmin && (
        <>
          <button
            className="button"
            style={{ marginTop: "12px" }}
            onClick={() => editTask(task)}
          >
            Edit
          </button>

          <button
            className="button"
            style={{
              marginTop: "10px",
              background: "linear-gradient(135deg,#ef4444,#dc2626)"
            }}
            onClick={() => deleteTask(task._id)}
          >
            Delete
          </button>
        </>
      )}

      {task.status !== "done" && (
        <button
          className="button"
          style={{
            marginTop: "10px",
            background: "linear-gradient(135deg,#10b981,#059669)"
          }}
          onClick={() => markDone(task._id)}
        >
          Mark Done
        </button>
      )}
    </div>
  );
}

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [viewMode, setViewMode] = useState("list");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [project, setProject] = useState("");
  const [assignedTo, setAssignedTo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [deadline, setDeadline] = useState("");

  const [search, setSearch] = useState("");

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const isAdmin = user?.role === "admin";

  const sensors = useSensors(
    useSensor(PointerSensor)
  );

  const fetchTasks = async () => {
    const res = await api.get("/tasks", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setTasks(res.data);
  };

  const fetchProjects = async () => {
    const res = await api.get("/projects", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setProjects(res.data);
  };

  const fetchUsers = async () => {
    if (!isAdmin) return;

    const res = await api.get("/users", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    setUsers(res.data);
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchUsers();
  }, []);

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDescription("");
    setProject("");
    setAssignedTo("");
    setPriority("medium");
    setDeadline("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = {
      title,
      description,
      project,
      priority,
      deadline,
      assignedTo: isAdmin ? assignedTo : user._id
    };

    if (editingId) {
      await api.put(`/tasks/${editingId}`, data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    } else {
      await api.post("/tasks", data, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    resetForm();
    fetchTasks();
  };

  const editTask = (task) => {
    setEditingId(task._id);
    setTitle(task.title || "");
    setDescription(task.description || "");
    setProject(task.project?._id || "");
    setAssignedTo(task.assignedTo?._id || "");
    setPriority(task.priority || "medium");
    setDeadline(task.deadline?.split("T")[0] || "");
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    fetchTasks();
  };

  const markDone = async (id) => {
    await api.put(
      `/tasks/${id}`,
      { status: "done" },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchTasks();
  };

  const updateTaskStatus = async (id, status) => {
    await api.put(
      `/tasks/${id}`,
      { status },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchTasks();
  };

  const filteredTasks = tasks.filter((task) =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  const todoTasks = filteredTasks.filter(
    (t) => t.status === "todo" || t.status === "pending"
  );

  const progressTasks = filteredTasks.filter(
    (t) => t.status === "inprogress"
  );

  const doneTasks = filteredTasks.filter(
    (t) => t.status === "done" || t.status === "completed"
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    await updateTaskStatus(taskId, newStatus);
  };

  return (
    <div className="page-container">
      <div className="glass navbar">
        <h1 className="brand">Tasks Workspace</h1>

        <div className="nav-links">
          <button
            className="nav-btn"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <button
            className="nav-btn"
            onClick={() =>
              setViewMode(
                viewMode === "list" ? "kanban" : "list"
              )
            }
          >
            {viewMode === "list"
              ? "Kanban View"
              : "List View"}
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

      <input
        className="input"
        placeholder="Search task..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {isAdmin && (
        <div className="glass form-box">
          <h2>
            {editingId ? "Edit Task" : "Create Task"}
          </h2>

          <form onSubmit={handleSubmit}>
            <input
              className="input"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              className="input"
              placeholder="Description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
            />

            <select
              className="input"
              value={project}
              onChange={(e) => setProject(e.target.value)}
            >
              <option value="">Select Project</option>

              {projects.map((p) => (
                <option
                  key={p._id}
                  value={p._id}
                >
                  {p.title}
                </option>
              ))}
            </select>

            <select
              className="input"
              value={assignedTo}
              onChange={(e) =>
                setAssignedTo(e.target.value)
              }
            >
              <option value="">Assign User</option>

              {users.map((u) => (
                <option
                  key={u._id}
                  value={u._id}
                >
                  {u.name}
                </option>
              ))}
            </select>

            <select
              className="input"
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              className="input"
              type="date"
              value={deadline}
              onChange={(e) =>
                setDeadline(e.target.value)
              }
            />

            <button className="button">
              {editingId
                ? "Update Task"
                : "Create Task"}
            </button>
          </form>
        </div>
      )}

      {viewMode === "list" ? (
        <div className="card-grid">
          {filteredTasks.map((task) => (
            <SortableTaskCard
              key={task._id}
              task={task}
              isAdmin={isAdmin}
              editTask={editTask}
              deleteTask={deleteTask}
              markDone={markDone}
            />
          ))}
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragEnd={handleDragEnd}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "24px",
              marginTop: "30px"
            }}
          >
            <div className="glass quick-card">
              <h2>Todo</h2>
              <SortableContext
                items={todoTasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                {todoTasks.map((task) => (
                  <SortableTaskCard
                    key={task._id}
                    task={task}
                    isAdmin={isAdmin}
                    editTask={editTask}
                    deleteTask={deleteTask}
                    markDone={markDone}
                  />
                ))}
              </SortableContext>
            </div>

            <div
              className="glass quick-card"
              id="inprogress"
            >
              <h2>In Progress</h2>
              <SortableContext
                items={progressTasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                {progressTasks.map((task) => (
                  <SortableTaskCard
                    key={task._id}
                    task={task}
                    isAdmin={isAdmin}
                    editTask={editTask}
                    deleteTask={deleteTask}
                    markDone={markDone}
                  />
                ))}
              </SortableContext>
            </div>

            <div
              className="glass quick-card"
              id="done"
            >
              <h2>Done</h2>
              <SortableContext
                items={doneTasks.map((t) => t._id)}
                strategy={verticalListSortingStrategy}
              >
                {doneTasks.map((task) => (
                  <SortableTaskCard
                    key={task._id}
                    task={task}
                    isAdmin={isAdmin}
                    editTask={editTask}
                    deleteTask={deleteTask}
                    markDone={markDone}
                  />
                ))}
              </SortableContext>
            </div>
          </div>
        </DndContext>
      )}
    </div>
  );
}

export default Tasks;