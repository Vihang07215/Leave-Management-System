import axiosInstance from "../config/axiosConfig";

export const signupUser = async (data) => {
  const response = await axiosInstance.post("/users/signup", data);
  return response.data;
};

export const loginUser = async (data) =>{
    const response = await axiosInstance.post("users/login" ,data);
    return response.data;
}