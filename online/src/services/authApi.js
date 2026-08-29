
import api from "./api";

export const registerUser = async (userData) => {
  const response = await api.post(
    "/auth/register",
    userData
  );

  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await api.post(
    "/auth/login",
    credentials
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const savedUser = JSON.parse(localStorage.getItem("user") || "null");
  const response = await api.get(
    "/auth/me",
    { params: { email: savedUser?.email } }
  );

  return response.data;
};