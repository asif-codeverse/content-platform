"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  getCurrentUser,
} from "@/services/auth.service";

type User = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  refreshUser: () => Promise<void>;
  logout: () => void;
};

const AuthContext =
  createContext<AuthContextType>({
    user: null,
    loading: true,
    refreshUser: async () => { },
    logout: () => { },
  });

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {

  const [user, setUser] =
    useState<User | null>(null);

  const [loading, setLoading] =
    useState(true);

  const refreshUser =
    async () => {

      try {

        const response =
          await getCurrentUser();

        setUser(
          response.data
        );

      } catch {

        setUser(null);

      } finally {

        setLoading(false);

      }
    };

  const logout = () => {
    setUser(null);
  };

  useEffect(() => {
    refreshUser();
  }, []);

  return (

    <AuthContext.Provider
      value={{
        user,
        loading,
        refreshUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);