import { createContext, useContext } from "react";

export const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  // Placeholder for socket logic
  return <SocketContext.Provider value={null}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within SocketProvider");
  }
  return context;
};