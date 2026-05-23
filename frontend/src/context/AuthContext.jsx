import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, removeToken } from "../utils/token";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (token) {
      setUser({ id: 1, name: "User" });
      const storedUsername = localStorage.getItem("username");
      if (storedUsername) setUsername(storedUsername);
    }
    setLoading(false);
  }, []);

  const login = (tokenOrPayload, maybeUsername) => {
    const token =
      typeof tokenOrPayload === "object"
        ? tokenOrPayload.token
        : tokenOrPayload;

    const username =
      typeof tokenOrPayload === "object"
        ? tokenOrPayload.username
        : maybeUsername;

    setToken(token);
    setUser({ id: 1, name: username });
    setUsername(username);
    localStorage.setItem("username", username);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setUsername(null);
    localStorage.removeItem("username");
  };

  const value = {
    user,
    username,
    isAuthenticated: !!user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};