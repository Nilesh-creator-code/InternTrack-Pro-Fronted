import React from "react";
import { useNavigate } from "react-router-dom";
import "./AuthPage.css";
import "./RegisterRolePicker.css";

export const RegisterRolePicker = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card picker-card">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Choose how you want to register on the platform</p>
        </div>

        <div className="role-picker-grid">
          {/* Student Card */}
          <button
            className="role-picker-btn"
            onClick={() => navigate("/auth")}
          >
            <div className="role-icon">🎓</div>
            <div className="role-info">
              <h3>Student</h3>
              <p>Discover and apply for internships</p>
            </div>
            <span className="role-arrow">→</span>
          </button>

          {/* Industry Card */}
          <button
            className="role-picker-btn"
            onClick={() => navigate("/register-industry")}
          >
            <div className="role-icon">🏢</div>
            <div className="role-info">
              <h3>Industry</h3>
              <p>Post internships and find talent</p>
            </div>
            <span className="role-arrow">→</span>
          </button>
        </div>

        <div className="auth-footer">
          <p>
            Already have an account?{" "}
            <span className="auth-toggle-link" onClick={() => navigate("/login")}>
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};
