import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/dashboard");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass auth-card">
        <h1 className="auth-title">Welcome Back</h1>

        <p className="auth-subtitle">
          Sign in to manage your projects and tasks
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="input"
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div
            style={{
              textAlign: "right",
              marginBottom: "16px",
            }}
          >
            <Link to="/forgot-password">
              <span style={{ color: "#60a5fa", cursor: "pointer" }}>
                Forgot Password?
              </span>
            </Link>
          </div>

          <button className="button" type="submit">
            Sign In
          </button>
        </form>

        <p className="link-text">
          New here?{" "}
          <Link to="/signup">
            <span>Create account</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;