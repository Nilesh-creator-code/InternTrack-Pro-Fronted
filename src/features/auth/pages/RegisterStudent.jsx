import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "./AuthPage.css";

const EDUCATION_STATUS_OPTIONS = [
  { value: "SCHOOL", label: "School" },
  { value: "DIPLOMA", label: "Diploma" },
  { value: "UNDERGRADUATE", label: "Undergraduate" },
  { value: "POSTGRADUATE", label: "Postgraduate" },
  { value: "PHD", label: "PhD" },
  { value: "OTHER", label: "Other" },
];

const selectStyle = {
  background: "rgba(255, 255, 255, 0.08)",
  border: "1px solid rgba(255, 255, 255, 0.15)",
  borderRadius: "12px",
  padding: "0.85rem 1rem",
  color: "#fff",
  fontSize: "1rem",
  fontFamily: "inherit",
  outline: "none",
  width: "100%",
  transition: "all 0.3s ease",
  cursor: "pointer",
};

export const RegisterStudent = () => {
  const navigate = useNavigate();
  const { loading, handleRegisterStudent } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    department: "",
    contactNumber: "",
    collegeName: "",
    email: "",
    password: "",
    confirmPassword: "",
    educationStatus: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = "Name is required";
    if (!formData.contactNumber.trim()) {
      errs.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      errs.contactNumber = "Enter a valid 10-digit number";
    }
    if (!formData.email.trim()) {
      errs.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errs.email = "Enter a valid email";
    }
    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    if (!formData.educationStatus) {
      errs.educationStatus = "Education status is required";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      name: formData.name,
      contactNumber: formData.contactNumber,
      userContactNumber: formData.contactNumber, // fallback to match Industry DTO patterns
      contact_number: formData.contactNumber,    // fallback to match SQL strict schemas
      email: formData.email,
      password: formData.password,
      educationStatus: formData.educationStatus,
      role: "STUDENT"
    };
    
    if (formData.department.trim()) payload.department = formData.department.trim();
    if (formData.collegeName.trim()) payload.collegeName = formData.collegeName.trim();
    
    console.log("Submitting Student payload:", payload);
    await handleRegisterStudent(payload);
  };

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: "520px" }}>
        <div className="auth-header">
          <h2>🎓 Student Registration</h2>
          <p>Create your student account to explore internships</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Name */}
          <div className="form-group">
            <label>Full Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Email */}
          <div className="form-group">
            <label>Email Address *</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Department */}
          <div className="form-group">
            <label>Department</label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              placeholder="e.g., Computer Science"
            />
          </div>

          {/* Contact Number */}
          <div className="form-group">
            <label>Contact Number *</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              placeholder="10-digit mobile number"
            />
            {errors.contactNumber && (
              <span className="error-text">{errors.contactNumber}</span>
            )}
          </div>

          {/* College Name */}
          <div className="form-group">
            <label>College Name</label>
            <input
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              placeholder="Your college name (optional)"
            />
          </div>

          {/* Education Status */}
          <div className="form-group">
            <label>Education Status *</label>
            <select
              name="educationStatus"
              value={formData.educationStatus}
              onChange={handleChange}
              style={selectStyle}
            >
              <option value="" style={{ color: "black" }}>
                — Select Status —
              </option>
              {EDUCATION_STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value} style={{ color: "black" }}>
                  {opt.label}
                </option>
              ))}
            </select>
            {errors.educationStatus && (
              <span className="error-text">{errors.educationStatus}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-group">
            <label>Password *</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Min. 8 characters"
            />
            {errors.password && (
              <span className="error-text">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-group">
            <label>Confirm Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
            {errors.confirmPassword && (
              <span className="error-text">{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Create Student Account"}
          </button>
        </form>

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
