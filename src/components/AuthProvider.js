import { useContext, createContext, useState } from "react";
import { useNavigate } from "react-router-dom";

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
        setUser({ id: res.id }); // Assuming the response contains user ID
        setToken(res.token);
        localStorage.setItem("site", res.token);
        navigate("/");
      } else {
        const errorText = await response.text();
        throw new Error(`Login failed: ${errorText}`);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to login. Please check your credentials.");
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