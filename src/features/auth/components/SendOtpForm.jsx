import React, { useState } from "react";
import "../pages/AuthPage.css"; // Reuse existing sleek auth styling

export const SendOtpForm = ({ onSendOtp, loading }) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!email) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return false;
    }
    setError("");
    return true;
  };


  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSendOtp(email);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError("");
          }}
          placeholder="industry@example.com"
          disabled={loading}
        />
        {error && <span className="error-text">{error}</span>}
      </div>

      <button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? "Sending OTP..." : "Send OTP"}
      </button>
    </form>
  );
};
