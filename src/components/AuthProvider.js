import { useContext, createContext, useState } from "react";
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
        setUser({ id: res.id }); 
        setToken(res.token);
        localStorage.setItem("site", res.token);
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
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};