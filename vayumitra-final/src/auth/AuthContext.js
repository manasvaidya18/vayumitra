import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Restore user from localStorage if available
    const savedToken = localStorage.getItem("token");
    const savedRole = localStorage.getItem("role");
    return savedToken ? { role: savedRole, token: savedToken } : null;
  });

  const login = (role, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    setUser({ role, token });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
