import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accessToken, setAccessToken] = useState(() =>
    localStorage.getItem("accessToken")
  );

  const [username, setUsername] = useState(() =>
    localStorage.getItem("username")
  );

  const isAuthenticated = !!accessToken;

  const login = ({ token, username }) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("username", username);

    setAccessToken(token);
    setUsername(username);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("username");

    setAccessToken(null);
    setUsername(null);
  };

  const value = {
    accessToken,
    username,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}