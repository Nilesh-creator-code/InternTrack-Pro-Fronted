import axiosInstance from "../../auth/services/axiosInstance";

/**
 * Create a new internship posting
 * @param {Object} internshipData - Internship details
 * @returns {Promise} Response from API
 */
export const createInternship = async (internshipData) => {
  const response = await axiosInstance.post(
    "/industry/internships/create",
    internshipData,
  );
  return response.data;
};

/**
 * Get all internships posted by the industry
 * @returns {Promise} List of internships
 */
export const getMyInternships = async () => {
  const response = await axiosInstance.get("/internships/industry/my-internships");
  return response.data;
};

/**
 * Get details of a specific internship
 * @param {string} internshipId - ID of the internship
 * @returns {Promise} Internship details
 */
export const getInternshipDetails = async (internshipId) => {
  const response = await axiosInstance.get(`/internships/industry/view/${internshipId}`);
  return response.data;
};

/**
 * Get applications for a specific internship
 * @param {string} internshipId - ID of the internship
 * @returns {Promise} List of applications
 */
export const getInternshipApplications = async (internshipId) => {
  const response = await axiosInstance.get(
    `/internships/industry/${internshipId}/applications`
  );
  return response.data;
};

/**
 * Update internship status
 * @param {string} internshipId - ID of the internship
 * @param {string} applicationId - ID of the application
 * @param {string} status - New status (ACCEPTED, REJECTED, etc.)
 * @returns {Promise} Response from API
 */
export const updateApplicationStatus = async (internshipId, applicationId, status) => {
  const response = await axiosInstance.put(
    `/internships/industry/${internshipId}/applications/${applicationId}`,
    { status }
  );
  return response.data;
};

/**
 * Get all applications for industry
 * @returns {Promise} List of all applications
 */
export const getAllApplications = async () => {
  const response = await axiosInstance.get("/applications-controller/industry/applications");
  return response.data;
};

/**
 * Update industry application status
 * @param {string|number} applicationId - ID of the application
 * @param {string} status - New status (APPROVED, REJECTED, ONGOING)
 * @returns {Promise} Updated application or API response
 */
export const updateIndustryApplicationStatus = async (applicationId, status) => {
  const response = await axiosInstance.put(
    `/applications-controller/industry/updateApplication/${applicationId}`,
    JSON.stringify(status),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

/**
 * Get industry profile
 * @returns {Promise} Response from API
 */
export const getIndustryProfile = async () => {
  const response = await axiosInstance.get("/industry-controller/profile");
  return response.data;
};

/**
 * Update industry profile
 * @param {Object} profileData - Updated profile data
 * @returns {Promise} Response from API
 */
export const updateIndustryProfile = async (profileData) => {
  const response = await axiosInstance.put("/industry-controller/profile/update", profileData);
  return response.data;
};
