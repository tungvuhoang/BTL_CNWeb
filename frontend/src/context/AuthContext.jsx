import { createContext, useContext, useEffect, useState } from "react";
import { getToken, setToken, removeToken } from "../utils/token";
import { getMyProfile } from "../api/authApi";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = getToken();

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await getMyProfile();

        setUser(profile);
        setUsername(profile.username || localStorage.getItem("username"));
      } catch (error) {
        removeToken();
        localStorage.removeItem("username");
        setUser(null);
        setUsername(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (tokenOrPayload, maybeUsername) => {
    const token =
      typeof tokenOrPayload === "object"
        ? tokenOrPayload.token
        : tokenOrPayload;

    const username =
      typeof tokenOrPayload === "object"
        ? tokenOrPayload.username
        : maybeUsername;

    setToken(token);

    if (username) {
      localStorage.setItem("username", username);
      setUsername(username);
    }

    try {
      const profile = await getMyProfile();

      setUser(profile);
      setUsername(profile.username || username);
    } catch (error) {
      setUser({ username });
      setUsername(username);
    }
  };

  const logout = () => {
    removeToken();
    localStorage.removeItem("username");
    setUser(null);
    setUsername(null);
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