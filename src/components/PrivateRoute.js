import React, {useState, useEffect} from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthProvider";

const PrivateRoute = () => {
  const { token, validateToken } = useAuth(); // Get token and validation function from AuthProvider
  const [isValid, setIsValid] = useState(null); // Track token validity (null = loading)

  useEffect(() => {
    const checkToken = async () => {
      if (token) {
        const valid = await validateToken(); // Validate token
        setIsValid(valid); // Update state based on validation result
      } else {
        setIsValid(false); // No token, mark as invalid
      }
    };

    checkToken();
  }, [token]);

  if (isValid === null) {
    // Show loading indicator while token validation is in progress
    return null;
  }

  // Redirect to login if token is invalid, otherwise render the protected route
  return isValid ? <Outlet /> : <Navigate to="/login" />;
};

export default PrivateRoute;