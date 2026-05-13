import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/forgot-password", {
        email,
        newPassword,
      });

      alert("Password reset successful");
      navigate("/");
    } catch {
      alert("Reset failed");
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="glass auth-card">
        <h1 className="auth-title">Reset Password</h1>

        <p className="auth-subtitle">
          Enter your email and set a new password
        </p>

        <form onSubmit={handleReset}>
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
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />

          <button className="button" type="submit">
            Reset Password
          </button>
        </form>

        <p className="link-text">
          <Link to="/">
            <span>Back to Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ForgotPassword;