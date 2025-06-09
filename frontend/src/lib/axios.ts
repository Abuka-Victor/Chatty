import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:8080/api" : "/api",
  withCredentials: true,
  timeout: 30000, // 30 seconds
});

export default apiClient

