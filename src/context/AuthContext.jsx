import { createContext, useContext, useEffect, useState } from "react";

import {
  getMe,
  login as loginUser,
  logout as logoutUser,
  register as registerUser,
} from "../services/authService";

import { useSocket } from "../hooks/useSocket";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const isAuthenticated = Boolean(user);

  useSocket({
    enabled: isAuthenticated,
    role: user?.role,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const response = await getMe();

        setUser(response?.data?.user || null);
      } catch (error) {
        if (error?.response?.status !== 401) {
          console.error("Failed to restore authentication:", error);
        }

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const register = async (userData) => {
    const response = await registerUser(userData);

    return response;
  };

  const login = async (credentials) => {
    const response = await loginUser(credentials);

    const authenticatedUser = response?.data?.user;

    if (authenticatedUser) {
      setUser(authenticatedUser);
    }

    return response;
  };

  const logout = async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    register,
    login,
    logout,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}
