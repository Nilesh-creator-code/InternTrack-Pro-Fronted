import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AuthPage.css";
import "./RegisterIndustry.css";
import {
  sendIndustryOtp,
  verifyIndustryOtp,
  registerIndustry,
} from "../services/authApi";
import { getApiErrorMessage } from "../services/apiError";

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

export const RegisterIndustry = () => {
  const navigate = useNavigate();

  // ── Step tracking ──────────────────────────────────────────
  // step 1: email + send otp
  // step 2: otp input + verify
  // step 3: full registration form
  const [step, setStep] = useState(1);

  // ── OTP state ──────────────────────────────────────────────
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verificationToken, setVerificationToken] = useState("");

  // ── Registration form state ────────────────────────────────
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    userContactNumber: "",
    name: "",
    industryContactNumber: "",
    title: "",
    address: "",
    aboutUs: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});

  // ── Loading states ─────────────────────────────────────────
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [registering, setRegistering] = useState(false);

  // ── Handlers ───────────────────────────────────────────────

  const handleSendOtp = async () => {
    if (!email.trim()) return setEmailError("Email is required");
    if (!/\S+@\S+\.\S+/.test(email)) return setEmailError("Enter a valid email");
    setEmailError("");
    setSendingOtp(true);
    try {
      await sendIndustryOtp(email);
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      if (err.response) {
        const msg = getApiErrorMessage(err, "Failed to send OTP");
        setEmailError(msg);
        toast.error(msg);
      } else {
        toast.error(getApiErrorMessage(err, "Failed to send OTP"));
      }
    } finally {
      setSendingOtp(false);
    }
  };


  const handleVerifyOtp = async () => {
    if (!otp.trim()) return setOtpError("OTP is required");
    if (otp.length < 4) return setOtpError("Enter a valid OTP");
    setOtpError("");
    setVerifyingOtp(true);
    try {
      // Pass email and otp as separate query params — matches @RequestParam on backend
      const res = await verifyIndustryOtp(email, otp);
      const { verified, verificationToken: token } = res.data;

      if (!verified) {
        toast.error("OTP verification failed. Please try again.");
        return;
      }

      // Cache in sessionStorage so it survives potential re-renders
      sessionStorage.setItem("industry_verificationToken", token);
      sessionStorage.setItem("industry_email", email);

      setVerificationToken(token);
      toast.success("OTP verified! Fill in your company details.");
      setStep(3);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Invalid or expired OTP"));
    } finally {
      setVerifyingOtp(false);
    }
  };


  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const errs = {};
    if (!formData.password) {
      errs.password = "Password is required";
    } else if (formData.password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    if (!formData.userContactNumber) {
      errs.userContactNumber = "Contact number is required";
    } else if (!/^[0-9]{10}$/.test(formData.userContactNumber)) {
      errs.userContactNumber = "Enter a valid 10-digit number";
    }
    if (!formData.name.trim()) errs.name = "Industry name is required";
    if (!formData.industryContactNumber) {
      errs.industryContactNumber = "Industry contact number is required";
    } else if (!/^[0-9]{10}$/.test(formData.industryContactNumber)) {
      errs.industryContactNumber = "Enter a valid 10-digit number";
    }
    if (!formData.title.trim()) errs.title = "Title is required";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setRegistering(true);
    try {
      await registerIndustry({
        email,
        password: formData.password,
        userContactNumber: formData.userContactNumber,
        name: formData.name,
        industryContactNumber: formData.industryContactNumber,
        title: formData.title,
        address: formData.address,
        aboutUs: formData.aboutUs,
        description: formData.description,
        verificationToken,
      });
      toast.success("Industry registered successfully!");
      navigate("/login");
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Registration failed"));
    } finally {
      setRegistering(false);
    }
  };

  // ── Render ─────────────────────────────────────────────────

  return (
    <div className="auth-container">
      <div className="auth-card industry-reg-card">

        {/* ── Header ── */}
        <div className="auth-header">
          <h2>🏢 Industry Registration</h2>
          <div className="reg-steps">
            <div className={`reg-step ${step >= 1 ? "active" : ""} ${step > 1 ? "done" : ""}`}>
              <span>1</span><p>Email</p>
            </div>
            <div className={`reg-step-line ${step > 1 ? "done" : ""}`} />
            <div className={`reg-step ${step >= 2 ? "active" : ""} ${step > 2 ? "done" : ""}`}>
              <span>2</span><p>Verify OTP</p>
            </div>
            <div className={`reg-step-line ${step > 2 ? "done" : ""}`} />
            <div className={`reg-step ${step >= 3 ? "active" : ""}`}>
              <span>3</span><p>Details</p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            STEP 1 — Email & Send OTP
        ══════════════════════════════════════ */}
        {step === 1 && (
          <div className="auth-form">
            <div className="form-group">
              <label>Business Email *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(""); }}
                placeholder="company@example.com"
                disabled={sendingOtp}
              />
              {emailError && <span className="error-text">{emailError}</span>}
            </div>
            <button
              type="button"
              className="auth-submit-btn"
              onClick={handleSendOtp}
              disabled={sendingOtp}
            >
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>

            <div className="auth-footer">
              <p>
                Already have an account?{" "}
                <span className="auth-toggle-link" onClick={() => navigate("/login")}>
                  Login
                </span>
              </p>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════
            STEP 2 — Verify OTP
        ══════════════════════════════════════ */}
        {step === 2 && (
          <div className="auth-form">
            <p className="otp-hint">
              A verification code was sent to <strong>{email}</strong>
            </p>

            {/* Email (read-only) */}
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} disabled className="input-readonly" />
            </div>

            {/* OTP input — appears after sending */}
            <div className="form-group otp-input-reveal">
              <label>Enter OTP *</label>
              <input
                type="text"
                value={otp}
                onChange={(e) => { setOtp(e.target.value); if (otpError) setOtpError(""); }}
                placeholder="Enter the OTP from your email"
                maxLength={8}
                disabled={verifyingOtp}
              />
              {otpError && <span className="error-text">{otpError}</span>}
            </div>

            <button
              type="button"
              className="auth-submit-btn"
              onClick={handleVerifyOtp}
              disabled={verifyingOtp}
            >
              {verifyingOtp ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              className="otp-resend-btn"
              onClick={() => { setStep(1); setOtp(""); setOtpError(""); }}
            >
              ← Change Email / Resend OTP
            </button>
          </div>
        )}

        {/* ══════════════════════════════════════
            STEP 3 — Full Registration Form
        ══════════════════════════════════════ */}
        {step === 3 && (
          <form className="auth-form" onSubmit={handleRegister} noValidate>

            <p className="otp-hint">
              Registering as <strong>{email}</strong>
            </p>

            {/* ── User / Auth Fields ── */}
            <div className="reg-section-label">Account Details</div>

            <div className="form-group">
              <label>Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleFormChange}
                placeholder="Min. 8 characters"
              />
              {formErrors.password && <span className="error-text">{formErrors.password}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleFormChange}
                placeholder="••••••••"
              />
              {formErrors.confirmPassword && <span className="error-text">{formErrors.confirmPassword}</span>}
            </div>

            <div className="form-group">
              <label>Your Contact Number *</label>
              <input
                type="text"
                name="userContactNumber"
                value={formData.userContactNumber}
                onChange={handleFormChange}
                placeholder="10-digit number"
              />
              {formErrors.userContactNumber && <span className="error-text">{formErrors.userContactNumber}</span>}
            </div>

            {/* ── Industry Fields ── */}
            <div className="reg-section-label">Company Details</div>

            <div className="form-group">
              <label>Industry / Company Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                placeholder="Acme Corp"
              />
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}
            </div>

            <div className="form-group">
              <label>Industry Contact Number *</label>
              <input
                type="text"
                name="industryContactNumber"
                value={formData.industryContactNumber}
                onChange={handleFormChange}
                placeholder="10-digit number"
              />
              {formErrors.industryContactNumber && <span className="error-text">{formErrors.industryContactNumber}</span>}
            </div>

            <div className="form-group">
              <label>Title / Designation *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                placeholder="e.g., HR Manager"
              />
              {formErrors.title && <span className="error-text">{formErrors.title}</span>}
            </div>

            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleFormChange}
                placeholder="Company address (optional)"
              />
            </div>

            <div className="form-group">
              <label>About Us</label>
              <textarea
                name="aboutUs"
                value={formData.aboutUs}
                onChange={handleFormChange}
                placeholder="Brief introduction about your company..."
                rows={3}
                className="form-textarea"
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                placeholder="What does your company do?"
                rows={3}
                className="form-textarea"
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={registering}>
              {registering ? "Registering..." : "Complete Registration"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};
