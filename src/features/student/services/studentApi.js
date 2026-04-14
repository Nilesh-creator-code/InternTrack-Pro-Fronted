import axiosInstance from "../../../services/axiosInstance";

export const getStudentProfile = () => 
  axiosInstance.get(`/students/profile`); 

export const updateStudentProfile = (data) => 
  axiosInstance.put(`/student/profile`, data); 

export const getAllInternships = (page = 0, size = 10) =>
  axiosInstance.get(`/students/all/pagination?page=${page}&size=${size}`);

export const searchInternshipsByDomain = (domain) =>
  axiosInstance.get(`/students/domain/${domain}`);

export const getStudentApplications = () =>
  axiosInstance.get(`/students/applications`);

export const getInternshipDetails = async (id) => {
  const token = localStorage.getItem("authToken");
  return axiosInstance.get(`/students/view/${id}`, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
};

export const applyToInternship = async (internshipId) => {
  const token = localStorage.getItem("authToken");
  return axiosInstance.post(`/students/apply/${internshipId}`, {}, {
    headers: {
      "Authorization": `Bearer ${token}`
    }
  });
};
