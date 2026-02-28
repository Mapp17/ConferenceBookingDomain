import apiClient from "../api/apiClient";
import { useState } from "react";

export function useAuth() {
  const [error, setError] = useState(null);

  const login = async (credentials) => {
    console.log("LOGIN PAYLOAD:", credentials);
    try {
      const response = await apiClient.post("/auth/login", credentials);

      localStorage.setItem("token", response.token);
      setError(null);

      return true;
    } catch (err) {
      setError("Invalid username or password");
      return false;
    }
  };

  return { login, error };
}