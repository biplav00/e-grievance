import React, { createContext, useState, useEffect } from 'react';
import setAuthToken from '../utils/setAuthToken';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: localStorage.getItem('token'), isAuthenticated: false, user: null, loading: true });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decoded.exp > currentTime) {
            setAuth({ token, isAuthenticated: true, user: decoded.user, loading: false });
        } else {
            localStorage.removeItem('token');
            setAuth({ token: null, isAuthenticated: false, user: null, loading: false });
        }
      } catch (error) {
        localStorage.removeItem('token');
        setAuth({ token: null, isAuthenticated: false, user: null, loading: false });
      }
    } else {
      setAuth({ token: null, isAuthenticated: false, user: null, loading: false });
    }
  }, []);

  const login = (token) => {
    localStorage.setItem('token', token);
    setAuthToken(token);
    const decoded = jwtDecode(token);
    setAuth({ token, isAuthenticated: true, user: decoded.user, loading: false });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setAuthToken(null);
    setAuth({ token: null, isAuthenticated: false, user: null, loading: false });
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {!auth.loading && children}
    </AuthContext.Provider>
  );
};