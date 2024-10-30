import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Use useNavigate instead of useHistory

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

  // Check token validity function
  const checkToken = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsAuthenticated(false);
      navigate("/login"); // Redirect if no token
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:5000/api/backend/validate_token",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsAuthenticated(response.status === 200);
    } catch (error) {
      setIsAuthenticated(false);
      localStorage.removeItem("access_token");
      navigate("/login"); // Redirect to login page on invalid token
    }
  };

  useEffect(() => {
    checkToken(); // Initial token check on load
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, checkToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
