import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import apiLoginHost from '../login/LoginApi';
import "./login.css";
import Cookies from 'js-cookie';

function Login() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Function to initiate Google OAuth
  const googleAuth = () => {
    window.location.href = `${apiLoginHost}/auth/google`;
  };

  // Function to fetch roles and resources
  const fetchRoleAndResources = async () => {
    try {
      const response = await axios.get(`${apiLoginHost}/api/roles-resources`, {
        withCredentials: true // Ensure cookies are sent with the request
      });
      // Process the response data as needed
      console.log(response.data);

      // Store user_id and resources in local storage
      localStorage.setItem('user_id', response.data.user_id);
      localStorage.setItem('resources', JSON.stringify(response.data));

      // Redirect to dashboard after fetching roles and resources
      navigate('/dashboard');
    } catch (error) {
      console.error("Error fetching roles and resources:", error);
    }
  };

  // Function to check if the user is authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${apiLoginHost}/auth/check`, { withCredentials: true });
        if (response.status === 200 && response.data.token) {
          console.log("Token received from backend:", response.data.token); // Log the token received
          setIsAuthenticated(true);
          await fetchRoleAndResources(); // Fetch roles and resources after setting the token
        } else {
          throw new Error('Authentication failed');
        }
      } catch (error) {
        console.log("Token invalid or expired, redirecting to login.");
        setIsAuthenticated(false);
        localStorage.removeItem('user_id');
        localStorage.removeItem('resources');
        navigate('/');
      }
    };

    checkAuth();
  }, [navigate]);

  // Function to handle user logout
  const handleLogout = async () => {
    try {
      await axios.post(`${apiLoginHost}/logout`, {}, { withCredentials: true });
      // Clear local storage and cookies
      setIsAuthenticated(false);
      localStorage.removeItem('token');
      localStorage.removeItem('jwt');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user_id');
      localStorage.removeItem('resources');
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      // Redirect to login page
      navigate('/');
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Function to verify access to a path
  const verifyAccess = async (path) => {  
    try {
      const response = await axios.get(`${apiLoginHost}/api/verify-access`, {
        withCredentials: true, // Ensure cookies are sent with the request
        params: {
          path,
        },
      });

      return response.data.access;
    } catch (error) {
      console.error("Error verifying access:", error);
      // Clear the token if access verification fails
      await axios.post(`${apiLoginHost}/logout`, {}, { withCredentials: true });
      localStorage.removeItem('user_id');
      localStorage.removeItem('resources');
      navigate('/');
      return false;
    }
  };

  // Function to handle routing
  const handleRoute = async (path) => {
    const access = await verifyAccess(path);
    if (access) {
      navigate(path);
    } else {
      alert("You do not have access to this path");
      navigate('/');
    }
  };

  return (
    <div className="login-container">
      <div className="login-section">
        <div className="login-card">
          <img src="/student_logo.png" alt="Student Logo" className="fixed-size-image" />
          <h2>IQAC Portal</h2>
          {!isAuthenticated ? (
            <>
              <button className="google-btn" onClick={googleAuth}>
                <img src="/image8-2.png" alt="Google Logo" className="google-logo" />
                <span className="text">Sign in with Google</span>
              </button>
              <div className='para'>
                <p>Sign in using your BITsathy account</p>
              </div>
            </>
          ) : (
            <div>
              <p>You are logged in!</p>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
              {/* Add buttons for routes as an example */}
              <button onClick={() => handleRoute('/dashboard')}>Dashboard</button>
              <button onClick={() => handleRoute('/some-protected-route')}>Some Protected Route</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;