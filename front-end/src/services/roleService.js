import axiosInstance from "../config/axiosConfig";

export const getAllRoles = async () => {
  const response = await axiosInstance.get("/roles/getallrole");
  return response.data;
};