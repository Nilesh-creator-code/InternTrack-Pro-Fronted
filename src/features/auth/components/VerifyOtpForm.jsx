import React, { useState } from "react";
import "../pages/AuthPage.css";

export const VerifyOtpForm = ({ email, onVerify, loading }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    if (!otp) {
      setError("OTP is required");
      return false;
    }
    if (otp.length < 4) {
      setError("OTP seems to be invalid");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onVerify(email, otp);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="auth-form" noValidate>
      <p style={{ color: "rgba(255, 255, 255, 0.75)", marginBottom: "1rem", fontSize: "0.9rem" }}>
        Enter the verification code sent to <strong>{email}</strong>
      </p>

      <div className="form-group">
        <label>OTP Code</label>
        <input
          type="text"
          value={otp}
          onChange={(e) => {
            setOtp(e.target.value);
            if (error) setError("");
          }}
          placeholder="Enter OTP"
          disabled={loading}
        />
        {error && <span className="error-text">{error}</span>}
      </div>

      <button type="submit" className="auth-submit-btn" disabled={loading}>
        {loading ? "Verifying..." : "Verify OTP"}
      </button>
    </form>
  );
};
