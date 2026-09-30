import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [userRole, setUserRole] = useState(null); // 'Customer', 'Reviewer', 'Admin', or null
  const [username, setUsername] = useState(null);

  const login = (role, name) => {
    setUserRole(role);
    setUsername(name || role);
  };

  const logout = () => {
    setUserRole(null);
    setUsername(null);
  };

  return (
    <AuthContext.Provider value={{ userRole, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
