import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CheckCircle2,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from "lucide-react";
import {
  resetCollegePassword,
  sendCollegePasswordResetOtp,
  verifyCollegePasswordResetOtp,
} from "../services/authApi";
import { getApiErrorMessage } from "../services/apiError";

const initialForgotPasswordState = {
  forgotPasswordStep: "LOGIN",
  forgotPasswordEmail: "",
  otp: "",
  verificationToken: "",
  newPassword: "",
  confirmPassword: "",
  loading: false,
  error: "",
  success: "",
};

const getVerificationToken = (data) =>
  data?.verificationToken ||
  data?.token ||
  data?.resetToken ||
  data?.data?.verificationToken ||
  data?.data?.token ||
  data?.data?.resetToken;

const maskEmail = (email) => {
  const [name = "", domain = ""] = email.split("@");
  if (!name || !domain) return email;
  const visiblePrefix = name.slice(0, Math.min(5, name.length));
  return `${visiblePrefix}${"*".repeat(Math.max(4, name.length - visiblePrefix.length))}@${domain}`;
};

export const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("student");
    const [error, setError] = useState("");
    const [forgotState, setForgotState] = useState(initialForgotPasswordState);
    
    // De-structure correct variables
    const { loading, handleLoginStudent, handleLoginIndustry } = useAuth();
    const navigate = useNavigate();

    const updateForgotState = (changes) => {
      setForgotState((prev) => ({ ...prev, ...changes }));
    };

    const resetForgotPasswordFlow = () => {
      setForgotState(initialForgotPasswordState);
    };

    const validate = () => {
      if (!email) return setError("Email is required");
      if (!password) return setError("Password is required");
      setError("");
      return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!validate()) return;

        if (role === "student") {
            await handleLoginStudent(email, password);
        } else {
            await handleLoginIndustry(email, password);
        }
    };

    const validateForgotEmail = () => {
      const trimmedEmail = forgotState.forgotPasswordEmail.trim();
      if (!trimmedEmail) return "Email is required";
      if (!/\S+@\S+\.\S+/.test(trimmedEmail)) return "Enter a valid email address";
      return "";
    };

    const handleSendResetOtp = async (e) => {
      e.preventDefault();
      const emailError = validateForgotEmail();
      if (emailError) {
        updateForgotState({ error: emailError, success: "" });
        return;
      }

      const trimmedEmail = forgotState.forgotPasswordEmail.trim();
      updateForgotState({ loading: true, error: "", success: "" });
      try {
        await sendCollegePasswordResetOtp(trimmedEmail);
        updateForgotState({
          forgotPasswordEmail: trimmedEmail,
          forgotPasswordStep: "VERIFY_OTP",
          loading: false,
          success: "OTP sent successfully to your email.",
        });
      } catch (err) {
        updateForgotState({
          loading: false,
          error: getApiErrorMessage(err, "Unable to send OTP. Please check the email and try again."),
          success: "",
        });
      }
    };

    const handleVerifyResetOtp = async (e) => {
      e.preventDefault();
      const trimmedOtp = forgotState.otp.trim();
      if (!trimmedOtp) {
        updateForgotState({ error: "OTP is required", success: "" });
        return;
      }
      if (trimmedOtp.length < 4) {
        updateForgotState({ error: "Enter a valid OTP", success: "" });
        return;
      }

      updateForgotState({ loading: true, error: "", success: "" });
      try {
        const response = await verifyCollegePasswordResetOtp(
          forgotState.forgotPasswordEmail,
          trimmedOtp
        );
        const token = getVerificationToken(response.data);

        if (!token) {
          updateForgotState({
            loading: false,
            error: "OTP verified, but reset authorization was not returned. Please request a new OTP.",
            success: "",
          });
          return;
        }

        updateForgotState({
          verificationToken: token,
          forgotPasswordStep: "RESET_PASSWORD",
          loading: false,
          error: "",
          success: "OTP verified successfully.",
        });
      } catch (err) {
        updateForgotState({
          loading: false,
          error: getApiErrorMessage(err, "Invalid or expired OTP. Please try again."),
          success: "",
        });
      }
    };

    const validateNewPassword = () => {
      if (!forgotState.newPassword) return "New password is required";
      if (forgotState.newPassword.length < 8) return "Password must be at least 8 characters";
      if (!forgotState.confirmPassword) return "Confirm password is required";
      if (forgotState.newPassword !== forgotState.confirmPassword) return "Passwords do not match";
      return "";
    };

    const handleResetPassword = async (e) => {
      e.preventDefault();
      const passwordError = validateNewPassword();
      if (passwordError) {
        updateForgotState({ error: passwordError, success: "" });
        return;
      }
      if (!forgotState.verificationToken) {
        updateForgotState({
          error: "Your verification session has expired. Please verify your OTP again.",
          success: "",
        });
        return;
      }

      updateForgotState({ loading: true, error: "", success: "" });
      try {
        await resetCollegePassword(
          forgotState.verificationToken,
          forgotState.newPassword
        );
        updateForgotState({
          forgotPasswordStep: "SUCCESS",
          loading: false,
          otp: "",
          verificationToken: "",
          newPassword: "",
          confirmPassword: "",
          error: "",
          success: "Password reset successfully!",
        });
      } catch (err) {
        updateForgotState({
          loading: false,
          error: getApiErrorMessage(err, "Unable to reset password. Please try again."),
          success: "",
        });
      }
    };

    const stepIndex = {
      FORGOT_EMAIL: 1,
      VERIFY_OTP: 2,
      RESET_PASSWORD: 3,
      SUCCESS: 3,
    }[forgotState.forgotPasswordStep];

    const renderForgotPasswordMessage = () => (
      <>
        {forgotState.error && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm font-bold text-center">
            {forgotState.error}
          </div>
        )}
        {forgotState.success && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 text-sm font-bold text-center">
            {forgotState.success}
          </div>
        )}
      </>
    );

    const renderForgotStepIndicator = () => (
      <div className="grid grid-cols-3 gap-2 mb-8">
        {[
          ["Email", 1],
          ["Verify OTP", 2],
          ["Reset", 3],
        ].map(([label, index]) => (
          <div
            key={label}
            className={`rounded-lg border px-2 py-2 text-center text-xs font-bold transition-all ${
              stepIndex >= index
                ? "border-blue-500/50 bg-blue-500/10 text-blue-200"
                : "border-slate-700/50 bg-slate-800/40 text-slate-500"
            }`}
          >
            <span className="mr-1">{index}.</span>{label}
          </div>
        ))}
      </div>
    );

    const renderEmailStep = () => (
      <>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">Forgot Password?</h2>
          <p className="text-slate-400 font-medium">
            Enter your registered email address and we'll send you an OTP to reset your password.
          </p>
        </div>

        {renderForgotStepIndicator()}

        <form onSubmit={handleSendResetOtp} className="space-y-6" noValidate>
          <div className="space-y-2 text-left">
            <label className="text-sm font-bold text-slate-300 ml-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail className="text-slate-500" size={18} />
              </div>
              <input
                type="email"
                placeholder="you@example.com"
                value={forgotState.forgotPasswordEmail}
                onChange={(e) => updateForgotState({ forgotPasswordEmail: e.target.value, error: "", success: "" })}
                disabled={forgotState.loading}
                className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border ${forgotState.error.includes("Email") || forgotState.error.includes("email") ? "border-rose-500/50 focus:border-rose-500" : "border-slate-700 focus:border-slate-500"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-all font-medium disabled:opacity-70`}
              />
            </div>
          </div>

          {renderForgotPasswordMessage()}

          <button
            type="submit"
            disabled={forgotState.loading}
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg mt-8 bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {forgotState.loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-700/50 pt-6">
          <button
            type="button"
            onClick={resetForgotPasswordFlow}
            className="inline-flex items-center justify-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            <ArrowLeft size={16} /> Back to Login
          </button>
        </div>
      </>
    );

    const renderVerifyOtpStep = () => (
      <>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">Verify OTP</h2>
          <p className="text-slate-400 font-medium">
            Enter the OTP sent to your registered email address.
          </p>
        </div>

        {renderForgotStepIndicator()}

        <form onSubmit={handleVerifyResetOtp} className="space-y-6" noValidate>
          <div className="p-3 bg-slate-800/50 border border-slate-700/50 rounded-xl text-slate-300 text-sm font-bold text-center">
            OTP sent to {maskEmail(forgotState.forgotPasswordEmail)}
          </div>

          <div className="space-y-2 text-left">
            <label className="text-sm font-bold text-slate-300 ml-1">OTP</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <ShieldCheck className="text-slate-500" size={18} />
              </div>
              <input
                type="text"
                inputMode="numeric"
                placeholder="Enter OTP"
                value={forgotState.otp}
                onChange={(e) => updateForgotState({ otp: e.target.value, error: "", success: "" })}
                disabled={forgotState.loading}
                className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border ${forgotState.error.includes("OTP") || forgotState.error.includes("otp") ? "border-rose-500/50 focus:border-rose-500" : "border-slate-700 focus:border-slate-500"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-all font-medium disabled:opacity-70`}
              />
            </div>
          </div>

          {renderForgotPasswordMessage()}

          <button
            type="submit"
            disabled={forgotState.loading}
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg mt-8 bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {forgotState.loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Verifying...
              </>
            ) : (
              "Verify OTP"
            )}
          </button>
        </form>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-slate-700/50 pt-6">
          <button
            type="button"
            onClick={() => updateForgotState({ forgotPasswordStep: "FORGOT_EMAIL", otp: "", verificationToken: "", error: "", success: "" })}
            className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            Change Email
          </button>
          <button
            type="button"
            onClick={resetForgotPasswordFlow}
            className="text-sm font-bold text-slate-400 hover:text-white transition-colors"
          >
            Back to Login
          </button>
        </div>
      </>
    );

    const renderResetPasswordStep = () => (
      <>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">Create New Password</h2>
          <p className="text-slate-400 font-medium">Enter your new password below.</p>
        </div>

        {renderForgotStepIndicator()}

        <form onSubmit={handleResetPassword} className="space-y-6" noValidate>
          <div className="space-y-2 text-left">
            <label className="text-sm font-bold text-slate-300 ml-1">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <KeyRound className="text-slate-500" size={18} />
              </div>
              <input
                type="password"
                placeholder="Minimum 8 characters"
                value={forgotState.newPassword}
                onChange={(e) => updateForgotState({ newPassword: e.target.value, error: "", success: "" })}
                disabled={forgotState.loading}
                className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border ${forgotState.error.includes("password") || forgotState.error.includes("Password") ? "border-rose-500/50 focus:border-rose-500" : "border-slate-700 focus:border-slate-500"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-all font-medium disabled:opacity-70`}
              />
            </div>
          </div>

          <div className="space-y-2 text-left">
            <label className="text-sm font-bold text-slate-300 ml-1">Confirm Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="text-slate-500" size={18} />
              </div>
              <input
                type="password"
                placeholder="Confirm new password"
                value={forgotState.confirmPassword}
                onChange={(e) => updateForgotState({ confirmPassword: e.target.value, error: "", success: "" })}
                disabled={forgotState.loading}
                className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border ${forgotState.error.includes("match") || forgotState.error.includes("Confirm") ? "border-rose-500/50 focus:border-rose-500" : "border-slate-700 focus:border-slate-500"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-all font-medium disabled:opacity-70`}
              />
            </div>
          </div>

          {renderForgotPasswordMessage()}

          <button
            type="submit"
            disabled={forgotState.loading}
            className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg mt-8 bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {forgotState.loading ? (
              <>
                <Loader2 className="animate-spin" size={20} /> Resetting Password...
              </>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>

        <div className="mt-8 text-center border-t border-slate-700/50 pt-6">
          <button
            type="button"
            onClick={() => updateForgotState({ forgotPasswordStep: "VERIFY_OTP", newPassword: "", confirmPassword: "", verificationToken: "", error: "", success: "" })}
            className="text-sm font-bold text-slate-300 hover:text-white transition-colors"
          >
            Back to OTP
          </button>
        </div>
      </>
    );

    const renderSuccessStep = () => (
      <>
        <div className="text-center mb-8">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/30">
            <CheckCircle2 className="text-emerald-300" size={30} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">Password reset successfully!</h2>
          <p className="text-slate-400 font-medium">
            You can now log in with your new password.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForgotPasswordFlow}
          className="w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25"
        >
          Back to Login
        </button>
      </>
    );

    const renderForgotPasswordFlow = () => {
      if (forgotState.forgotPasswordStep === "FORGOT_EMAIL") return renderEmailStep();
      if (forgotState.forgotPasswordStep === "VERIFY_OTP") return renderVerifyOtpStep();
      if (forgotState.forgotPasswordStep === "RESET_PASSWORD") return renderResetPasswordStep();
      if (forgotState.forgotPasswordStep === "SUCCESS") return renderSuccessStep();
      return null;
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center font-sans tracking-wide bg-[#0f172a] text-slate-100 overflow-y-auto">
            
            {/* Background Decor */}
            <div className="absolute top-[-100px] right-[-100px] w-96 h-96 bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute bottom-[-100px] left-[-100px] w-96 h-96 bg-emerald-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            
            <div className="relative w-full max-w-md p-6 xs:p-8 m-4 rounded-[2rem] bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 shadow-2xl z-10 transition-all duration-300">
              {forgotState.forgotPasswordStep !== "LOGIN" ? renderForgotPasswordFlow() : (
              <>
              
              <div className="text-center mb-10">
                <h2 className="text-3xl font-extrabold text-white tracking-tight mb-3">Welcome Back</h2>
                <p className="text-slate-400 font-medium">Log in to your dashboard to continue</p>
              </div>

              {/* Role Selector Tabs (Replaced Dropdown) */}
              <div className="flex p-1 bg-slate-800/80 rounded-xl mb-8 border border-slate-700/50 shadow-inner">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 ${
                    role === "student" 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-900/30" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  }`}
                >
                  <User size={18} /> Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole("industry")}
                  className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-bold text-sm transition-all duration-300 ${
                    role === "industry" 
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/30" 
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                  }`}
                >
                  <Building2 size={18} /> Industry
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                  
                  {/* Email Input */}
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-bold text-slate-300 ml-1">Email Address</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Mail className="text-slate-500" size={18} />
                      </div>
                      <input 
                        type="email" 
                        placeholder="you@example.com" 
                        value={email} 
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if(error) setError("");
                        }} 
                        className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border ${error.includes("Email") ? "border-rose-500/50 focus:border-rose-500" : "border-slate-700 focus:border-slate-500"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-all font-medium`}
                      />
                    </div>
                  </div>

                  {/* Password Input */}
                  <div className="space-y-2 text-left">
                    <label className="text-sm font-bold text-slate-300 ml-1">Password</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Lock className="text-slate-500" size={18} />
                      </div>
                      <input 
                        type="password" 
                        placeholder="••••••••" 
                        value={password} 
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if(error) setError("");
                        }} 
                        className={`w-full pl-11 pr-4 py-3.5 bg-slate-800/60 border ${error.includes("Password") ? "border-rose-500/50 focus:border-rose-500" : "border-slate-700 focus:border-slate-500"} rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-500 transition-all font-medium`}
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => {
                          setError("");
                          updateForgotState({
                            ...initialForgotPasswordState,
                            forgotPasswordStep: "FORGOT_EMAIL",
                            forgotPasswordEmail: email.trim(),
                          });
                        }}
                        className="text-sm font-bold text-blue-300 hover:text-blue-200 transition-colors"
                      >
                        Forgot Password?
                      </button>
                    </div>
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-lg text-rose-400 text-sm font-bold text-center">
                      {error}
                    </div>
                  )}

                  {/* Submit Button */}
                  <button 
                    type="submit" 
                    disabled={loading}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg mt-8 ${
                      role === "student" 
                        ? "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/25" 
                        : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/25"
                    } disabled:opacity-70 disabled:cursor-not-allowed`}
                  >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : "Log In Securely"}
                  </button>
              </form>

              {/* Footer Links */}
              <div className="mt-10 text-center border-t border-slate-700/50 pt-8">
                <p className="text-slate-400 text-sm font-medium mb-6">Don't have an account?</p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    type="button"
                    onClick={() => navigate("/register-student")}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-slate-800/40 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-sm font-bold text-slate-300 transition-all flex items-center justify-center gap-2"
                  >
                    <User size={16} className="text-blue-400" /> Register as Student
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate("/register-industry")}
                    className="flex-1 py-2.5 px-4 rounded-lg bg-slate-800/40 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-sm font-bold text-slate-300 transition-all flex items-center justify-center gap-2"
                  >
                    <Building2 size={16} className="text-emerald-400" /> Register as Industry
                  </button>
                </div>
              </div>

              </>
              )}
            </div>
        </div>
    );
};
