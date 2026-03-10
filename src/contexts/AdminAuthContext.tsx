import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { authApi, AdminUser } from "@/services/api";

interface AdminAuthContextType {
  user: AdminUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | null>(null);

export const useAdminAuth = () => {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error("useAdminAuth must be used within AdminAuthProvider");
  return ctx;
};

/**
 * AdminAuthProvider
 *
 * Handles admin authentication via backend-issued JWT stored in localStorage.
 * On mount, verifies the existing token against the backend.
 */
export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      setLoading(false);
      return;
    }

    authApi
      .verify()
      .then(({ user }) => setUser(user))
      .catch(() => {
        // Backend unavailable or token invalid — clear token
        localStorage.removeItem("admin_token");
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await authApi.login(email, password);
      localStorage.setItem("admin_token", token);
      setUser(user);
    } catch (error) {
      throw error instanceof Error ? error : new Error("Login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("admin_token");
    setUser(null);
  };

  return (
    <AdminAuthContext.Provider value={{ user, loading, login, logout, isAuthenticated: !!user }}>
      {children}
    </AdminAuthContext.Provider>
  );
};
