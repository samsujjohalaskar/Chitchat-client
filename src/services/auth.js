import axios from "axios";

const API_URL = "http://localhost:1337/api";

export const register = (username, email, password) => {
  return axios.post(`${API_URL}/auth/local/register`, {
    username,
    email,
    password,
  });
};

export const login = (identifier, password) => {
  return axios.post(`${API_URL}/auth/local`, {
    identifier,
    password,
  });
};

export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
