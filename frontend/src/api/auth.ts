import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export const loginUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE}/authorize`, {
    email,
    password,
  });
  return response.data;
};

export const registerUser = async (email: string, password: string) => {
  const response = await axios.post(`${API_BASE}/registrate`, {
    email,
    password,
  });
  return response.data;
};

export const logoutUser = async () => {
  const response = await axios.post(
    `${API_BASE}/logout`,
    {},
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};
