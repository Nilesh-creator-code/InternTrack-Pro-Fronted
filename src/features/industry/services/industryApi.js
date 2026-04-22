import axiosInstance from "../../auth/services/axiosInstance";

/**
 * Create a new internship posting
 * @param {Object} internshipData - Internship details
 * @returns {Promise} Response from API
 */
export const createInternship = async (internshipData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axiosInstance.post(
      "/industry/internships/create",
      internshipData,
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all internships posted by the industry
 * @returns {Promise} List of internships
 */
export const getMyInternships = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axiosInstance.get("/industry/internships/my-internships", {
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get details of a specific internship
 * @param {string} internshipId - ID of the internship
 * @returns {Promise} Internship details
 */
export const getInternshipDetails = async (internshipId) => {
  try {
    const response = await axiosInstance.get(`/industry/internships/view/${internshipId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get applications for a specific internship
 * @param {string} internshipId - ID of the internship
 * @returns {Promise} List of applications
 */
export const getInternshipApplications = async (internshipId) => {
  try {
    const response = await axiosInstance.get(
      `/industry/internships/${internshipId}/applications`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update internship status
 * @param {string} internshipId - ID of the internship
 * @param {string} applicationId - ID of the application
 * @param {string} status - New status (ACCEPTED, REJECTED, etc.)
 * @returns {Promise} Response from API
 */
export const updateApplicationStatus = async (internshipId, applicationId, status) => {
  try {
    const response = await axiosInstance.put(
      `/industry/internships/${internshipId}/applications/${applicationId}`,
      { status }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get all applications for industry
 * @returns {Promise} List of all applications
 */
export const getAllApplications = async () => {
  try {
    const response = await axiosInstance.get("/industry/applications");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get industry profile
 * @returns {Promise} Response from API
 */
export const getIndustryProfile = async () => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axiosInstance.get("/industry-controller/profile", {
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update industry profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Response from API
 */
export const updateIndustryProfile = async (profileData) => {
  try {
    const token = localStorage.getItem("authToken");
    const response = await axiosInstance.put("/industry-controller/profile/update", profileData, {
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
