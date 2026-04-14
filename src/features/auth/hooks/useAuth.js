import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../store/authSlice";
import { 
  sendIndustryOtp,
  verifyIndustryOtp,
  registerIndustry,
  loginIndustry,
  registerStudent,
  loginStudent
} from "../services/authApi";

export const useAuth = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Send OTP for Industry
  const handleSendIndustryOtp = async (email) => {
    setLoading(true);
    try {
      await sendIndustryOtp(email);
      toast.success("OTP sent successfully");
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP for Industry
  const handleVerifyIndustryOtp = async (email, otp) => {
    setLoading(true);
    try {
      const response = await verifyIndustryOtp(email, otp); // query params
      toast.success("OTP verified successfully");
      return response.data; // Contains { verified, verificationToken }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to verify OTP");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Register Industry
  const handleRegisterIndustry = async (userData) => {
    setLoading(true);
    try {
      await registerIndustry(userData);
      toast.success("Industry registered successfully");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to register");
    } finally {
      setLoading(false);
    }
  };

  // Login Industry
  const handleLoginIndustry = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginIndustry({ email, password });
      
      let token = null;
      let role = "INDUSTRY";
      let userData = {};

      if (typeof response.data === "string") {
        token = response.data;
      } else if (response.data) {
        token = response.data.token || response.data.jwt || response.data.jwtToken || response.data.accessToken || response.data.authToken;
        role = response.data.role || "INDUSTRY";
        userData = response.data;
      }

      if (token) {
        localStorage.setItem("authToken", token);
      } else {
        console.error("Token not found in login response:", response.data);
      }

      dispatch(setUser({ ...userData, role, token }));
      toast.success("Login successful!");

      // Redirect based on role returned by backend
      if (role === "INDUSTRY") {
        navigate("/industry/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  // Register Student
  const handleRegisterStudent = async (userData) => {
    setLoading(true);
    try {
      await registerStudent(userData);
      toast.success("Student registered successfully");
      navigate("/login");
    } catch (error) {
      let errorMsg = "Failed to register";
      if (error.response?.data) {
        if (typeof error.response.data === "string") {
          errorMsg = error.response.data;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else {
          // It might be an array of errors or field errors
          errorMsg = JSON.stringify(error.response.data);
        }
      }
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  // Login Student
  const handleLoginStudent = async (email, password) => {
    setLoading(true);
    try {
      const response = await loginStudent({ email, password });
      
      // Smart extraction depending on how backend sends the token
      let token = null;
      let role = "STUDENT";
      let userData = {};

      if (typeof response.data === "string") {
        token = response.data; // Raw token string
      } else if (response.data) {
        token = response.data.token || response.data.jwt || response.data.jwtToken || response.data.accessToken;
        role = response.data.role || "STUDENT";
        userData = response.data;
      }

      // Store JWT in localStorage for subsequent requests
      if (token) {
        localStorage.setItem("authToken", token);
      } else {
        console.error("Token not found in login response:", response.data);
      }

      dispatch(setUser({ ...userData, role, token }));
      toast.success("Login successful!");

      // Redirect based on role returned by backend
      if (role === "INDUSTRY") {
        navigate("/industry/dashboard");
      } else {
        navigate("/student/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    handleSendIndustryOtp,
    handleVerifyIndustryOtp,
    handleRegisterIndustry,
    handleLoginIndustry,
    handleRegisterStudent,
    handleLoginStudent
  };
};