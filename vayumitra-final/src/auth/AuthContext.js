import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize user from localStorage if available
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : { role: "citizen" };
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
      return { role: "citizen" };
    }
  });

  const login = (userData) => {
    // userData could be just role or full object. Let's normalize.
    // Based on usage, it seems like we might just be passing 'role' string in some places, 
    // but better to expect an object or handle both.
    // If userData is string, treat as role.
    const newUser = typeof userData === 'string' ? { role: userData } : userData;

    setUser(newUser);
    localStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token"); // Also clear token if we store it separately
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
