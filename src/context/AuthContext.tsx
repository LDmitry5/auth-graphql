import React, { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { User, LoginMutationResponse, LoginCredentials } from "../types";
import { useMutation } from "@apollo/client/react";
import { LOGIN_MUTATION } from "../api/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("jwt_token"));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [loginMutation] = useMutation<LoginMutationResponse, LoginCredentials>(LOGIN_MUTATION);

  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem("user_data");
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
  }, [token]);

  const login = async (credentials: LoginCredentials) => {
    console.log(credentials);

    setLoading(true);
    setError(null);
    try {
      const { data } = await loginMutation({
        variables: { ...credentials },
      });

      if (data?.login) {
        const { token: jwt, user: userData } = data.login;
        localStorage.setItem("jwt_token", jwt);
        localStorage.setItem("user_data", JSON.stringify(userData));
        setToken(jwt);
        setUser(userData);
      }
    } catch (error: any) {
      setError(error.message || "Ошибка авторизации");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("user_data");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        loading,
        error,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
