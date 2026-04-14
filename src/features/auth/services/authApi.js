import axiosInstance from "./axiosInstance";


// INDUSTRY APIs

export const sayHello = () =>
  axiosInstance.get(`/industry-controller/hello`);

export const sendIndustryOtp = (email) =>
  axiosInstance.post(`/auth/industry/send-otp?email=${encodeURIComponent(email)}`);


export const verifyIndustryOtp = (email, otp) =>
  axiosInstance.post(`/auth/industry/verify-otp`, { email, otp });



export const registerIndustry = (data) =>
  axiosInstance.post(`/auth/industry/register`, data);

export const loginIndustry = (data) =>
  axiosInstance.post(`/auth/industry/login`, data);

// STUDENT APIs
export const registerStudent = (data) =>
  axiosInstance.post(`/auth/student/register`, data);

export const loginStudent = (data) =>
  axiosInstance.post(`/auth/student/login`, data);