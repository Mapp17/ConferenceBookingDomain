import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 5000, 
  headers: {
    "Content-Type": "application/json",
  },
});


apiClient.interceptors.request.use(
  (config) => {
    const method = config.method?.toUpperCase();
    console.log(`Sending ${method} to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
  
    return response.data;
  },
  (error) => {
    console.error("API Error:", error.message);
    return Promise.reject(error);
  }
);

export default apiClient;