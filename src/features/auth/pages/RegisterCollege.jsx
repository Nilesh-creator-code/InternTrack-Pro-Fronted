import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./AuthPage.css";
import "./RegisterIndustry.css";
import {
  registerCollege,
  sendCollegeRegistrationOtp,
  verifyCollegeRegistrationOtp,
} from "../services/authApi";
import { getApiErrorMessage } from "../services/apiError";

const registrationStorageKeys = [
  "college_registration_email",
  "college_registration_verificationToken",
];

const clearRegistrationStorage = () => {
  registrationStorageKeys.forEach((key) => sessionStorage.removeItem(key));
};

export const RegisterCollege = () => {
  const navigate = useNavigate();
  const requestInProgress = useRef(false);
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [verificationToken, setVerificationToken] = useState("");
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
    userContactNumber: "",
    name: "",
    collegeContactNumber: "",
    address: "",
    aboutUs: "",
    description: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [sendingOtp, setSendingOtp] = useState(false);
  const [verifyingOtp, setVerifyingOtp] = useState(false);
  const [registering, setRegistering] = useState(false);

  const handleSendOtp = async () => {
    const trimmedEmail = email.trim();
    if (!trimmedEmail) return setEmailError("Email is required");
    if (!/^\S+@\S+\.\S+$/.test(trimmedEmail)) {
      return setEmailError("Enter a valid email");
    }
    if (requestInProgress.current) return;

    setEmailError("");
    requestInProgress.current = true;
    setSendingOtp(true);
    try {
      await sendCollegeRegistrationOtp(trimmedEmail);
      setEmail(trimmedEmail);
      toast.success("OTP sent to your email!");
      setStep(2);
    } catch (err) {
      const message = getApiErrorMessage(err, "Failed to send OTP");
      setEmailError(message);
      toast.error(message);
    } finally {
      requestInProgress.current = false;
      setSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    const trimmedOtp = otp.trim();
    if (!trimmedOtp) return setOtpError("OTP is required");
    if (trimmedOtp.length < 4) return setOtpError("Enter a valid OTP");
    if (requestInProgress.current) return;

    setOtpError("");
    requestInProgress.current = true;
    setVerifyingOtp(true);
    try {
      const response = await verifyCollegeRegistrationOtp(email, trimmedOtp);
      const result = response.data?.data || response.data;
      if (result?.verified !== true) {
        toast.error("OTP verification failed. Please try again.");
        return;
      }
      if (!result.verificationToken) {
        toast.error("OTP was verified, but registration authorization was not returned. Please request a new OTP.");
        return;
      }

      setVerificationToken(result.verificationToken);
      sessionStorage.setItem("college_registration_email", email);
      sessionStorage.setItem("college_registration_verificationToken", result.verificationToken);
      toast.success("OTP verified! Fill in your college details.");
      setStep(3);
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Invalid or expired OTP"));
    } finally {
      requestInProgress.current = false;
      setVerifyingOtp(false);
    }
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({ ...previous, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((previous) => ({ ...previous, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.password) {
      errors.password = "Password is required";
    } else if (formData.password.length < 8) {
      errors.password = "Password must be at least 8 characters";
    }
    if (!formData.confirmPassword) {
      errors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!formData.userContactNumber.trim()) {
      errors.userContactNumber = "Contact number is required";
    } else if (!/^[+()\d\s-]{7,20}$/.test(formData.userContactNumber.trim())) {
      errors.userContactNumber = "Enter a valid contact number";
    }
    if (!formData.name.trim()) errors.name = "College name is required";
    if (!formData.collegeContactNumber.trim()) {
      errors.collegeContactNumber = "College contact number is required";
    } else if (!/^[+()\d\s-]{7,20}$/.test(formData.collegeContactNumber.trim())) {
      errors.collegeContactNumber = "Enter a valid college contact number";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;
    if (step !== 3 || !email || !verificationToken) {
      toast.error("Verify your email before completing registration.");
      return;
    }
    if (requestInProgress.current) return;

    requestInProgress.current = true;
    setRegistering(true);
    try {
      await registerCollege({
        email,
        password: formData.password,
        userContactNumber: formData.userContactNumber.trim(),
        name: formData.name.trim(),
        collegeContactNumber: formData.collegeContactNumber.trim(),
        address: formData.address.trim(),
        aboutUs: formData.aboutUs.trim(),
        description: formData.description.trim(),
        verificationToken,
      });
      clearRegistrationStorage();
      setVerificationToken("");
      toast.success("College registered successfully!");
      navigate("/login", { replace: true, state: { role: "college" } });
    } catch (err) {
      toast.error(getApiErrorMessage(err, "Registration failed"));
    } finally {
      requestInProgress.current = false;
      setRegistering(false);
    }
  };

  const changeEmail = () => {
    clearRegistrationStorage();
    setVerificationToken("");
    setOtp("");
    setOtpError("");
    setStep(1);
  };

  return (
    <div className="auth-container">
      <div className="auth-card industry-reg-card">
        <div className="auth-header">
          <h2>🏫 College Registration</h2>
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

        {step === 1 && (
          <div className="auth-form">
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                value={email}
                onChange={(event) => { setEmail(event.target.value); if (emailError) setEmailError(""); }}
                placeholder="college@example.com"
                disabled={sendingOtp}
              />
              {emailError && <span className="error-text">{emailError}</span>}
            </div>
            <button type="button" className="auth-submit-btn" onClick={handleSendOtp} disabled={sendingOtp}>
              {sendingOtp ? "Sending OTP..." : "Send OTP"}
            </button>
            <div className="auth-footer">
              <p>Already have an account? <span className="auth-toggle-link" onClick={() => navigate("/login", { state: { role: "college" } })}>College Login</span></p>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="auth-form">
            <p className="otp-hint">A verification code was sent to <strong>{email}</strong></p>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={email} disabled className="input-readonly" />
            </div>
            <div className="form-group otp-input-reveal">
              <label>Enter OTP *</label>
              <input
                type="text"
                inputMode="numeric"
                value={otp}
                onChange={(event) => { setOtp(event.target.value); if (otpError) setOtpError(""); }}
                placeholder="Enter the OTP from your email"
                maxLength={8}
                disabled={verifyingOtp}
              />
              {otpError && <span className="error-text">{otpError}</span>}
            </div>
            <button type="button" className="auth-submit-btn" onClick={handleVerifyOtp} disabled={verifyingOtp}>
              {verifyingOtp ? "Verifying..." : "Verify OTP"}
            </button>
            <button type="button" className="otp-resend-btn" onClick={changeEmail} disabled={verifyingOtp}>
              ← Change Email / Resend OTP
            </button>
          </div>
        )}

        {step === 3 && (
          <form className="auth-form" onSubmit={handleRegister} noValidate>
            <p className="otp-hint">Registering as <strong>{email}</strong></p>
            <div className="reg-section-label">Account Information</div>
            <div className="form-group">
              <label>Password *</label>
              <input type="password" name="password" value={formData.password} onChange={handleFormChange} placeholder="Min. 8 characters" disabled={registering} />
              {formErrors.password && <span className="error-text">{formErrors.password}</span>}
            </div>
            <div className="form-group">
              <label>Confirm Password *</label>
              <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleFormChange} placeholder="Confirm your password" disabled={registering} />
              {formErrors.confirmPassword && <span className="error-text">{formErrors.confirmPassword}</span>}
            </div>
            <div className="form-group">
              <label>User Contact Number *</label>
              <input type="tel" name="userContactNumber" value={formData.userContactNumber} onChange={handleFormChange} placeholder="Your contact number" disabled={registering} />
              {formErrors.userContactNumber && <span className="error-text">{formErrors.userContactNumber}</span>}
            </div>

            <div className="reg-section-label">College Information</div>
            <div className="form-group">
              <label>College Name *</label>
              <input type="text" name="name" value={formData.name} onChange={handleFormChange} placeholder="ABC College of Engineering" disabled={registering} />
              {formErrors.name && <span className="error-text">{formErrors.name}</span>}
            </div>
            <div className="form-group">
              <label>College Contact Number *</label>
              <input type="tel" name="collegeContactNumber" value={formData.collegeContactNumber} onChange={handleFormChange} placeholder="College contact number" disabled={registering} />
              {formErrors.collegeContactNumber && <span className="error-text">{formErrors.collegeContactNumber}</span>}
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleFormChange} placeholder="College address (optional)" disabled={registering} />
            </div>
            <div className="form-group">
              <label>About Us</label>
              <textarea name="aboutUs" value={formData.aboutUs} onChange={handleFormChange} placeholder="About your college (optional)" rows={3} className="form-textarea" disabled={registering} />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea name="description" value={formData.description} onChange={handleFormChange} placeholder="Programs and learning opportunities (optional)" rows={3} className="form-textarea" disabled={registering} />
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