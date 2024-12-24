import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem('isLoggedIn') === 'true';
  });
  const [username, setUsername] = useState(sessionStorage.getItem('username') || '');

  const login = (user) => {
    sessionStorage.setItem('isLoggedIn', 'true');
    setIsLoggedIn(true);
    sessionStorage.setItem('username', user);
    setUsername(user);
  };

  const logout = () => {
    sessionStorage.removeItem('isLoggedIn');
    setIsLoggedIn(false);
    sessionStorage.removeItem('username');
    setUsername('');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, username, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
