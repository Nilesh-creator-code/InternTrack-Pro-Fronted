import React, { useState } from "react";
import "../pages/AuthPage.css";

export const IndustryRegistrationForm = ({ email, verificationToken, onRegister, loading }) => {
  const [formData, setFormData] = useState({
    companyName: "",
    industryType: "",
    contactNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.companyName) newErrors.companyName = "Company Name is required";
    if (!formData.industryType) newErrors.industryType = "Industry Type is required";
    
    if (!formData.contactNumber) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(formData.contactNumber)) {
      newErrors.contactNumber = "Please enter a valid 10-digit number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onRegister({
        email,
        companyName: formData.companyName,
        industryType: formData.industryType,
        contactNumber: formData.contactNumber,
        password: formData.password,
        verificationToken // from verify-otp API
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <div className="form-group">
        <label>Company Name</label>
        <input
          type="text"
          name="companyName"
          value={formData.companyName}
          onChange={handleInputChange}
          placeholder="Acme Corp"
        />
        {errors.companyName && <span className="error-text">{errors.companyName}</span>}
      </div>

      <div className="form-group">
        <label>Industry Type</label>
        <input
          type="text"
          name="industryType"
          value={formData.industryType}
          onChange={handleInputChange}
          placeholder="e.g., Software, Manufacturing"
        />
        {errors.industryType && <span className="error-text">{errors.industryType}</span>}
      </div>

      <div className="form-group">
        <label>Contact Number</label>
        <input
          type="text"
          name="contactNumber"
          value={formData.contactNumber}
          onChange={handleInputChange}
          placeholder="10-digit mobile number"
        />
        {errors.contactNumber && <span className="error-text">{errors.contactNumber}</span>}
      </div>

      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="••••••••"
        />
        {errors.password && <span className="error-text">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label>Confirm Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleInputChange}
          placeholder="••••••••"
        />
        {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
      </div>

      <button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? "Registering..." : "Complete Registration"}
      </button>
    </form>
  );
};
