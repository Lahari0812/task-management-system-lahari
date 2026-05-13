import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("member");

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
      await api.post("/auth/signup", {
        name,
        email,
        password,
        role,
      });

      navigate("/");
    } catch {
      alert("Signup failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass auth-card">
        <h1 className="auth-title">Create Account</h1>

        <p className="auth-subtitle">
          Start managing your workflow beautifully
        </p>

        <form onSubmit={handleSubmit}>
          <input
            className="input"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

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

          <select
            className="input"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>

          <button className="button" type="submit">
            Create Account
          </button>
        </form>

        <p className="link-text">
          Already have an account?{" "}
          <Link to="/">
            <span>Sign in</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;