import axiosInstance from "../../../services/axiosInstance";

export const getAllDepartments = () =>
  axiosInstance.get("/departments/getAllDepartments");

export const getCoursesByDepartment = (departmentId) =>
  axiosInstance.get("/departments/getCoursesByDepartment", {
    params: { departmentId },
  });