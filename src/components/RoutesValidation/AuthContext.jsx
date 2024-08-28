import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import apiLoginHost from "../../allPages/login/LoginApi";

// Create AuthContext
const AuthContext = createContext();

// Custom hook to use the AuthContext
const useAuth = () => useContext(AuthContext);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate(); // Initialize useNavigate

  // Fetch user data
  const fetchUser = async () => {
    try {
      const response = await axios.get(`${apiLoginHost}/api/user-data`, { withCredentials: true });
      setUser(response.data);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Handle unauthorized (e.g., redirect to login)
      } else {
        console.error('Failed to fetch user data', error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Login method (you may need to adjust the endpoint and logic based on your backend)
  const login = async (credentials) => {
    try {
      await axios.post('http://localhost:5000/auth/google', credentials, { withCredentials: true });
      await fetchUser(); // Fetch user data after successful login
      navigate('/dashboard'); // Redirect to the dashboard after login
    } catch (error) {
      console.error('Failed to login', error);
    }
  };

  // Logout method
  const logout = async () => {
    try {
      await axios.post('http://localhost:5000/logout', {}, { withCredentials: true });
      setUser(null); // Clear user data after logout
      navigate('/'); // Redirect to login page after logout
    } catch (error) {
      console.error('Failed to logout', error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthProvider, useAuth };