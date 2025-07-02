import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  // You can add headers or interceptors here if needed
});

export default api;
