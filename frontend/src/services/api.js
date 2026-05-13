import axios from "axios";

const api = axios.create({
  baseURL: "https://task-management-system-lahari-production.up.railway.app/api"
});

export default api;