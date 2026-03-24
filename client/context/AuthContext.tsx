"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { AuthUser } from "@/lib/types";

type AuthContextType = {
  user: AuthUser | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  login: (accessToken: string, user: AuthUser, refreshToken?: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("user");
      const savedAccessToken = localStorage.getItem("accessToken");
      const savedRefreshToken = localStorage.getItem("refreshToken");

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }

      if (savedAccessToken) {
        setAccessToken(savedAccessToken);
      }

      if (savedRefreshToken) {
        setRefreshToken(savedRefreshToken);
      }
    } catch (error) {
      console.error("Auth hydration error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setUser(null);
      setAccessToken(null);
      setRefreshToken(null);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  const login = (newAccessToken: string, userData: AuthUser, newRefreshToken?: string) => {
    localStorage.setItem("accessToken", newAccessToken);
    localStorage.setItem("user", JSON.stringify(userData));
    setAccessToken(newAccessToken);
    setUser(userData);

    if (newRefreshToken) {
      localStorage.setItem("refreshToken", newRefreshToken);
      setRefreshToken(newRefreshToken);
    }
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      refreshToken,
      isAuthenticated: !!accessToken && !!user,
      isHydrated,
      login,
      logout,
    }),
    [user, accessToken, refreshToken, isHydrated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthContext must be used within AuthProvider");
  }

  return context;
}