import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Taken inspiration from https://dev.to/miracool/how-to-manage-user-authentication-with-react-js-3ic5 and modified to suit the project


const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();

 

  const loginAction = async (email, password) => {
    try {
      const response = await fetch(`https://localhost/api/user/login?email=${encodeURIComponent(email)}&loginPassword=${encodeURIComponent(password)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const res = await response.json();
        setUser({ id: res.id, username: res.username }); 
        setToken(res.token);
        localStorage.setItem("site", res.token);
        localStorage.setItem("user", JSON.stringify({ id: res.id, username: res.username }));
        navigate("/");
      } else {
        const errorText = await response.text();
        throw new Error(`Login failed: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      //alert("Failed to login. Please check your credentials.");
    }
  };


  const logOut = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    localStorage.removeItem("user");
    localStorage.setItem("logout-event", Date.now());
    navigate("/login");
  };

  

  // Validate token
  const validateToken = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!token || !storedUser) {
      console.error("No token found");
      return false;
    }

    try {
      const response = await fetch(`https://localhost/api/user/${storedUser.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        console.log("Token validated successfully:", token);

        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.error("Token validation failed:", err);
      return false;
    }
  };

  // Check token on initial load
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("site");
      const storedUser = JSON.parse(localStorage.getItem("user")); // Restore user from localStorage
  
      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(storedUser);
  
        // Validate token only once on load
        const isValid = await validateToken();
        if (!isValid) {
          logOut();
        }
      } else {
        logOut();
      }
    };
  
    initializeAuth();
  }, []); // Only run on mount

  // Sync logout across tabs
  useEffect(() => {
    const handleStorageChange = (event) => {
      if (event.key === "logout-event") {
        setUser(null);
        setToken("");
        navigate("/login");
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [navigate]);

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut, validateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};