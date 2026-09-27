"use client";

// --------------------------------------------------
// SMART TASK MANAGER - AUTH CONTEXT
// --------------------------------------------------

import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from "../types";
import { loginUser, registerUser } from "../services/api";
import { useRouter } from "next/navigation";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = "stm_user";

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  // Load user from localStorage on initial render
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setUser(JSON.parse(stored));
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    const res = await loginUser(email, password);
    if (res.user) {
      setUser(res.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(res.user));
      router.push("/dashboard");
    } else {
      throw new Error(res.message || "Login failed");
    }
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    const res = await registerUser(name, email, password);
    if (res.user) {
      setUser(res.user);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(res.user));
      router.push("/dashboard");
    } else {
      throw new Error(res.message || "Registration failed");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
    router.push("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
