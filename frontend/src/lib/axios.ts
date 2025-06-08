import axios from 'axios';

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api",
  withCredentials: true,
  timeout: 30000, // 30 seconds
});

export default apiClient

