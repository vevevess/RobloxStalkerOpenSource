import { createContext, useContext, useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AuthUser {
  id: string;
  email: string;
  username: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/auth/me'],
    retry: false,
    refetchOnWindowFocus: false,
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/auth/logout");
      return res.json();
    },
    onSuccess: () => {
      queryClient.setQueryData(['/api/auth/me'], null);
      window.location.href = '/login';
    },
  });

  const logout = () => {
    logoutMutation.mutate();
  };

  const user = (data && typeof data === 'object' && data !== null && 'user' in data) ? (data.user as AuthUser) : null;

  return (
    <AuthContext.Provider value={{ user, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
