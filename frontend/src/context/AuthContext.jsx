import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, removeToken, isAuthenticated } from "../utils/token";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated on mount
    const token = getToken();
    if (token) {
      // In a real app, you might decode token and fetch user data here
      setUser({ id: 1, name: "User" });
      // You can retrieve username from localStorage or decode from token
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      }
    }
    setLoading(false);
  }, []);

  const login = (token, user) => {
    setToken(token);
    setUser({ id: 1, name: user });
    setUsername(user);
    localStorage.setItem('username', user);
  };

  const logout = () => {
    removeToken();
    setUser(null);
    setUsername(null);
    localStorage.removeItem('username');
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
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};